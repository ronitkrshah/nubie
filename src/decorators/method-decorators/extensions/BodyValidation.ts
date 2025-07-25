import { Request, Response, NextFunction } from "express";
import { NubieExtensionMethodDecorator } from "../../helpers";
import { TClass } from "../../../interfaces";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

class BodyValidationDecorator extends NubieExtensionMethodDecorator {
    public constructor(public readonly DTO: TClass) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const dtoInstance = plainToInstance(this.DTO, req.body);
        const validationErrors = await validate(dtoInstance);
        if (validationErrors.length > 0) {
            throw new Error("Request Body Validation Failed");
        }
    }
}

const BodyValidation = NubieExtensionMethodDecorator.createDecorator(BodyValidationDecorator);

export default BodyValidation;
