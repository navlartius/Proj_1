
const Sequelize = require('sequelize');
const sequelize = require('../models/index')
const db = require('../models/index')
db.User = require('../models/model.user')(sequelize,Sequelize);
db.prod = require('../models/model.product')(sequelize,Sequelize);
db.userRequest = require('../models/model.user.request.approval')(sequelize,Sequelize);


const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { read } = require('fs');

module.exports = {

    userSignup: (req, res, next) => {
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
                isAdmin: req.body.isAdmin,
                dob: req.body.dob,
                password: hash,
                email: req.body.email,
                mobileno: req.body.mobileno
            }).then((User) => {
                res.status(200).send({ sucess: true, msg: 'Data inserted Sucessfully', Data: User })
            }).catch((err) => {
                res.status(400).send({ sucess: false, msg: 'Data insertion failed', Error: err })
            })
        }

    },

    checkUserCredentials:(userEmail,cb)=>
     {
        db.User.findOne({ where:{email:userEmail}})
        .then((result) => {
            //res.status(200).send({ sucess: true, msg: 'Data fetched Sucessfully', Data: User })
            console.log('The result of search is: ' + 'ID :' + result.ID + ' firstName :' +  result.firstName)
            cb(result) 
        })
        .catch((err) => {
            //res.status(400).send({ sucess: false, msg: 'Error Fetching Data', Error: err })
            console.log('The error is' + err)
            cb(err) 
        })
},

    requestApprovalFromAdmin : (req, res, next)=>
    {
        console.info(req.headers.auth_token)
        console.log('Body data:' + req.body.requestDate, req.body.companyName)
        db.userRequest.create({
            requestDate: req.body.requestDate,
            companyName: req.body.companyName,
            companyBrief: req.body.companyBrief,
            turnOver: req.body.turnOver,
            salesVolume: req.body.salesVolume,
            email: req.body.email,
        }).then((User) => {
            res.status(200).send({ sucess: true, msg: 'Data inserted Sucessfully', Data: User })
        }).catch((err) => {
            res.status(400).send({ sucess: false, msg: 'Data insertion failed', Error: err })
        })
    },
   

    showProd: (req,res, next)=>
    {
        console.info('Token Verified')
        db.prod.findAll({})
            // User.findAll({ where:{id:2}})
            .then((result) => {
                res.status(200).send({ sucess: true, msg: 'Data fetched Sucessfully', Data: result })

            })
            .catch((err) => {
                res.status(400).send({ sucess: false, msg: 'Error Fetching Data', Error: err })
            })
        }
        
}