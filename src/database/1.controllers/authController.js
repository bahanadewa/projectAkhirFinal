const db = require('./../db/index')
var cripto = require('crypto')
const transporter = require('./../supports/nodemailer')

module.exports = {
    UserRegister : (req,res) => {
        var to = req.body.email
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var phone = req.body.phone;
    
        var password_cript = cripto.createHmac('sha256','inibebas').update(password).digest('hex')
        console.log(password+'telah di enkrip menajdi =' +password_cript)
        console.log('panjang hasil ekrip adalah = '+password_cript.length)
    
        var mailOption = {
            from : 'FoodQoma <purwadhika@purwadhika.com>',
            to : to ,
            subject: 'Verification' ,
            html : `<h1> <a href="http://localhost:9500/auth/verified?username=${username}"> CLick here for verify your account </a> </h1>`
        }
    
        var sql = `insert into db_user (username,password,email,phone) value ('${username}','${password_cript}','${email}',${phone})`
    
        db.query(sql,(errbebas,resultbebas)=>{
            if (errbebas)throw errbebas
            if (to){
                transporter.sendMail(mailOption,(errbebas1,resultbebas1)=>{
                    if(errbebas1) throw errbebas1
                    console.log('email berhasil dikirim')
                    res.send(resultbebas)
                })
            }else{
                res.send('alamat email belom ada')
            }
        })
    },
    GetlAllUsernameByUsername : (req,res)=>{
        var username = req.params.username
        var sql = `select * from db_user where username = '${username}'`
        db.query(sql,(errbebas,resultbebas)=>{
            if(errbebas) throw errbebas
                res.send(resultbebas)        
        })
    },
    GetUser : (req,res)=>{
        var username = req.query.username
        var sql = `select * from db_user where username = "${username}"`
        db.query(sql,(errbebas,resultbebas)=>{
            if(errbebas) throw errbebas
            res.send(resultbebas)
        })
    },
    VerifyAccount : (req,res)=>{
        var username = req.query.username
        var sql = `update db_user set verified =1 where username="${username}"`
        db.query(sql,(errbebas,resultbebas)=>{
            if (errbebas) throw errbebas
            res.send(`<center><h1> Verify Success </h1></center>`)
        })
    }
}