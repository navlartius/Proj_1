const express = require('express')
const userRoute = express.Router()
const { userSignup, checkUserCredentials, requestApprovalFromAdmin, showProd } = require('../controller/controller.user')
const { body } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {userVerifyToken} = require('../midddleware/middleware.jwt.user')
dotenv.config()

userRoute.post('/signup', [body('firstName').notEmpty().withMessage("Name can not be empty")
    .isLength({ min: 4, max: 150 }).isAlpha().withMessage("Name should be in alphabet"),
body('email').notEmpty().withMessage("Email can not be empty").isEmail().normalizeEmail().withMessage("provide valid email address"),
body('mobileno').notEmpty().withMessage("Mobile can not be empty").isNumeric().withMessage("Mobile number should be in number").isLength({ min: 10, max: 12 }).withMessage("Mobile number should be in 10 digits"),
],
    userSignup)

userRoute.post('/signin', (req, res, next) => {
    console.log('Email to authenticate is:' + req.body.email)
    //Authentication of password using bycryt can be done using call back...always remember
    checkUserCredentials(req.body.email, (result) => {
       // console.log('Request body pass:       ' + req.body.password)
       // console.log('Now Authenticating:      ' + result.password)
        //console.log(req.body.password)
/* hash the req.body.password again for testing
const saltRounds = 10
const hash = bcrypt.hashSync(req.body.password, saltRounds);
let comparePass = bcrypt.compareSync(hash, result.password);

console.log('Authentication status hash:' + comparePass);
console.log('Failure Authenticate password:      ' + hash) 
 hash the req.body.password again for testing */

        let isSame = bcrypt.compareSync(req.body.password, result.password);
        //console.log('Authentication status:' + isSame);
        if (isSame) {
            console.log('Authentication status:' + isSame);
            //res.status(200).send({ success: true, msg: 'Signup succeeded' })
            const token = jwt.sign({email: result.email }, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: 60 * 60 })

            //Old method to set and send the token 
            //res.setHeader('auth_token', token).send(token)
            //New method to set and send the token
            res.send({sucess: true, token:token})
        
        }
        else {
            
            console.log('Failure Authenticate password:      ' + result.password) 
            res.status(400).send({ success: false, msg: 'Signup Failed' })
        }
    })

})

userRoute.post('/requestAdminApproval', userVerifyToken , requestApprovalFromAdmin)

userRoute.get('/showProd',userVerifyToken , showProd)


module.exports = userRoute