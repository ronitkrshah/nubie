import jwt from "jsonwebtoken";
import { AppConfig } from "../Config";

type TJwtClaims =
    | "iss"
    | "sub"
    | "aud"
    | "exp"
    | "nbf"
    | "iat"
    | "jti"
    | "name"
    | "given_name"
    | "family_name"
    | "middle_name"
    | "nickname"
    | "preferred_username"
    | "profile"
    | "picture"
    | "website"
    | "email"
    | "email_verified"
    | "gender"
    | "birthdate"
    | "zoneinfo"
    | "locale"
    | "phone_number"
    | "phone_number_verified"
    | "address"
    | "updated_at"
    | "azp"
    | "nonce"
    | "auth_time"
    | "at_hash"
    | "c_hash"
    | "acr"
    | "amr"
    | "sub_jwk"
    | "cnf"
    | "sip_from_tag"
    | "sip_date"
    | "sip_callid"
    | "sip_cseq_num"
    | "sip_via_branch"
    | "orig"
    | "dest"
    | "mky"
    | "events"
    | "toe"
    | "txn"
    | "rph"
    | "sid"
    | "vot"
    | "vtm"
    | "attest"
    | "origid"
    | "act"
    | "scope"
    | "client_id"
    | "may_act"
    | "jcard"
    | "at_use_nbr"
    | "div"
    | "opt"
    | "vc"
    | "vp"
    | "sph"
    | "ace_profile"
    | "cnonce"
    | "exi"
    | "roles"
    | "groups"
    | "entitlements"
    | "token_introspection"
    | "eat_nonce"
    | "ueid"
    | "sueids"
    | "oemid"
    | "hwmodel"
    | "hwversion"
    | "oemboot"
    | "dbgstat"
    | "location"
    | "eat_profile"
    | "submods"
    | "uptime"
    | "bootcount"
    | "bootseed"
    | "dloas"
    | "swname"
    | "swversion"
    | "manifests"
    | "measurements"
    | "measres"
    | "intuse"
    | "cdniv"
    | "cdnicrit"
    | "cdniip"
    | "cdniuc"
    | "cdniets"
    | "cdnistt"
    | "cdnistd"
    | "sig_val_claims"
    | "authorization_details"
    | "verified_claims"
    | "place_of_birth"
    | "nationalities"
    | "birth_family_name"
    | "birth_given_name"
    | "birth_middle_name"
    | "salutation"
    | "title"
    | "msisdn"
    | "also_known_as"
    | "htm"
    | "htu"
    | "ath"
    | "atc"
    | "sub_id"
    | "rcd"
    | "rcdi"
    | "crn"
    | "msgi"
    | "_claim_names"
    | "_claim_sources"
    | "rdap_allowed_purposes"
    | "rdap_dnt_allowed"
    | "geohash"
    | "_sd"
    | "_sd_alg"
    | "sd_hash"
    | "consumerPlmnId"
    | "consumerSnpnId"
    | "producerPlmnId"
    | "producerSnpnId"
    | "producerSnssaiList"
    | "producerNsiList"
    | "producerNfSetId"
    | "producerNfServiceSetId"
    | "sourceNfInstanceId"
    | "analyticsIdList"
    | "resOwnerId";

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
    public addClaim<T extends TJwtClaims | (string & {})>(
        claim: T,
        value: number | string | boolean | Array<string>,
    ) {
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
