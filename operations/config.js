/** Route parameters */
module.exports = {
    routesFields : {
        login : ["email", "password"],
        signupClient : ["userType", "email", "password", "latitude", "longitude", "loginType"],
        signupLawyer : ["userType", "email", "password", "name", "law_firm", "latitude", "longitude"],
        forgetPassword : ["email"], 
        verification : ["email", "token"],
        resetPassword : ["id", "accessToken", "password"],
        socialMediaLogin : ["id", "email"],
        socialMediaRegisteration : ["id", "userType", "email", "loginType", "latitude", "longitude"]
    }
}