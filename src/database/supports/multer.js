const multer = require('multer')

const storageConfig = multer.diskStorage({
    // menentukan tempat menyimpan file
    destination : (req,file,cb)=>{
        cb (null, './uploads')
    } ,
    // nama file
    filename : (req,file,cb)=>{
        cb(null, 'PRD-'+Date.now()+ '.' + file.mimetype.split('/')[1])
    }
})

const filterConfig = (req,file,cb)=>{
    if(file.mimetype.split('/')[1]==='png' || file.mimetype.split('/')[1]==='jpeg'){
        cb(null,true)

    } else{
        req.validation = {error:true, msg : 'File must be image'}
        cb(null,false)
        // cb(new Error('image must be jpg or png'),false)
    }
}
var upload = multer({storage : storageConfig, fileFilter : filterConfig})

module.exports = upload