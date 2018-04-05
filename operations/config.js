/** Route parameters */
module.exports = {
    routesFields: {
        login: ["email", "password"],
        signupClient: ["userType", "email", "password", "latitude", "longitude"],
        signupLawyer: ["userType", "email", "password", "name", "law_firm", "latitude", "longitude"],
        forgetPassword: ["email"],
        verification: ["email", "token"],
        resetPassword: ["id", "accessToken", "password"],
        socialMediaLogin: ["id", "email"],
        socialMediaRegisteration: ["id", "userType", "email", "loginType", "latitude", "longitude"],
        resendVerificationToken: ["email"],
        lawyerAddClient: ["id", "accessToken", "phone", "email", "name"],
        searchLawyerClient: ["id", "accessToken", "name"],
        getAllLawyerClients: ["id", "accessToken"],
        registerBookingFromLawyer: ["id", "accessToken", "lawyerId", "userId", "date", "from", "to", "preliminaryNotes", "serviceType", "cost", "activeStatus", "services"],
        clientBookings: ["id", "accessToken", "lawyerId", "clientId"],
        getLawyerClientInfo: ["id", "accessToken", "cid"],
        getBookingInfo: ["id", "accessToken", "lawerId", "bookingId"],
        denyBooking: ["id", "accessToken", "lawyerId", "bookingId", "deleteType"],
        getAllBookings : ["id", "accessToken", "lawyerId"],
        changeViewBookingStatus: ["id", "accessToken", "lawyerId", "bookingId"],
        getAllUnreadClientBookings: ["id", "accessToken", "clientId"],
    }
}