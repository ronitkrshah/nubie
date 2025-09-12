import jwt from "jsonwebtoken";
import { AppConfig } from "../config";

type TClaims = "iat" | "exp" | "nbf" | "iss" | "aud" | "sub" | "role";

/**
 * Utility class for managing JWT tokens.
 *
 * Supports adding claims, generating signed tokens, and verifying incoming tokens.
 */
export default class JWTToken {
    private readonly _claims: Record<string, number | string | boolean | Array<string>>;

    constructor() {
        this._claims = {};
    }

    /**
     * Adds a claim to the token payload.
     *
     * @param claim The claim name (standard or custom).
     * @param value The value associated with the claim.
     */
    public addClaim<T extends TClaims | (string & {})>(claim: T, value: number | string | boolean | Array<string>) {
        this._claims[claim] = value;
    }

    /**
     * Generates a signed JWT token using the configured secret key.
     *
     * @throws If the JWT secret key is missing in the config.
     * @returns A signed JWT string.
     */
    public async generateTokenAsync() {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) throw new Error("JWT Secret Not Found");
        return jwt.sign(this._claims, config.jwtSecretKey);
    }

    /**
     * Verifies a JWT token using the configured secret key.
     *
     * @param token The JWT string to verify.
     * @throws If the JWT secret key is missing in the config.
     * @returns The decoded token payload if verification succeeds.
     */
    public static async verifyTokenAsync(token: string) {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) throw new Error("JWT Secret Not Found");
        return jwt.verify(token, config.jwtSecretKey);
    }
}
