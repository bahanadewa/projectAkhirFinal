var Router = require('express').Router()
var {UserRegister,
    GetlAllUsernameByUsername,
    GetUser,
    VerifyAccount} = require('./../1.controllers/authController')

Router.post('/register' , UserRegister)
Router.get('/getalluserbyusername/:username',GetlAllUsernameByUsername)
Router.get('/user',GetUser)
Router.get('/verified',VerifyAccount)




module.exports = Router