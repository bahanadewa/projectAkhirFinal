var Router = require('express').Router()

var {LastSeen,
    ShowLastSeenByUsername} = require ('../1.controllers/authSeen')



Router.post('/lastseen',LastSeen)
Router.get('/showlastseen/:username',ShowLastSeenByUsername)



module.exports = Router