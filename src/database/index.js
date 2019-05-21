const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const cors = require('cors')
const mysql = require ('mysql')
const port = 9500



app.use(cors())
app.use(bodyparser.json('mysql'))

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password  : '123123',
    database : 'food_qoma'
})

app.use('/auth', require('./2.routers/authRouter'))
app.use('/authProduct', require('./2.routers/productRouter'))
app.use('/authCategory', require('./2.routers/categoryRouter'))
app.use('/authCart', require('./2.routers/cartRouter'))
app.use('/authSeen', require('./2.routers/seenRouter'))
app.use('/authLogin', require('./2.routers/loginRouter'))
app.use('/authCheckout', require('./2.routers/authCheckOutRouter'))
app.use('/authVerify', require('./2.routers/authManageTransaksiRouter'))


app.use('/uploads',express.static('uploads'))
app.use('/upload-verify',express.static('upload-verify'))


// ================================ REGISTER =================================

// app.get('/getalluser',(req,res)=>{
//     var sql = `select * from db_user`
//     db.query(sql,(errbebas,resultbebas)=>{
//         if(errbebas) throw errbebas
//         res.send(resultbebas)
//     })
// })


// app.delete('/deleteuser/:username',(req,res)=>{
//     var username = req.params.username
//     var sql = `delete from db_user where username = '${username}'`
//     db.query(sql,(errbebas,resultbebas)=>{
//         if (errbebas) throw errbebas
//         res.send('berhasil di hapus')
//     })
// })


// =========================== APP LISTEN ============================
app.listen(port, ()=> console.log('aktif di port '+port))

