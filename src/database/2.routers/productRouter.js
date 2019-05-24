var Router = require('express').Router()
const upload = require('../supports/multer')

var {GetAllProduct,
    GetAllProductById,
    Addproduct,
    EditProduct,
    deleteproductbyid} = require ('../1.controllers/authProduct')

Router.get('/getallproduct',GetAllProduct)
Router.get('/getallproduct/:id',GetAllProductById)
Router.post('/addProduct',upload.single('image'),Addproduct)
Router.put('/editProduct/:id', upload.single('edit'),EditProduct )
Router.delete('/deleteproduct/:id',deleteproductbyid)

module.exports = Router