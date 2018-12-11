import { Connection } from './connection';
import { CommonJs } from './common';
import { ObjectId, ObjectID } from 'mongodb';
import SendMail from './sendMail';
import path from 'path';
import fs from 'fs';
import moment from 'moment-timezone';

//Time zone
var TIME_ZONE = "America/New_York";

const CommonJSInstance = new CommonJs();
export class Operations {

    /**
     * Login of user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static login(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        obj.salt = data[0].salt ? data[0].salt : 'any';
                        CommonJs.randomPassword(obj.salt, obj.password, (password, salt) => {
                            collection.find({ email: obj.email.toLowerCase(), password: password }).toArray((err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                if (data && data.length !== 0) {
                                    var temp = data[0];
                                    temp.password = "xxxxxx";
                                    temp.salt = "xxxxxx";
                                    CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                            })
                        })
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        })
    }

    /**
     * Registeration of user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static registerationOfUser(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                    collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length === 0) {
                            CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                                if (TOKEN) {
                                    collection.insert({
                                        email: obj.email.toLowerCase(),
                                        password: password,
                                        status: 0,
                                        deletedStatus: 0,
                                        userAccessToken: TOKEN,
                                        salt: salt,
                                        createdTime: new Date().getTime(),
                                        updatedTime: new Date().getTime()
                                    }, (err, data) => {
                                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                        else {
                                            var response = data.ops[0];
                                            if (response && response.password) response.password = "xxxxxx"

                                            CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb);
                                        }
                                    });
                                } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                            });
                        } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                    })
                })
            }
        })
    }

    /**
     * Add key
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static addKey(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('keys');
                collection.insert({
                    userId: new ObjectId(obj.id),
                    keyName: obj.keyName,
                    images: [obj.imageId],
                    status: 0,
                    deletedStatus: 0,
                    createdTime: new Date().getTime(),
                    updatedTime: new Date().getTime()
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else {
                        var response = data.ops[0];
                        if (response && response.password) response.password = "xxxxxx"

                        CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb);
                    }
                });
            }
        })
    }

    /**
     * Update added key
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static updateAddedKey(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('keys');
                collection.updateOne({ _id: new ObjectId(obj.keyId) }, {
                    $addToSet: {
                        images: obj.imageId
                    }
                }, (err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                });
            }
        })
    }

    /**
     * Is user logged in
     */
    static isUserLoggedIn(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');

                // Check in users
                users.find({ _id: new ObjectId(obj.id) }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) cb(CommonJSInstance.LOGED_IN);
                            else CommonJs.close(client, CommonJSInstance.LOGED_OUT, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        })
    }

}

