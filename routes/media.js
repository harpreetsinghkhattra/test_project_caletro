import express from 'express';
import multer from 'multer';
var router = express.Router();
import fs from 'fs';
import path from 'path';

/** Media files storage */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploadFiles/tempUploadedFiles'))
    },
    filename: (req, file, cb) => {
        console.log("file ======", file);
        var randomNumber = Math.floor(Math.random() * 10000);
        var time = new Date().getTime();
        let imagePath = path.join('/public/uploadFiles/tempUploadedFiles', time + '' + randomNumber + 'lawyerup.' + file.mimetype.split('/')[1]);
        req.session.imagePath.push(imagePath);
        cb(null, time + '' + randomNumber + 'lawyerup.' + file.mimetype.split('/')[1]);
    }
});

var upload = multer({ storage: storage }).any();
router.post('/upload', (req, res) => {
    req.session.imagePath = []
    upload(req, res, (err, data) => {
        console.log(req.headers, req.file, req.body);
        console.log("err==========", err, data);
        if (err) {
            res.status(200)
                .json({
                    code: 0,
                    message: 'Error',
                    data: err
                })
        } else {
            res.status(200)
                .json({
                    code: 1,
                    message: 'Success',
                    data: req.session.imagePath
                }).end();
        }
    });
});
module.exports = router;