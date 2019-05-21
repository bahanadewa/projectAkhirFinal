var Router = require('express').Router()

var {Login} = require('../1.controllers/authLogin')

Router.get('/getuserlogin',Login)

module.exports = Router