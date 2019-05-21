var Router = require('express').Router()
const uploadverify = require('../supports/multer1')

var {Uploadverify,
    GetDataHistory,
    GetDataManageTransaction,
    GetDataManageTransactionByID,
    VerifyDataManageTransactionByID,
    RejectDataManageTransactionByID} = require ('../1.controllers/authManageTransaksi')

Router.put('/payment-verified',uploadverify.single('payment_verification'),Uploadverify)
Router.get('/getdatahistory',GetDataHistory)
Router.get('/GetDataManageTransaction',GetDataManageTransaction)
Router.get('/GetDataManageTransactionbyID/:id',GetDataManageTransactionByID)
Router.put('/VerifyDataManageTransaction/:id',VerifyDataManageTransactionByID)
Router.put('/RejectDataManageTransaction',RejectDataManageTransactionByID)



module.exports = Router