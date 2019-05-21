const multer = require('multer')

const storageConfigFerify = multer.diskStorage({
    // menentukan tempat menyimpan file
    destination : (req,file,cb)=>{
        cb (null, './upload-verify')
    } ,
    // nama file
    filename : (req,file,cb)=>{
        cb(null, 'PAYMENT-'+Date.now()+ '.' + file.mimetype.split('/')[1])
    }
})

const filterConfigVerify = (req,file,cb)=>{
    if(file.mimetype.split('/')[1]==='png' || file.mimetype.split('/')[1]==='jpeg'){
        cb(null,true)

    } else{
        req.validation = {error:true, msg : 'File must be image'}
        cb(null,false)
        // cb(new Error('image must be jpg or png'),false)
    }
}

var uploadverify = multer({storage : storageConfigFerify, fileFilter : filterConfigVerify})

module.exports = uploadverify