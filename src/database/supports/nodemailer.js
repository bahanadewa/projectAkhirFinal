const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service :'gmail',
    auth: {
      user: 'ddbahana@gmail.com',
      pass: 'cplrpvunzaqcjdjd'
    },
    tls :{
        rejectUnauthorized : false
    }
  })
  
  module.exports = transporter