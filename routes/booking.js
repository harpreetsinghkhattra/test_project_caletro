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
    CommonJs.validate("getLawyerClientInfo", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.getLaywerClientInfo(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response));
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

module.exports = routes;