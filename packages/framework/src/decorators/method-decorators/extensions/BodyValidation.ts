import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MethodExtensionDecorator } from "../../../abstractions/decorator-extensions";
import { TConstructor } from "../../../types";
import { InvalidRequestBodyException } from "../../../exceptions/req";

class BodyValidationDecorator extends MethodExtensionDecorator {
    public constructor(public readonly DTO: TConstructor) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const dtoInstance = plainToInstance(this.DTO, req.body);
        const validationErrors = await validate(dtoInstance);
        if (validationErrors.length > 0) {
            const errBody = validationErrors.map((err) => {
                return {
                    key: err.property,
                    problems: Object.entries(err.constraints || {}).map((constraint) => {
                        return constraint[1];
                    }),
                };
            });

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
function BodyValidation(DTO: TConstructor) {
    const factory = MethodExtensionDecorator.createDecorator(BodyValidationDecorator);
    const decorator = factory(DTO);

    return function (target: object, methodName: string, descriptor: PropertyDescriptor) {
        decorator(target, methodName, descriptor);
    };
}

export default BodyValidation;
