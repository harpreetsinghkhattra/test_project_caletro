import { Connection } from './connection';
import { CommonJs } from './common';
import { ObjectId, ObjectID } from 'mongodb';
import SendMail from './sendMail';
import path from 'path';

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
                CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                    collection.find({ email: obj.email.toLowerCase(), password: password }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length !== 0) {
                            console.log(data[0]);
                            if (data[0].verificationCode === 1) {
                                CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                                    if (TOKEN) {
                                        collection.update({ email: obj.email.toLowerCase(), password: password }, {
                                            $set: {
                                                userAccessToken: TOKEN,
                                                updatedTime: new Date().getTime()
                                            }
                                        }, (err, success) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                            else {
                                                var temp = data[0];
                                                temp.password = "xxxxxx";
                                                temp.salt = "xxxxxx";
                                                temp.userAccessToken = TOKEN;
                                                CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                            }
                                        });
                                    } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                                });
                            } else CommonJs.close(client, CommonJSInstance.VARIFICATION_ERROR, [], cb);
                        } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                    })
                })
            }
        })
    }

    /**
     * Registeration of client
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static registerationClient(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                    collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length === 0) {
                            collection.insert({
                                email: obj.email.toLowerCase(),
                                password: password,
                                userType: obj.userType,
                                latitude: obj.latitude,
                                longitude: obj.longitude,
                                verificationToken: null,
                                verificationCode: 0,
                                status: 0,
                                deletedStatus: 0,
                                salt: salt,
                                createdTime: new Date().getTime(),
                                updatedTime: new Date().getTime()
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else {
                                    var response = data.ops[0];
                                    if (response && response.password) response.password = "xxxxxx"

                                    //Create random password key
                                    var randomeToken = Math.floor(Math.random() * 1000000) + '';
                                    console.log(randomeToken);
                                    CommonJs.randomPassword(response.email, randomeToken, (token, salt) => {
                                        var mailSentOpt = {
                                            email: response.email,
                                            token: randomeToken
                                        }

                                        collection.update({ email: obj.email.toLowerCase() }, {
                                            $set: {
                                                verificationToken: token,
                                                deletedStatus: 1,
                                                updatedTime: new Date().getTime()
                                            }
                                        }, (err, data) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                            else SendMail.signupSuccess(mailSentOpt, (status, res) => CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb));
                                        });
                                    });
                                }
                            });
                        } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                    })
                })
            }
        })
    }

    /**
     * Registeration of lawyerup
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static registerationLawyerup(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                    collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length === 0) {
                            collection.insert({
                                email: obj.email.toLowerCase(),
                                password: password,
                                userType: obj.userType,
                                name: obj.name,
                                law_firm: obj.law_firm,
                                latitude: obj.latitude,
                                longitude: obj.longitude,
                                verificationToken: null,
                                verificationCode: 0,
                                status: 0,
                                deletedStatus: 0,
                                salt: salt,
                                createdTime: new Date().getTime(),
                                updatedTime: new Date().getTime()
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                else {
                                    var response = data.ops[0];
                                    if (response && response.password) response.password = "xxxxxx"

                                    //Create random password key
                                    var randomeToken = Math.floor(Math.random() * 1000000) + '';
                                    console.log(randomeToken);
                                    CommonJs.randomPassword(response.email, randomeToken, (token, salt) => {
                                        var mailSentOpt = {
                                            email: response.email,
                                            token: randomeToken
                                        }

                                        collection.update({ email: obj.email.toLowerCase() }, {
                                            $set: {
                                                verificationToken: token,
                                                deletedStatus: 1,
                                                updatedTime: new Date().getTime()
                                            }
                                        }, (err, data) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                            else SendMail.signupSuccess(mailSentOpt, (status, res) => CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb));
                                        });
                                    });
                                }
                            });
                        } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                    })
                })
            }
        })
    }

    /**
     * Forget password
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static forgetPassword(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {

                        //Create random password key
                        obj.randomPassword = Math.floor(Math.random() * 1000000) + '';

                        CommonJs.randomPassword(obj.email.toLowerCase(), obj.randomPassword, (password, salt) => {
                            console.log(password);
                            collection.update({ email: obj.email.toLowerCase() }, {
                                $set: {
                                    password: password,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                else SendMail.forgetPassword(obj, (status, response) => CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb));
                            })
                        })
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                })
            }
        })
    }

    /**
     * Verification
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static verification(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');

                CommonJs.randomPassword(obj.email.toLowerCase(), obj.token, (token, salt) => {
                    collection.find({ email: obj.email.toLowerCase(), verificationCode: 0, verificationToken: token }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length !== 0) {
                            console.log(token);
                            collection.update({ email: obj.email.toLowerCase(), verificationCode: 0, verificationToken: token }, {
                                $set: {
                                    verificationCode: 1,
                                    verificationToken: null,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                else CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                            })
                        } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                    })
                });
            }
        })
    }

    /**
     * Social Login's Registeration
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static socialRegisteration(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ userId: obj.id }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length === 0) {
                        collection.insert({
                            email: obj.email && obj.email.toLowerCase(),
                            userType: obj.userType,
                            userId : obj.id,
                            loginType : obj.loginType,
                            name: obj.name,
                            firstName: obj.firstName,
                            lastName: obj.lastName,
                            imgPath: obj.imgPath,
                            latitude: obj.latitude,
                            longitude: obj.longitude,
                            verificationCode: 1,
                            verificationToken: null,
                            status: 0,
                            deletedStatus: 0,
                            createdTime: new Date().getTime(),
                            updatedTime: new Date().getTime()
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else {
                                var response = data.ops[0];
                                CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb)
                            }
                        });
                    } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                })
            }
        })
    }

    /**
     * Social Login
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static socialLogin(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ userId: obj.id }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        var response = data[0];
                        if (response && response.password) response.password = "xxxxxx"
                        CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb);
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                })
            }
        })
    }

    /**
     * Reset password
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static resetPassword(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                console.log('obj', obj);

                var collection = db.collection('users');
                collection.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        console.log('obj', obj);

                        CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                            collection.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, {
                                $set: {
                                    password: password,
                                    updatedTime: new Date().getTime()
                                }
                            }, (err, data) => {
                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb)
                                else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                            })
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        })
    }
}
