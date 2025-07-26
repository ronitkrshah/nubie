import { Request, Response, NextFunction } from "express";
import { NubieExtensionMethodDecorator, NubieMethodDecorator } from "../../abstracts";
import { TClass } from "../../../types";
import { plainToInstance, instanceToPlain, ClassTransformer } from "class-transformer";
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

function BodyValidation(DTO: TClass) {
    const factory = NubieExtensionMethodDecorator.createDecorator(BodyValidationDecorator);
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
