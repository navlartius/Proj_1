// const Sequelize = require('sequelize');
// const sequelize = require('../models')
const db = require('../models')
const {Sequelize, Op, QueryTypes} = require('sequelize')

// db.User = require('../models/model.user')(sequelize, Sequelize);
// db.userRequest = require('../models/model.user.request.approval')(sequelize, Sequelize);
// db.prod = require('../models/model.product')(sequelize, Sequelize);


const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { read } = require('fs');


module.exports = {

    adminSignup: (req, res, next) => {
        const isAdmin = 1
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        else {
            console.log('Body data:' + req.body.firstName, req.body.password)
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            console.log('Password hash: ' + hash)
            db.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                isAdmin: isAdmin,
                dob: req.body.dob,
                password: hash,
                email: req.body.email,
                mobileno: req.body.mobileno
            }).then((admin) => {
                res.status(200).send({ sucess: true, msg: 'Data inserted Sucessfully', Data: admin })
            }).catch((err) => {
                res.status(400).send({ sucess: false, msg: 'Data insertion failed', Error: err })
            })
        }

    },



    viewUserApprovalRequest: (req, res, next) => {
        console.log('in the view approval request')
        //db.userRequest.findAll({})
        db.requestApproval.findAll({})
            .then((result) => {
                res.status(200).send({ sucess: true, Data: result })
            })

            .catch((err) => {
                res.status(400).send({ sucess: false, Data: err })
            }
            )

    },

    approveUserRequest: (req, res, next) => {
        const requestID = req.body.requestID
        const approvedDate = new Date()
        console.info('The request to update is: ' + requestID)
        db.requestApproval.update({ adminApproval: 1, approvalDate: approvedDate }, { where: { requestID: requestID, email: req.body.email } })
            .then((result) => {
                res.status(200).send({ sucess: true, msg: `The request ID approved is: ${requestID}` })
            })
            .catch((err => {
                res.status(400).send({ sucess: false, Data: err })
            }))

    },
    rejectUserRequest: (req, res, next) => {
        const requestID = req.body.requestID
        const approvedDate = new Date()
        console.info('The request to update is: ' + requestID)
        db.requestApproval.update({ adminApproval: 0, approvalDate: approvedDate }, { where: { requestID: requestID, email: req.body.email } })
            .then((result) => {
                res.status(200).send({ sucess: true, msg: `The request ID rejected is: ${requestID}` })
            })
            .catch((err => {
                res.status(400).send({ sucess: false, Data: err })
            }))
    },

    authenticateAdmin: (email, cb) => {
        console.info('The email to authenticate is : ' + email)
        db.User.findOne({ where: { email: email, isAdmin:1} })
            .then((result) => {
                cb(result)
            })
            .catch((err) => {
                console.log('The error is' + err)
                cb(err)
            })
    },

    viewApprovedRequest : (req, res)=>{
        db.requestApproval.scope('viewApprovedRequest').findAll({
            
        })
        .then((result)=>{
            res.status(200).send({ sucess: true, Data: result})
        })
        .catch((err)=>{
            res.status(400).send({ sucess: false, Error: err})
        })
    },

    viewUserProduct: (req, res)=>{
        db.User.scope(['viewUserProduct','userAttribute']).findAll({})
        .then((result)=>{
            res.status(200).send({ sucess: true, Data: result})
        })
        .catch((err)=>{
            res.status(400).send({ sucess: false, Error: err})
        })
    },

    viewUsers : (req,res)=>{
        db.sequelize.query("select * from User", {
            type: QueryTypes.SELECT
        }) 
        .then((result)=>{
            res.status(200).send({ sucess: true, Data: result})
        })
        .catch((err)=>{
            res.status(400).send({ sucess: false, Error: err})
        })       

    },
    viewUsersMale: (req, res)=>{
        //db.sequelize.query("select * from User where gender=:gender", {
            db.sequelize.query("select * from User where gender= $gender", {
            type: QueryTypes.SELECT,
            //replacements: {gender: 'M'}
            bind:{gender:'M'}
        }) 
        .then((result)=>{
            res.status(200).send({ sucess: true, Data: result})
        })
        .catch((err)=>{
            res.status(400).send({ sucess: false, Error: err})
        })       
    },
    viewUsersFemale: (req,res)=>
        {
            // db.sequelize.query("select * from User where gender = ? ", {
            //db.sequelize.query("select * from User where gender in (?,?)  ", {
            //  db.sequelize.query("select * from User where gender in gender in (:gender)  ", { 
             //db.sequelize.query("select * from User where email like :searchEmail", {      
              
             db.sequelize.query(`select * from User where email like ?`, {
                    
                type: QueryTypes.SELECT,
            //    replacements: ['F']
            //    replacements: ['F', 'M']
            // replacements: {gender:['M','F']}
            // replacements: : {searchEmail: '%yahoo%'}
                replacements: ['%yahoo%']
            }) 
            .then((result)=>{
                res.status(200).send({ sucess: true, Data: result})
            })
            .catch((err)=>{
                res.status(400).send({ sucess: false, Error: err})
            })       
        }
}
