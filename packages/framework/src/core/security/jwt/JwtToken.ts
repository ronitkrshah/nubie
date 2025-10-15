import { TClaim } from "./TClaims";
import { GlobalContainer } from "@nubie/di";
import { Config } from "../../config";
import { MissingJwtSecretException } from "./exceptions";
import jwt from "jsonwebtoken";

export class JwtToken {
    private _claims: Record<string, unknown> = {};

    public constructor() {
        const config = GlobalContainer.resolveInstance<Config>(Config.Token).getSection(
            "authentication",
        );

        if (!config?.secretKey) throw new MissingJwtSecretException();
    }

    public addClaim(claim: TClaim, value: unknown) {
        this._claims[claim] = value;
    }

    public removeClaim(claim: TClaim) {
        delete this._claims[claim];
    }

    public generateToken() {
        const config = GlobalContainer.resolveInstance<Config>(Config.Token).getSection(
            "authentication",
        );

        return jwt.sign(this._claims, config!.secretKey!);
    }

    public static verifyToken(token: string) {
        const config = GlobalContainer.resolveInstance<Config>(Config.Token).getSection(
            "authentication",
        );

        if (!config?.secretKey) throw new MissingJwtSecretException();
        return jwt.verify(token, config.secretKey);
    }
}
