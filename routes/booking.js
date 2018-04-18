import express from 'express';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import media from './media';
import path from 'path';
import fs from 'fs';

/** Route */
var routes = express.Router();
var CommonJsInstance = new CommonJs();

routes.post('/lawyer/addClient', (req, res) => {
    CommonJs.validate("lawyerAddClient", req.body, (status, emptyKeys) => {
        if (status) {

            //Temporary image file path
            var pathh = req.body.imagePath && req.body.imagePath !== "" ? req.body.imagePath : "protect_from_null_data";
            var existedFile = path.join(__dirname, '..', pathh);
            console.log(existedFile);
            fs.lstat(existedFile, (err, stats) => {
                if (err) {
                    req.body.imagePath = null;
                    Operations.addLawyerClient(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response))
                }
                if (stats) {
                    //File transformation while registeration
                    var filePath = path.join(__dirname, '../public/uploadFiles/uploadedFiles', path.parse(existedFile).base);
                    fs.createReadStream(existedFile)
                        .pipe(fs.createWriteStream(filePath));
                    req.body.imagePath = path.join('/uploadFiles/uploadedFiles', path.parse(existedFile).base);
                    req.body.existedFile = existedFile;
                    Operations.addLawyerClient(req.body, (status, response) => {
                        console.log('existedFile', existedFile);
                        if (status === CommonJsInstance.SUCCESS) fs.unlink(existedFile);
                        CommonJs.httpResponse(req, res, status, response)
                    });
                }
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/searchClient', (req, res) => {
    CommonJs.validate("searchLawyerClient", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.searchLawyerClients(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getAllClients', (req, res) => {
    CommonJs.validate("getAllLawyerClients", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getAllLawyerClients(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/registerBooking', (req, res) => {
    CommonJs.validate("registerBookingFromLawyer", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.registerBookingClients(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getClientInfo', (req, res) => {
    CommonJs.validate("getClientInfo", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getClientInfo(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getBookingInfo', (req, res) => {
    CommonJs.validate("getBookingInfo", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getBookings(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/denyBooking', (req, res) => {
    CommonJs.validate("denyBooking", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.denyBooking(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/clientBookings', (req, res) => {
    CommonJs.validate("clientBookings", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.allClientBookings(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getAllBookings', (req, res) => {
    CommonJs.validate("getAllBookings", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getAllLawyerBookings(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/changeViewBookingStatus', (req, res) => {
    CommonJs.validate("changeViewBookingStatus", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.changeBookingViewStatus(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getAllUnreadBookings', (req, res) => {
    CommonJs.validate("getAllUnreadBookings", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getUnreadBookings(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/recentLawyers', (req, res) => {
    CommonJs.validate("recentLawyers", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getRecentLawyers(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getUserInfo', (req, res) => {
    CommonJs.validate("getUserInfo", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getUserInfo(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getUnreadAndDeniedBookingsForLawyer', (req, res) => {
    CommonJs.validate("getUnreadAndDeniedBookingsForLawyer", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getUnreadAndDeniedBookingsForLawyer(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getAllClientBookings', (req, res) => {
    CommonJs.validate("getAllClientBookings", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getAllClientBookings(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/acceptBooking', (req, res) => {
    CommonJs.validate("acceptBooking", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.acceptBooking(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/lawyer/getNewBookingRequests', (req, res) => {
    CommonJs.validate("getNewBookingRequests", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getNewBookingRequests(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

routes.post('/addServices', (req, res) => {
    CommonJs.validate("addServices", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.addServices(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
})
module.exports = routes;