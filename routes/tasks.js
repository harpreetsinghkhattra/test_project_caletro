import express from 'express';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import media from './media1';
import path from 'path';
import fs from 'fs';

/** Route */
var router = express.Router();

var CommonJsInstance = new CommonJs();

/** Register Lawyer */
router.post('/signup', (req, res) => {
    CommonJs.validate("signup", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.registerationOfUser(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Login */
router.post('/login', (req, res) => {
    console.log(req.body);
    CommonJs.validate("login", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.login(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Media files api */
router.use('/', media);

module.exports = router;
