import jwt from "jsonwebtoken";
import { AppConfig } from "../config";

type TClaims = "iat" | "exp" | "nbf" | "iss" | "aud" | "sub" | "role";

export default class JWTToken {
    private readonly _claims: Record<string, number | string | boolean | Array<string>>;

    constructor() {
        this._claims = {};
    }

    public addClaim<T extends TClaims | (string & {})>(claim: T, value: number | string | boolean | Array<string>) {
        this._claims[claim] = value;
    }

    public async generateTokenAsync() {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) throw new Error("JWT Secret Not Found");
        return jwt.sign(this._claims, config.jwtSecretKey);
    }

    public static async verifyTokenAsync(token: string) {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) throw new Error("JWT Secret Not Found");
        return jwt.verify(token, config.jwtSecretKey);
    }
}
