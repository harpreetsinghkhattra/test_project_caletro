/** Route parameters */
module.exports = {
    routesFields: {
        login: ["email", "password"],
        signup: ["email", "password"],
        addKey: ["id", "accessToken", "keyName", "imageId"],
        updateAddedKey: ["id", "accessToken", "imageId", "keyId"]
    }
}