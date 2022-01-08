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
        cb(null, Date.now() + '---' + file.originalname)
    },
})
//the multer function the file fileStorageengine as object
const upload = multer({storage:fileStorageEngine})
module.exports = multer