import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MethodExtensionDecorator } from "../../../abstracts";
import { HttpStatusCodes } from "../../../core";
import { NubieError } from "../../../helpers";
import { TClass } from "../../../types";

class BodyValidationDecorator extends MethodExtensionDecorator {
    public constructor(public readonly DTO: TClass) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.method === "GET") {
            throw new NubieError(
                "GET requests should not contain a request body. Consider using POST or PATCH.",
                HttpStatusCodes.BadRequest,
            );
        }

        const dtoInstance = plainToInstance(this.DTO, req.body);
        const validationErrors = await validate(dtoInstance);
        if (validationErrors.length > 0) {
            throw new NubieError("RequestBodyValidationFailed", HttpStatusCodes.BadRequest, validationErrors);
        }
    }
}

function BodyValidation(DTO: TClass) {
    const factory = MethodExtensionDecorator.createDecorator(BodyValidationDecorator);
    const decorator = factory(DTO);

    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {
        decorator(target, methodName, descriptor);

        // Future Implementation
        // NubieMethodDecorator.updateMethodMetadata(target, methodName, {
        //     body: {},
        // });
    };
}

export default BodyValidation;
