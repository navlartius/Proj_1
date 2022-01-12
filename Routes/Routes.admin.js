const express = require('express')
const adminRoute = express.Router()
const {viewUserApprovalRequest, approveUserRequest, rejectUserRequest,adminSignup, adminSignin, authenticateAdmin, viewApprovedRequest, viewUserProduct, viewUsers, viewUsersMale, viewUsersFemale} = require('../controller/controller.admin')

const { body } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {adminVerifyToken} = require('../midddleware/middleware.jwt.admin')
dotenv.config()

console.log('Inside admin route')

adminRoute.post('/adminSignup',[body('firstName').notEmpty().withMessage("Name can not be empty")
.isLength({ min: 4, max: 150 }).isAlpha().withMessage("Name should be in alphabet"),
body('email').notEmpty().withMessage("Email can not be empty").isEmail().normalizeEmail().withMessage("provide valid email address"),
body('mobileno').notEmpty().withMessage("Mobile can not be empty").isNumeric().withMessage("Mobile number should be in number").isLength({ min: 10, max: 12 }).withMessage("Mobile number should be in 10 digits"),
],adminSignup) 

adminRoute.post('/adminSignin', (req, res, next)=>{
    console.log('Email to authenticate is:' + req.body.email)
    authenticateAdmin(req.body.email,(result)=>
    {
        let isSame = bcrypt.compareSync(req.body.password, result.password);
        //console.log('Authentication status:' + isSame);
        if (isSame) {
            console.log('Authentication status:' + isSame);
            //res.status(200).send({ success: true, msg: 'Signup succeeded' })
            const token = jwt.sign({email: result.email }, process.env.TOKEN_SECRET_ADMIN, { algorithm: 'HS256', expiresIn: 60 * 60 })

            //Old method to set and send the token 
            //res.setHeader('auth_token', token).send(token)
            //New method to set and send the token
            res.send({sucess: true, token:token})
        
        }
        else {
            
            console.log('Failure Authenticate password:      ' + result.password) 
            res.status(400).send({ success: false, msg: 'Signup Failed' })
        }
    }
 )
})

adminRoute.get('/viewRequest',adminVerifyToken,viewUserApprovalRequest )

adminRoute.post('/approveUserRequest', adminVerifyToken, approveUserRequest)

adminRoute.post('/rejectUserRequest', adminVerifyToken, rejectUserRequest)

adminRoute.get('/viewApprovedRequest', viewApprovedRequest )

adminRoute.get('/viewUserProduct', viewUserProduct )

adminRoute.get('/viewUsers', viewUsers )

adminRoute.get('/viewUsersMale', viewUsersMale )

adminRoute.get('/viewUsersfeMale', viewUsersFemale )


module.exports = adminRoute

