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
        getClientInfo: ["id", "accessToken", "cid"],
        getBookingInfo: ["id", "accessToken", "lawerId", "bookingId"],
        denyBooking: ["id", "accessToken", "bookingId", "deleteType"],
        getAllBookings: ["id", "accessToken", "lawyerId"],
        changeViewBookingStatus: ["id", "accessToken", "lawyerId", "bookingId"],
        getAllUnreadClientBookings: ["id", "accessToken", "clientId"],
        logout: ["id", "accessToken"],
        isLogedIn: ["id", "accessToken"],
        recentLawyers: ["id", "accessToken"],
        getUserInfo: ["id", "accessToken", "uid"],

        getUnreadAndDeniedBookingsForLawyer: ["id", "accessToken", "lawyerId"],
        getAllClientBookings: ["id", "accessToken"],
        acceptBooking: ["id", "accessToken", "bookingId"],
        getNewBookingRequests: ["id", "accessToken"],

        markAsViewedBookingRequestByLawyer: ["id", "accessToken", "bookingId"],
        getUnreadAndDeniedBookingsForClient: ["id", "accessToken", "clientId"],
        markAsViewedBookingRequestByClient: ["id", "accessToken", "bookingId"],

        markAsViewedDenyBooking: ["id", "accessToken", "bookingId", "userType"],

        editLawyerProfile: ["id", "accessToken", "name", "qualifications", "phone", "name", "email"],
        editClientProfile: ["id", "accessToken", "name", "dob", "phone", "name", "email"],
        addServices: ["id", "accessToken", "name", "description", "price", "notes", "duration"]
    }
}