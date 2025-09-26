import jwt from "jsonwebtoken";
import { ApplicationConfig } from "../Configuration";
import type JwtClaim from "./JwtClaim";

/**
 * Utility class for managing JWT tokens.
 *
 * Supports adding claims, generating signed tokens, and verifying incoming tokens.
 */
export default class JwtToken {
    public claims: JwtClaim[] = [];

    /**
     * Generates a signed JWT token using the configured secret key.
     *
     * @throws If the JWT secret key is missing in the config.
     * @returns A signed JWT string.
     */
    public async generateToken() {
        const config = ApplicationConfig.getSection("Authentication");
        if (!config?.SecretKey) throw new Error("JWT Secret Not Found");
        return jwt.sign(
            this.claims.map((it) => ({ [it.jwtKey]: [it.value] })),
            config.SecretKey,
        );
    }

    /**
     * Verifies a JWT token using the configured secret key.
     *
     * @param token The JWT string to verify.
     * @throws If the JWT secret key is missing in the config.
     * @returns The decoded token payload if verification succeeds.
     */
    public static verifyToken(token: string) {
        const config = ApplicationConfig.getSection("Authentication");
        if (!config?.SecretKey) throw new Error("JWT Secret Not Found");
        return jwt.verify(token, config.SecretKey);
    }
}
