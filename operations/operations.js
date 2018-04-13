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
                CommonJs.randomPassword(obj.email.toLowerCase(), obj.password, (password, salt) => {
                    collection.find({ email: obj.email.toLowerCase(), password: password }).toArray((err, data) => {
                        if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        if (data && data.length !== 0) {
                            console.log(data[0]);
                            if (data[0].verificationCode === 1) {
                                var temp = data[0];
                                temp.password = "xxxxxx";
                                temp.salt = "xxxxxx";
                                CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                // CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                                //     if (TOKEN) {
                                //         collection.update({ email: obj.email.toLowerCase(), password: password }, {
                                //             $set: {
                                //                 userAccessToken: TOKEN,
                                //                 updatedTime: new Date().getTime()
                                //             }
                                //         }, (err, success) => {
                                //             if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                //             else {
                                //                 var temp = data[0];
                                //                 temp.password = "xxxxxx";
                                //                 temp.salt = "xxxxxx";
                                //                 temp.userAccessToken = TOKEN;
                                //                 CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                //             }
                                //         });
                                //     } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                                // });
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
                            CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                                if (TOKEN) {
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
                                        userAccessToken: TOKEN,
                                        salt: salt,
                                        createdTime: moment.tz(new Date(), TIME_ZONE).format(),
                                        updatedTime: moment.tz(new Date(), TIME_ZONE).format()
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
                                } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
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
                            CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                                if (TOKEN) {
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
                                        userAccessToken: TOKEN,
                                        status: 0,
                                        deletedStatus: 0,
                                        salt: salt,
                                        createdTime: moment.tz(new Date(), TIME_ZONE).format(),
                                        updatedTime: moment.tz(new Date(), TIME_ZONE).format()
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
                                } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
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
                                    requireResetPassword: true,
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
                        collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length === 0) {

                                collection.find({ email: obj.email.toLowerCase(), userId: obj.id }).toArray((err, data) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (data && data.length !== 0) {
                                        CommonJs.generateToken(obj.id.toLowerCase(), (TOKEN, salt) => {
                                            if (TOKEN) {
                                                collection.insert({
                                                    email: obj.email && obj.email.toLowerCase(),
                                                    userType: obj.userType,
                                                    userId: obj.id,
                                                    loginType: obj.loginType,
                                                    name: obj.name,
                                                    firstName: obj.firstName,
                                                    userName: obj.username,
                                                    lastName: obj.lastName,
                                                    imgPath: obj.imgPath,
                                                    latitude: obj.latitude,
                                                    longitude: obj.longitude,
                                                    userAccessToken: TOKEN,
                                                    verificationCode: 1,
                                                    verificationToken: null,
                                                    status: 0,
                                                    deletedStatus: 0,
                                                    createdTime: moment.tz(new Date(), TIME_ZONE).format(),
                                                    updatedTime: moment.tz(new Date(), TIME_ZONE).format()
                                                }, (err, data) => {
                                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                                    else {
                                                        var response = data.ops[0];
                                                        CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb)
                                                    }
                                                });
                                            } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                                        });
                                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                });
                            } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                });
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
                collection.find({ email: obj.email.toLowerCase(), userId: obj.id }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        var temp = data[0];
                        temp.password = "xxxxxx";
                        temp.salt = "xxxxxx";
                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                        // CommonJs.generateToken(obj.email.toLowerCase(), (TOKEN, salt) => {
                        //     if (TOKEN) {
                        //         collection.update({ email: obj.email.toLowerCase(), userId: obj.id }, {
                        //             $set: {
                        //                 userAccessToken: TOKEN,
                        //                 updatedTime: new Date().getTime()
                        //             }
                        //         }, (err, success) => {
                        //             if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                        //             else {
                        //                 var temp = data[0];
                        //                 temp.password = "xxxxxx";
                        //                 temp.salt = "xxxxxx";
                        //                 temp.userAccessToken = TOKEN;
                        //                 CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                        //             }
                        //         });
                        //     } else CommonJs.close(client, CommonJSInstance.TOKEN_ERROR, [], cb);
                        // });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        })
    }

    /**
     * Logout of user
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static logout(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        CommonJs.generateToken(obj.id.toLowerCase(), (TOKEN, salt) => {
                            if (TOKEN) {
                                collection.update({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }, {
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
                                    requireResetPassword: false,
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

    /**
     * Resend verification token
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static resendVerificationToken(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                collection.find({ email: obj.email.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        var response = data[0];
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
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                })
            }
        })
    }

    /**
     * Lawyer add client
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static addLawyerClient(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var collection = db.collection('lawyerClients');

                this.isEmailPresent(obj.email, (status) => {
                    if (status) {
                        users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                collection.find({ email: obj.email.toLowerCase(), lawerId: obj.id }).toArray((err, data) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (data && data.length === 0) {
                                        collection.insert({
                                            lawerId: obj.id,
                                            email: obj.email.toLowerCase(),
                                            phone: obj.phone,
                                            name: obj.name,
                                            imagePath: obj.imagePath ? CommonJSInstance.BASE_URL + obj.imagePath : null,
                                            status: 0,
                                            deletedStatus: 0,
                                            createdTime: moment.tz(new Date(), TIME_ZONE).format(),
                                            updatedTime: moment.tz(new Date(), TIME_ZONE).format()
                                        }, (err, data) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                            else {
                                                var response = data.ops[0];
                                                CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb);
                                            }
                                        });
                                    } else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                                })
                            } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.EMAIL_PRESENT, [], cb);
                });
            }
        });
    }

    /**
     * Internally check email is present or not
     */
    static isEmailPresent(email, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var lawyerClients = db.collection('lawyerClients');

                // Check in users
                users.find({ email: email.toLowerCase() }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length === 0) {

                        // Check in lawyers
                        lawyerClients.find({ email: email.toLowerCase() }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length === 0) cb(true);
                            else cb(false);
                        });
                    } else cb(false);;
                });
            }
        })
    }

    /**
     * Client Search
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static searchLawyerClients(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                var lawyerClients = db.collection('lawyerClients');
                // console.log(obj.name);
                // obj.name = obj.name ? obj.name.toLowerCase() : '';
                collection.find({ _id: new ObjectID(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        lawyerClients.find({ lawerId: obj.id }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                var tempSearch = [];

                                data.forEach((element, index) => {
                                    if (element.name && element.name.indexOf(obj.name) > -1) tempSearch.push({ index: index, indexOf: element.name.indexOf(obj.name), element: element });
                                    console.log('name => ', obj.name, element.name);
                                    console.log('data =>', tempSearch);
                                    if (data.length - 1 === index) {
                                        console.log(tempSearch.length);
                                        tempSearch.sort(function (a, b) {
                                            if (a.indexOf < b.indexOf)
                                                return -1;
                                            if (a.indexOf > b.indexOf)
                                                return 1;
                                            return 0;
                                        });

                                        tempSearch.sort(function (a, b) {
                                            if (a.index < b.index)
                                                return -1;
                                            if (a.index > b.index)
                                                return 1;
                                            return 0;
                                        });

                                        tempSearch = tempSearch.filter(function (item, pos, ary) {
                                            return !pos || (item.index != ary[pos - 1].index);
                                        });

                                        tempSearch.sort(function (a, b) {
                                            if (a.indexOf < b.indexOf)
                                                return -1;
                                            if (a.indexOf > b.indexOf)
                                                return 1;
                                            return 0;
                                        });

                                        CommonJs.close(client, CommonJSInstance.SUCCESS, tempSearch, cb);
                                    }
                                });
                            } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        })
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get all lawyer clients
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAllLawyerClients(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var collection = db.collection('users');
                var lawyerClients = db.collection('lawyerClients');

                collection.find({ _id: new ObjectID(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        lawyerClients.find({ lawerId: obj.id }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        })
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Register booking
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static registerBookingClients(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.insert({
                            lawerId: obj.lawyerId,
                            userId: obj.userId,
                            date: moment.tz(obj.date, TIME_ZONE).format(),
                            from: moment.tz(obj.from, TIME_ZONE).format(),
                            to: moment.tz(obj.to, TIME_ZONE).format(),
                            preliminaryNotes: obj.preliminaryNotes,
                            serviceType: obj.serviceType,
                            services: obj.services,
                            cost: obj.cost,
                            activeStatus: obj.activeStatus,
                            status: 0,
                            clientReadStatus: 0,
                            lawyerReadStatus: 0,
                            deletedStatus: 0,
                            createdTime: moment.tz(new Date(), TIME_ZONE).format(),
                            updatedTime: moment.tz(new Date(), TIME_ZONE).format()
                        }, (err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            else {
                                var response = data.ops[0];
                                CommonJs.close(client, CommonJSInstance.SUCCESS, response, cb);
                            }
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get lawyer client info
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getClientInfo(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var collection = db.collection('lawyerClients');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        collection.find({ _id: new ObjectId(obj.cid) }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data[0], cb);
                            else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get booking
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getBookings(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ _id: new ObjectId(obj.bookingId), lawyerId: obj.lawyerId, deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data[0], cb);
                            else CommonJs.close(client, CommonJSInstance.SUCCESS, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Deny booking
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static denyBooking(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ _id: new ObjectId(obj.bookingId), deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                bookings.update({ _id: new ObjectId(obj.bookingId) }, {
                                    $set: {
                                        clientReadStatusForDenyBooking: 0,
                                        lawyerReadStatusForDenyBooking: 0,
                                        deletedStatus: CommonJSInstance.CLIENT_DENYING_BOOKING === obj.deleteType ? CommonJSInstance.CLIENT_DENYING_BOOKING : CommonJSInstance.LAWYER_DENYING_BOOKING,
                                        updatedTime: moment.tz(new Date(), TIME_ZONE).format(),
                                    }
                                }, (err, success) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else {
                                        var temp = data[0];
                                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                    }
                                });
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * All client bookings
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static allClientBookings(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');
                console.log(obj);
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ lawerId: obj.lawyerId, userId: obj.clientId, deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get all lawyer bookings
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAllLawyerBookings(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');
                var lawyerClients = db.collection('lawyerClients');

                console.log(obj);
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ lawerId: obj.lawyerId, deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                // CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);

                                users.find({}).toArray((err, usersData) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (usersData && usersData.length !== 0) {

                                        lawyerClients.find({ lawerId: obj.lawyerId }).toArray((err, lawyerClient) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                            if (lawyerClient && lawyerClient.length !== 0) {

                                                usersData = usersData.concat(lawyerClient);
                                                //Repeated code
                                                var b_count = 0;
                                                var u_count = 0;
                                                data.forEach((booking, index) => {
                                                    u_count = 0;
                                                    usersData.forEach((user, j) => {
                                                        if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                        if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                        if (usersData.length - 1 == u_count) b_count += 1;

                                                        if (data.length === b_count && usersData.length - 1 == u_count) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);

                                                        u_count += 1;
                                                    });
                                                });
                                            } else {
                                                //Repeated code
                                                var b_count = 0;
                                                var u_count = 0;
                                                data.forEach((booking, index) => {
                                                    u_count = 0;
                                                    usersData.forEach((user, j) => {
                                                        if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                        if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                        if (usersData.length - 1 == u_count) b_count += 1;

                                                        if (data.length === b_count && usersData.length - 1 == u_count) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);

                                                        u_count += 1;
                                                    });
                                                });
                                            }
                                        })
                                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                });
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get all client bookings
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getAllClientBookings(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');
                var lawyerClients = db.collection('lawyerClients');

                console.log(obj);
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ userId: obj.id, deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                // CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);

                                users.find({}).toArray((err, usersData) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (usersData && usersData.length !== 0) {

                                        var b_count = 0;
                                        var u_count = 0;
                                        data.forEach((booking, index) => {
                                            u_count = 0;
                                            usersData.forEach((user, j) => {
                                                if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                if (usersData.length - 1 == u_count) b_count += 1;

                                                if (data.length === b_count && usersData.length - 1 == u_count) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);

                                                u_count += 1;
                                            });
                                        });
                                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                });
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Change booking view status
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static changeBookingViewStatus(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');
                console.log(obj);
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ _id: new ObjectId(obj.bookingId), lawerId: obj.lawyerId, deletedStatus: 0, status: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                bookings.update({ _id: new ObjectId(obj.bookingId), lawerId: obj.lawyerId, }, {
                                    $set: {
                                        clientReadStatus: 1,
                                        updatedTime: moment.tz(new Date(), TIME_ZONE).format(),
                                    }
                                }, (err, success) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else {
                                        var temp = data[0];
                                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                    }
                                });
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get all unread bookings
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getUnreadBookings(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');
                console.log(obj);
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ userId: obj.clientId, deletedStatus: 0, clientReadStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get five recent lawyers
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getRecentLawyers(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).sort({ $natural: -1 }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {

                        users.find({ userType: 1 }).sort({ $natural: -1 }).limit(5).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    }
                    else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get user info
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getUserInfo(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        users.find({ _id: new ObjectId(obj.uid) }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) CommonJs.close(client, CommonJSInstance.SUCCESS, data[0], cb);
                            else CommonJs.close(client, CommonJSInstance.PRESENT, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get all unread bookings
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getUnreadAndDeniedBookingsForLawyer(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');
                console.log(obj);
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ lawerId: obj.lawyerId, lawyerReadStatus: 0, deletedStatus: 0, activeStatus: 'pending', lawyerReadStatusForBookingRequest: { $ne: CommonJSInstance.CLIENT_BOOKING_REQUEST_VIEWED_LAWYER_STATUS_ACTIVE } }).toArray((err, bookingRequests) => {
                            // bookings.find({ lawerId: obj.lawyerId, lawyerReadStatus: 0, deletedStatus: 0, activeStatus: 'pending' }).toArray((err, bookingRequests) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (bookingRequests && bookingRequests.length !== 0) {
                                bookings.find({ lawerId: obj.lawyerId, lawyerReadStatus: 0, deletedStatus: { $ne: 0 } }).toArray((err, denyBookings) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (denyBookings && denyBookings.length !== 0) {
                                        let temp = bookingRequests.concat(denyBookings);
                                        temp.sort((a, b) => new Date(a.from) > new Date(b.from));

                                        users.find({}).toArray((err, usersData) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                            if (usersData && usersData.length !== 0) {

                                                var b_count = 0;
                                                var u_count = 0;
                                                temp.forEach((booking, index) => {
                                                    u_count = 0;
                                                    usersData.forEach((user, j) => {
                                                        if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                        if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                        if (usersData.length - 1 == u_count) b_count += 1;

                                                        if (temp.length === b_count && usersData.length - 1 == u_count) {
                                                            // Check for date
                                                            // CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);

                                                            let temp1 = [];
                                                            let countCT = 0;
                                                            temp.forEach((element, index) => {
                                                                if (new Date(element.from) > new Date()) temp1.push(element);
                                                                if (temp.length - 1 === countCT) {
                                                                    CommonJs.close(client, CommonJSInstance.SUCCESS, temp1, cb);
                                                                }
                                                                countCT += 1;
                                                            });
                                                        }

                                                        u_count += 1;
                                                    });
                                                });
                                            } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                        });


                                        // CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                    }
                                    else {
                                        if (bookingRequests.length !== 0) {
                                            let temp = bookingRequests;
                                            temp.sort((a, b) => new Date(a.from) > new Date(b.from));


                                            users.find({}).toArray((err, usersData) => {
                                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                                if (usersData && usersData.length !== 0) {

                                                    var b_count = 0;
                                                    var u_count = 0;
                                                    temp.forEach((booking, index) => {
                                                        u_count = 0;
                                                        usersData.forEach((user, j) => {
                                                            if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                            if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                            if (usersData.length - 1 == u_count) b_count += 1;

                                                            if (temp.length === b_count && usersData.length - 1 == u_count) {
                                                                // Check for date
                                                                // CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);

                                                                let temp1 = [];
                                                                let countCT = 0;
                                                                temp.forEach((element, index) => {
                                                                    if (new Date(element.from) > new Date()) temp1.push(element);
                                                                    if (temp.length - 1 === countCT) {
                                                                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp1, cb);
                                                                    }
                                                                    countCT += 1;
                                                                });
                                                            }

                                                            u_count += 1;
                                                        });
                                                    });
                                                } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                            });
                                        } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                                    }
                                });
                            }
                            else {
                                bookings.find({ lawerId: obj.lawyerId, lawyerReadStatusForDenyBooking: 0, deletedStatus: { $ne: 0 } }).toArray((err, denyBookings) => {
                                    // bookings.find({ lawerId: obj.lawyerId, deletedStatus: { $ne: 0 } }).toArray((err, denyBookings) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (denyBookings && denyBookings.length !== 0) {
                                        denyBookings.sort((a, b) => new Date(a.from) > new Date(b.from));

                                        users.find({}).toArray((err, usersData) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                            if (usersData && usersData.length !== 0) {

                                                var b_count = 0;
                                                var u_count = 0;
                                                denyBookings.forEach((booking, index) => {
                                                    u_count = 0;
                                                    usersData.forEach((user, j) => {
                                                        if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                        if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                        if (usersData.length - 1 == u_count) b_count += 1;

                                                        if (denyBookings.length === b_count && usersData.length - 1 == u_count) {

                                                            let temp1 = [];
                                                            let countCT = 0;
                                                            denyBookings.forEach((element, index) => {
                                                                if (new Date(element.from) > new Date()) temp1.push(element);
                                                                if (denyBookings.length - 1 === countCT) {
                                                                    CommonJs.close(client, CommonJSInstance.SUCCESS, temp1, cb);
                                                                }
                                                                countCT += 1;
                                                            });

                                                            // CommonJs.close(client, CommonJSInstance.SUCCESS, denyBookings, cb);
                                                        }

                                                        u_count += 1;
                                                    });
                                                });
                                            } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                        });
                                        // CommonJs.close(client, CommonJSInstance.SUCCESS, denyBookings, cb);
                                    }
                                    else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                                });
                            }
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Accept booking
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static acceptBooking(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ _id: new ObjectId(obj.bookingId), deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                bookings.update({ _id: new ObjectId(obj.bookingId), deletedStatus: 0 }, {
                                    $set: {
                                        clientReadStatusForAcceptedBooking: 0,
                                        activeStatus: CommonJSInstance.BOOKING_STATUS_ACTIVE,
                                        updatedTime: moment.tz(new Date(), TIME_ZONE).format(),
                                    }
                                }, (err, success) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else {
                                        var temp = data[0];
                                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                    }
                                });
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get new bookings
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getNewBookingRequests(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ lawerId: obj.id, activeStatus: 'pending', deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                users.find({}).toArray((err, usersData) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (usersData && usersData.length !== 0) {

                                        var b_count = 0;
                                        var u_count = 0;
                                        data.forEach((booking, index) => {
                                            u_count = 0;
                                            usersData.forEach((user, j) => {
                                                if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                if (usersData.length - 1 == u_count) b_count += 1;

                                                if (data.length === b_count && usersData.length - 1 == u_count) {
                                                    // Check for date
                                                    // CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);

                                                    let temp1 = [];
                                                    let countCT = 0;
                                                    data.forEach((element, index) => {
                                                        if (new Date(element.from) > new Date()) temp1.push(element);
                                                        if (data.length - 1 === countCT) {
                                                            CommonJs.close(client, CommonJSInstance.SUCCESS, temp1, cb);
                                                        }
                                                        countCT += 1;
                                                    });
                                                }

                                                u_count += 1;
                                            });
                                        });
                                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                });
                                // CommonJs.close(client, CommonJSInstance.SUCCESS, data, cb);
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Mark as viewed booking request
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static markAsViewedBookingRequestByLawyer(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ _id: new ObjectId(obj.bookingId), deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                bookings.update({ _id: new ObjectId(obj.bookingId), deletedStatus: 0 }, {
                                    $set: {
                                        lawyerReadStatusForBookingRequest: CommonJSInstance.CLIENT_BOOKING_REQUEST_VIEWED_LAWYER_STATUS_ACTIVE,
                                        updatedTime: moment.tz(new Date(), TIME_ZONE).format(),
                                    }
                                }, (err, success) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else {
                                        var temp = data[0];
                                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                    }
                                });
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }


    /**
     * Mark as viewed booking request
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static markAsViewedBookingRequestByClient(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');

                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ _id: new ObjectId(obj.bookingId), deletedStatus: 0 }).toArray((err, data) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (data && data.length !== 0) {
                                bookings.update({ _id: new ObjectId(obj.bookingId), deletedStatus: 0 }, {
                                    $set: {
                                        clientReadStatusForAcceptedBooking: CommonJSInstance.LAWYER_BOOKING_ACCEPTED_VIEWED_CLIENT_STATUS_ACTIVE,
                                        updatedTime: moment.tz(new Date(), TIME_ZONE).format(),
                                    }
                                }, (err, success) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    else {
                                        var temp = data[0];
                                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                    }
                                });
                            }
                            else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

    /**
     * Get all unread bookings for client
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static getUnreadAndDeniedBookingsForClient(obj, cb) {
        Connection.connect((err, db, client) => {
            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
            else {
                var users = db.collection('users');
                var bookings = db.collection('bookings');
                users.find({ _id: new ObjectId(obj.id), userAccessToken: obj.accessToken }).toArray((err, data) => {
                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                    if (data && data.length !== 0) {
                        bookings.find({ userId: obj.clientId, deletedStatus: 0, activeStatus: 'active', clientReadStatusForAcceptedBooking: 0 }).toArray((err, bookingRequests) => {
                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                            if (bookingRequests && bookingRequests.length !== 0) {
                                bookings.find({ userId: obj.clientId, clientReadStatusForDenyBooking: 0, deletedStatus: { $ne: 0 } }).toArray((err, denyBookings) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (denyBookings && denyBookings.length !== 0) {
                                        let temp = bookingRequests.concat(denyBookings);
                                        temp.sort((a, b) => new Date(a.from) > new Date(b.from));







                                        users.find({}).toArray((err, usersData) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                            if (usersData && usersData.length !== 0) {

                                                var b_count = 0;
                                                var u_count = 0;
                                                temp.forEach((booking, index) => {
                                                    u_count = 0;
                                                    usersData.forEach((user, j) => {
                                                        if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                        if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                        if (usersData.length - 1 == u_count) b_count += 1;

                                                        if (temp.length === b_count && usersData.length - 1 == u_count) {
                                                            // Check for date
                                                            // CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);

                                                            let temp1 = [];
                                                            let countCT = 0;
                                                            temp.forEach((element, index) => {
                                                                if (new Date(element.from) > new Date()) temp1.push(element);
                                                                if (temp.length - 1 === countCT) {
                                                                    CommonJs.close(client, CommonJSInstance.SUCCESS, temp1, cb);
                                                                }
                                                                countCT += 1;
                                                            });
                                                        }

                                                        u_count += 1;
                                                    });
                                                });
                                            } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                        });







                                        // CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);
                                    }
                                    else {
                                        if (bookingRequests && bookingRequests.length !== 0) {
                                            let temp = bookingRequests
                                            temp.sort((a, b) => new Date(a.from) > new Date(b.from));


                                            users.find({}).toArray((err, usersData) => {
                                                if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                                if (usersData && usersData.length !== 0) {

                                                    var b_count = 0;
                                                    var u_count = 0;
                                                    temp.forEach((booking, index) => {
                                                        u_count = 0;
                                                        usersData.forEach((user, j) => {
                                                            if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                            if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                            if (usersData.length - 1 == u_count) b_count += 1;

                                                            if (temp.length === b_count && usersData.length - 1 == u_count) {
                                                                // Check for date
                                                                // CommonJs.close(client, CommonJSInstance.SUCCESS, temp, cb);

                                                                let temp1 = [];
                                                                let countCT = 0;
                                                                temp.forEach((element, index) => {
                                                                    if (new Date(element.from) > new Date()) temp1.push(element);
                                                                    if (temp.length - 1 === countCT) {
                                                                        CommonJs.close(client, CommonJSInstance.SUCCESS, temp1, cb);
                                                                    }
                                                                    countCT += 1;
                                                                });
                                                            }

                                                            u_count += 1;
                                                        });
                                                    });
                                                } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                            });
                                        } else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                                    }
                                });
                            }
                            else {
                                bookings.find({ userId: obj.clientId, clientReadStatusForDenyBooking: 0, deletedStatus: { $ne: 0 } }).toArray((err, denyBookings) => {
                                    if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                    if (data && data.length !== 0) {
                                        denyBookings.sort((a, b) => new Date(a.from) > new Date(b.from));

                                        users.find({}).toArray((err, usersData) => {
                                            if (err) CommonJs.close(client, CommonJSInstance.ERROR, err, cb);
                                            if (usersData && usersData.length !== 0) {

                                                var b_count = 0;
                                                var u_count = 0;
                                                denyBookings.forEach((booking, index) => {
                                                    u_count = 0;
                                                    usersData.forEach((user, j) => {
                                                        if (booking.userId.toString() === user._id.toString()) booking.clientData = user;

                                                        if (booking.lawerId.toString() === user._id.toString()) booking.lawyedData = user;

                                                        if (usersData.length - 1 == u_count) b_count += 1;

                                                        if (denyBookings.length === b_count && usersData.length - 1 == u_count) {

                                                            let temp1 = [];
                                                            let countCT = 0;
                                                            denyBookings.forEach((element, index) => {
                                                                if (new Date(element.from) > new Date()) temp1.push(element);
                                                                if (denyBookings.length - 1 === countCT) {
                                                                    CommonJs.close(client, CommonJSInstance.SUCCESS, temp1, cb);
                                                                }
                                                                countCT += 1;
                                                            });

                                                            // CommonJs.close(client, CommonJSInstance.SUCCESS, denyBookings, cb);
                                                        }

                                                        u_count += 1;
                                                    });
                                                });
                                            } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                                        });
                                        // CommonJs.close(client, CommonJSInstance.SUCCESS, denyBookings, cb);
                                    }
                                    else CommonJs.close(client, CommonJSInstance.NOVALUE, [], cb);
                                });
                            }
                        });
                    } else CommonJs.close(client, CommonJSInstance.NOT_VALID, [], cb);
                });
            }
        });
    }

}

