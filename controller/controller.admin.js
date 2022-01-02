const Sequelize = require('sequelize');
const sequelize = require('../models')
const db = require('../models')

db.User = require('../models/model.user')(sequelize,Sequelize);
db.userRequest = require('../models/model.user.request.approval')(sequelize,Sequelize);
db.prod = require('../models/model.product')(sequelize,Sequelize);


const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { read } = require('fs');

module.exports = {

    viewUserApprovalRequest : (req,res,next)=>{
        console.log('in the view approval request')
        db.userRequest.findAll({})
        
        .then((result)=>
        {
            res.status(200).send({sucess: true, Data: result})
        })
        
        .catch((err)=>{
            res.status(400).send({sucess: false, Data: err})
        }
        )

    } ,

    approveUserRequest :(req,res,next)=>
    {
        const requestID = req.body.requestID
        const approvedDate = new Date()
        console.info('The request to update is: ' + requestID)
        db.userRequest.update({adminApproval:1,approvalDate:approvedDate},{where:{requestID:requestID,email:req.body.email}})
        .then((result)=>{
            res.status(200).send({sucess:true, msg:`The request ID approved is: ${requestID}`})
        })
        .catch((err=>{
            res.status(400).send({sucess:false, Data:err})
        }))

    },
    rejectUserRequest :(req, res, next)=>
    {
        const requestID = req.body.requestID
        const approvedDate = new Date()
        console.info('The request to update is: ' + requestID)
        db.userRequest.update({adminApproval:0,approvalDate:approvedDate},{where:{requestID:requestID,email:req.body.email}})
        .then((result)=>{
            res.status(200).send({sucess:true, msg:`The request ID rejected is: ${requestID}`})
        })
        .catch((err=>{
            res.status(400).send({sucess:false, Data:err})
        }))
    },


}
