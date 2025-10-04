import { RestMethodExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { InvalidRequestBodyException } from "../../../exceptions";

class BodyValidationDecorator extends RestMethodExtension {
    public constructor(public readonly dto: TClass) {
        super();
    }

    public async handleAsync({ req, next }: THttpContext): Promise<void> {
        const dtoInstance = plainToInstance(this.dto, req.body);
        const validationErrors = await validate(dtoInstance);
        if (validationErrors.length > 0) throw new InvalidRequestBodyException();

        next();
    }
}

export const BodyValidation = RestMethodExtension.createDecorator(BodyValidationDecorator);
