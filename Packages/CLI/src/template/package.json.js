function getPackageJson(name) {
    return {
        name,
        version: "1.0.0",
        main: "build/index.js",
        scripts: {
            build: "tsc",
            run: "node build/index.js",
        }
    };
}

module.exports = getPackageJson;