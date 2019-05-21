var Router = require('express').Router()
const upload = require('../supports/multer')

var {GetAllProduct,
    GetAllProductById,
    Addproduct,
    EditProduct} = require ('../1.controllers/authProduct')

Router.get('/getallproduct',GetAllProduct)
Router.get('/getallproduct/:id',GetAllProductById)
Router.post('/addProduct',upload.single('image'),Addproduct)
Router.put('/editProduct/:id', upload.single('edit'),EditProduct )

module.exports = Router