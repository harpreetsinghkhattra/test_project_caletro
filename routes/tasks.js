import express from 'express';
import { Operations } from '../operations/operations';
import { CommonJs } from '../operations/common';
import media from './media';
import path from 'path';
import fs from 'fs';

/** Route */
var router = express.Router();

var CommonJsInstance = new CommonJs();

/** Register Client */
router.post('/signupClient', (req, res) => {
    CommonJs.validate("signupClient", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.registerationClient(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            })
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Register Lawyer */
router.post('/signupLawyer', (req, res) => {
    CommonJs.validate("signupLawyer", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.registerationLawyerup(req.body, (status, response) => {
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

/** Forget password */
router.post('/forgetPassword', (req, res) => {
    CommonJs.validate("forgetPassword", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.forgetPassword(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Change password */
router.post('/resetPassword', (req, res) => {
    CommonJs.validate("resetPassword", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.resetPassword(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    });
});

/** Verification */
router.post('/verification', (req, res) => {    
    CommonJs.validate("verification", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.verification(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Social Login */
router.post('/socialMediaLogin', (req, res) => {    
    CommonJs.validate("socialMediaLogin", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.socialLogin(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Social Registeration */
router.post('/socialMediaRegisteration', (req, res) => {  
    console.log('req.body : ', req.body);  
    CommonJs.validate("socialMediaRegisteration", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.socialRegisteration(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Resend token */
router.post('/resendVerificationToken', (req, res) => {  
    console.log('req.body : ', req.body);  
    CommonJs.validate("resendVerificationToken", req.body, (status, emptyKeys) => {
        if (status) {
            Operations.resendVerificationToken(req.body, (status, response) => {
                CommonJs.httpResponse(req, res, status, response);
            });
        } else CommonJs.httpResponse(req, res, CommonJsInstance.VALIDATE_ERROR, emptyKeys);
    })
});

/** Media files api */
router.use('/', media);

module.exports = router;
