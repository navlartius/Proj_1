const jwt = require('jsonwebtoken')

module.exports = {
    adminVerifyToken(req, res, next) {
       //const token = req.headers('auth_token')
      // const token = req.headers['auth_token']
      
       const token = req.headers.auth_token
       //console.log('The Token is....:' + token)
       if (!token)
          res.status(404).send({sucess:false, msg: 'Access Denied'})
       else {
       try{
          console.log('Trying to verify token') 
          const verified = jwt.verify(token, process.env.TOKEN_SECRET_ADMIN)  
          req.user = verified
          next()
       }
       catch{
        res.status(404).send({sucess:false, msg: 'In the Catch Access Denied'})
       }
    }
      
    }
}