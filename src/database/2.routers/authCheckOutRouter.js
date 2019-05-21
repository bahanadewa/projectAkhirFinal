var Router = require('express').Router()


var {PushHistoryCheckout,
    ShowHistoryByUsername, 
    ShowHistoryDetailByID} = require ('../1.controllers/authCheckOut')

Router.post('/history',PushHistoryCheckout)
Router.get('/showhistory',ShowHistoryByUsername)
Router.get('/showhistorydetail/:id',ShowHistoryDetailByID)


module.exports = Router