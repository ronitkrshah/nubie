import { TClaim } from "./TClaims";
import { INubieConfig } from "../../config";
import { MissingJwtSecretException } from "./exceptions";
import jwt from "jsonwebtoken";
import { AppContext } from "../../../AppContext";

export class JwtToken {
    private _claims: Record<string, unknown> = {};
    private readonly _authConfig: INubieConfig["authentication"];

    public constructor() {
        const config = AppContext.getInstance().config.getSection("authentication");
        if (!config?.secretKey) throw new MissingJwtSecretException();
        this._authConfig = config;
    }

    public addClaim(claim: TClaim, value: unknown) {
        this._claims[claim] = value;
    }

    public removeClaim(claim: TClaim) {
        delete this._claims[claim];
    }

    public generateToken() {
        return jwt.sign(this._claims, this._authConfig!.secretKey!);
    }

    public static verifyToken(token: string) {
        const config = AppContext.getInstance().config.getSection("authentication");
        if (!config?.secretKey) throw new MissingJwtSecretException();
        return jwt.verify(token, config.secretKey);
    }
}
