import type { Request } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MethodExtensionDecorator } from "../../../Abstractions";
import { InvalidRequestBodyException } from "../../../Exceptions";

class BodyValidationDecorator extends MethodExtensionDecorator {
    public constructor(public readonly DTO: Class) {
        super();
    }

    public async executeAsync(req: Request): Promise<void> {
        const dtoInstance = plainToInstance(this.DTO, req.body);
        const validationErrors = await validate(dtoInstance);
        if (validationErrors.length > 0) {
            throw new InvalidRequestBodyException();
        }
    }
}

/**
 * Validates the request body against the provided DTO class.
 *
 * @param DTO The class used for validation schema.
 * @returns A method decorator that performs validation before execution.
 */
function BodyValidation(DTO: Class) {
    const factory = MethodExtensionDecorator.createDecorator(BodyValidationDecorator);
    const decorator = factory(DTO);

    return function (target: object, methodName: string, descriptor: PropertyDescriptor) {
        decorator(target, methodName, descriptor);
    };
}

export default BodyValidation;
