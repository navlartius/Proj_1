
// const Sequelize = require('sequelize');
// const sequelize = require('../models/index')

const db = require('../models/index')
const {Sequelize, Op, QueryTypes} = require('sequelize')

/* db.User = require('../models/model.user')(sequelize,Sequelize);
db.prod = require('../models/model.product')(sequelize,Sequelize);
db.userRequest = require('../models/model.user.request.approval')(sequelize,Sequelize); */


const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { read } = require('fs');
let user, request;


module.exports = {

    userSignup: async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        else {
            console.log('Body data:' + req.body.firstName, req.body.password)
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            console.log('Password hash: ' + hash)
            await db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                isAdmin: req.body.isAdmin,
                dob: req.body.dob,
                password: hash,
                email: req.body.email,
                mobileno: req.body.mobileno,
                gender: req.body.gender
            }).then((User) => {
                res.status(200).send({ sucess: true, msg: 'Data inserted Sucessfully', Data: User })
            }).catch((err) => {
                const message = {}
                err.errors.forEach(errorElement => {
                    let errMessage;
                    switch (errorElement.validatorKey) {
                        case 'isIn':
                            errMessage = 'Please enter M/F/T for user Gender'
                            break

                        case 'not_unique':
                            errMessage = 'User with this email_ID already exists'
                            break

                    }
                    message[errorElement.path] = errMessage
                    res.status(400).send({ sucess: false, msg: 'Data insertion failed', Error: err })
                });

            })
        }
    },

    checkUserCredentials: async (userEmail, cb) => {
        await db.User.findOne({ where: { email: userEmail } })
            .then((result) => {
                //res.status(200).send({ sucess: true, msg: 'Data fetched Sucessfully', Data: User })
                console.log('The result of search is: ' + 'ID :' + result.ID + ' firstName :' + result.firstName)
                cb(result)
            })
            .catch((err) => {
                //res.status(400).send({ sucess: false, msg: 'Error Fetching Data', Error: err })
                console.log('The error is' + err)
                cb(err)
            })
    },

    requestApprovalFromAdmin: async (req, res, next) => {
        let requestID = 0;
        console.info(req.headers.auth_token)
        console.log('Body data:' + req.body.requestDate, req.body.companyName)
        await db.requestApproval.create({
            requestDate: req.body.requestDate,
            companyName: req.body.companyName,
            companyBrief: req.body.companyBrief,
            turnOver: req.body.turnOver,
            salesVolume: req.body.salesVolume,
            email: req.body.email,
            //UserEmail: req.body.UserEmail,
        }).then((data) => {
            requestID = data.requestID
            console.log('The request ID is :' + requestID)
            return db.requestApproval.findOne({ where: { requestID: requestID } })
                .then((data) => {
                    console.log(data.companyName)
                    request = data;
                    return db.User.findOne({ where: { email: req.body.email } })
                }).then(async (data) => {
                    console.log('The UserID : ', data.userID)
                    console.log('The request ID : ', requestID)
                    //user = data;
                    //user.setrequestApproval(request)
                   await db.requestApproval.update({userID:data.userID},{where:{requestID: requestID}})
                        .then((result) => {
                            res.status(200).send({ sucess: true, msg: 'Helper method success', Data: data })
                        })
                        .catch((err) => {
                            res.status(400).send({ sucess: false, msg: 'Helper method failure', Error: err })
                        })

                   // res.status(200).send({ sucess: tue, msg: 'Helper method success', Data: data })
                })

                //console.log('sequelize 2', user.email)
                .catch((err) => {
                    res.status(400).send({ sucess: false, msg: 'Helper method outside failure', Error: err })
                })

        }).catch((err) => {
            res.status(400).send({ sucess: false, msg: 'Data insertion failed', Error: err })
        })
    },

    addProduct: async (req, res, next) => {
        // console.log('Email :' + req.body.email )
        const email = (req.body.email)
        let isAdminApproval = 0;
        // db.userRequest.findAll({attributes:['adminApproval'],where:{email:req.body.email}})
        //db.requestApproval.findOne({where:{requestID:4}})

        await db.requestApproval.findOne({ where: { email: email } })
            .then((result) => {
                isAdminApproval = result.adminApproval;
                console.log("adminapproval :" + isAdminApproval)
            }).
            catch((err) => {
                res.status(400).send({ sucess: false, msg: 'Invalid email'})
            })
        /*           db.Product.create({
                       email: req.body.email,
                       prodDesc: req.body.prodDesc,
                       prodImage: req.body.prodImage,
                       prodName: req.body.prodName,
                       prodUnitCost: req.body.prodUnitCost,
                       UserEmail: req.body.UserEmail,
                   })
                       .then((result) => {
                           res.status(200).send({ sucess: true, msg: 'Data ', Data: result })
                       })
               })
               .catch((err) => {
                   console.log(err)
                   res.status(400).send({ sucess: false, msg: 'Data fetch failed', Error: err })
               })
     */
        if (isAdminApproval == 1) {
            console.log('Admin Approval Received, adding product now')
            await db.Product.create({
                email: req.body.email,
                prodDesc: req.body.prodDesc,
                prodImage: req.body.prodImage,
                prodName: req.body.prodName,
                prodUnitCost: req.body.prodUnitCost,
                UserEmail: req.body.userEmail,
            })
                .then((result) => {
                    res.status(200).send({ sucess: true, msg: 'Product Data inserted', result })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).send({ sucess: false, msg: 'Data Insertion failed', Error: err })
                })
        }
        else {
            res.status(400).send({ sucess: false, msg: 'User is not approved to add product' })
        }

    },

    showProd: (req, res, next) => {
        
        //db.prod.findAll({
        let userid = req.body.userID    
        db.User.findAll({
            include: db.Product,
            where: { userID:userid }
        })


            // User.findAll({ where:{id:2}})
            .then((result) => {
                res.status(200).send({ sucess: true, msg: 'Data fetched Sucessfully', Data: result })

            })
            .catch((err) => {
                res.status(400).send({ sucess: false, msg: 'Error Fetching Data', Error: err })
            })
    }

}