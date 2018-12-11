import { Connection } from '../operations/connection';
import { CommonJs } from '../operations/common';
import express from 'express';
import multer from 'multer';
import { Auth } from './auth';
import { Operations } from '../operations/operations';
const router = express.Router();
var storage = multer.memoryStorage()
var upload = multer({ storage: storage, limits: { fileSize: 850000000, files: 1, fieldSize: 25 * 1024 * 1024 } });
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const CommonJSInstance = new CommonJs();
const { Readable } = require('stream');

router.get('/images/:photoID', (req, res) => {
    try {
        var photoID = new ObjectID(req.params.photoID);
    } catch (err) {
        return res.status(400).json({ message: "Invalid PhotoID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" });
    }

    Connection.connect((err, db, client) => {
        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
        else {
            let bucket = new mongodb.GridFSBucket(db, {
                bucketName: 'photos'
            });

            let downloadStream = bucket.openDownloadStream(photoID);

            downloadStream.on('data', (chunk) => {
                res.write(chunk);
            });

            downloadStream.on('error', () => {
                res.sendStatus(404);
            });

            downloadStream.on('end', () => {
                res.end();
            });
        }
    })
});

router.post('/addKey', (req, res, next) => {
    upload.single('photo')(req, res, (error) => {
        Connection.connect((err, db, client) => {
            console.log('error', error);
            console.log('err', err);
            
            if (error) return CommonJs.close(client, CommonJSInstance.ERROR, error, (status, response)=> CommonJs.httpResponse(req, res, status, response));
            if (!req.file) return CommonJs.close(client, CommonJSInstance.ERROR, err, (status, response)=> CommonJs.httpResponse(req, res, status, response));

            let photoName = `cletro-${new Date().getTime()}-${Math.random() * 100000}`;

            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, (status, response)=> CommonJs.httpResponse(req, res, status, response));
            else {
                var collection = db.collection('users');
                // Covert buffer to Readable Stream
                const readablePhotoStream = new Readable();
                readablePhotoStream.push(req.file.buffer);
                readablePhotoStream.push(null);

                let bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'photos'
                });

                let uploadStream = bucket.openUploadStream(photoName);
                let id = uploadStream.id;
                req.body.imageId = uploadStream.id;
                readablePhotoStream.pipe(uploadStream);

                uploadStream.on('error', () => CommonJs.close(client, CommonJSInstance.ERROR, {}, (status, response)=> CommonJs.httpResponse(req, res, status, response)));

                uploadStream.on('finish', () => {
                    next();
                    return;
                });
            }
        })
    });
},
    (req, res, next) => Auth.userAuth(req, res, next, 'addKey'),
    (req, res) => Operations.addKey(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response)));

router.post('/updateAddedKey', (req, res, next) => {
    upload.single('photo')(req, res, (error) => {
        Connection.connect((err, db, client) => {
            console.log('error', error);
            console.log('err', err);
            
            if (error) return CommonJs.close(client, CommonJSInstance.ERROR, error, (status, response)=> CommonJs.httpResponse(req, res, status, response));
            if (!req.file) return CommonJs.close(client, CommonJSInstance.ERROR, err, (status, response)=> CommonJs.httpResponse(req, res, status, response));

            let photoName = `cletro-${new Date().getTime()}-${Math.random() * 100000}`;

            if (err) CommonJs.httpResponse(req, res, CommonJSInstance.ERROR, err);
            else {
                var collection = db.collection('users');
                // Covert buffer to Readable Stream
                const readablePhotoStream = new Readable();
                readablePhotoStream.push(req.file.buffer);
                readablePhotoStream.push(null);

                let bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'photos'
                });

                let uploadStream = bucket.openUploadStream(photoName);
                let id = uploadStream.id;
                req.body.imageId = uploadStream.id;
                readablePhotoStream.pipe(uploadStream);

                console.log(req.body);

                uploadStream.on('error', () => CommonJs.close(client, CommonJSInstance.ERROR, {}, (status, response)=> CommonJs.httpResponse(req, res, status, response)));

                uploadStream.on('finish', () => {
                    next();
                    return;
                });
            }
        })
    });
},
    (req, res, next) => Auth.userAuth(req, res, next, 'updateAddedKey'),
    (req, res) => Operations.updateAddedKey(req.body, (status, response) => CommonJs.httpResponse(req, res, status, response)));

module.exports = router;