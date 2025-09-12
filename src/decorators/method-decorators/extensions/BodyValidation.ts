import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MethodExtensionDecorator } from "../../../base";
import { HttpStatusCodes } from "../../../core";
import { NubieError } from "../../../utils";
import { TConstructor } from "../../../types";

class BodyValidationDecorator extends MethodExtensionDecorator {
    public constructor(public readonly DTO: TConstructor) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.method === "GET") {
            throw new NubieError(
                "GET requests shouldn’t carry a body — consider POST or PATCH instead.",
                HttpStatusCodes.BadRequest,
            );
        }

        const dtoInstance = plainToInstance(this.DTO, req.body);
        const validationErrors = await validate(dtoInstance);
        if (validationErrors.length > 0) {
            throw new NubieError(
                "Request body validation failed — the form didn’t pass inspection.",
                HttpStatusCodes.BadRequest,
                validationErrors,
            );
        }
    }
}

function BodyValidation(DTO: TConstructor) {
    const factory = MethodExtensionDecorator.createDecorator(BodyValidationDecorator);
    const decorator = factory(DTO);

    return function (target: object, methodName: string, descriptor: PropertyDescriptor) {
        decorator(target, methodName, descriptor);
    };
}

export default BodyValidation;
