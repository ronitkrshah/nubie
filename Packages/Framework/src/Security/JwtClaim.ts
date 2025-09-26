import type { TJwtClaim } from "./TJwtClaim";

export default class JwtClaim {
    public constructor(
        public readonly jwtKey: TJwtClaim,
        public readonly value: unknown,
    ) {}
}
