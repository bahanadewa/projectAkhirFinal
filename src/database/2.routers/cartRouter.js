var Router = require('express').Router()

var {GetAllCart,
    GetAllCartByUsername,
    AddCart,
    UpdateCartByID,
    GetAllCartByProductIDUsername,
    DeleteCartByID} = require('../1.controllers/authCart')

Router.get('/cart',GetAllCart)
Router.get('/getallcart/:username',GetAllCartByUsername)
Router.post('/addcart',AddCart)
Router.put('/updateCartByID/:id',UpdateCartByID)
Router.get('/getallcartbyproductandusername',GetAllCartByProductIDUsername)
Router.delete('/cartdelete/:id',DeleteCartByID)


module.exports = Router