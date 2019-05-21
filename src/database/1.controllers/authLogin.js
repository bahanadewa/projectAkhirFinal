const db = require('./../db/index')
var cripto = require('crypto')

module.exports={
    Login : (req,res)=>{
        var username = req.query.username
        var password = req.query.password
    
        var password_cript = cripto.createHmac('sha256','inibebas').update(password).digest('hex')
        console.log(password+'telah di enkrip menajdi =' +password_cript)
        console.log('panjang hasil ekrip adalah = '+password_cript.length)
    
        var sql = `select *from db_user where username = "${username}" and password ="${password_cript}"`
        db.query(sql,(errbebas,resultbebas)=>{
            if (errbebas) throw errbebas
            res.send(resultbebas)
        })
    }
}