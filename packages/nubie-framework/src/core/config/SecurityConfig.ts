class SecurityConfig {
    /**
     * This secret will be used to verify the middlewares
     */
    public jwtSecret: string | null = null;
}

export default new SecurityConfig();
