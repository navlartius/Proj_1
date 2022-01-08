const express = require('express')
const imageUploadRouter = express.Router()
const app = express.Router()
const path = require('path')

//import or include the multer package
const multer = require('multer')

//create the file storage engine.
// The method is diskstorage which takes two object parameters as key value pairs. The first is destination i.e 
//the path where the uploaded files will be stored on the server.
// the second is filename i.e the file name methodology.
// destination and filename are functions which take req, file, cb (call back function as arguments)

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) =>{
        //call back function sets the destinate storge path
        cb(null, './images')
        
    },
    filename: (req, file, cb) =>{
       // cb(null, Date.now() + '---' + file.originalname)

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
         console.info('The File path is: ' + path.resolve(__dirname + "/" + req.path))
        console.info('The encoding type of the file is: ' + file.encoding)
        console.info('The mimetype of the file is: ' + file.mimetype) 
        cb(null, file.originalname + '-' + uniqueSuffix)
    },
  
})

//the multer function takes the file fileStorageengine as object
const upload = multer({storage:fileStorageEngine})
//create the routes here
//use the post route to upload files.
// upload is the middleware which is called using the upload.single('image')
//to upload single image
imageUploadRouter.post('/single', upload.single('image') , (req,res, next)=>{
    console.log(req.file)
    res.status(200).send({sucess:true, msg:'single file uploaded'})
})
//to upload multiple files
imageUploadRouter.post('/multiple', upload.array('images', 3) , (req,res, next)=>{
    console.log(req.files)
    res.status(200).send({sucess:true, msg:'multiple file uploaded'})

})

module.exports = imageUploadRouter