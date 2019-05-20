const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const cors = require('cors')
const mysql = require ('mysql')
const nodemailer = require('nodemailer')
var cripto = require('crypto')
const port = 9500
const multer = require('multer')
const fs = require('fs')
const handlebar = require('handlebars')
const pdf = require ('html-pdf')


app.use(cors())
app.use(bodyparser.json('mysql'))

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password  : '123123',
    database : 'food_qoma'
})
// ================================ UPLOAD =================================

const storageConfig = multer.diskStorage({
    // menentukan tempat menyimpan file
    destination : (req,file,cb)=>{
        cb (null, './uploads')
    } ,
    // nama file
    filename : (req,file,cb)=>{
        cb(null, 'PRD-'+Date.now()+ '.' + file.mimetype.split('/')[1])
    }
})

const filterConfig = (req,file,cb)=>{
    if(file.mimetype.split('/')[1]==='png' || file.mimetype.split('/')[1]==='jpeg'){
        cb(null,true)

    } else{
        req.validation = {error:true, msg : 'File must be image'}
        cb(null,false)
        // cb(new Error('image must be jpg or png'),false)
    }
}
var upload = multer({storage : storageConfig, fileFilter : filterConfig})
app.use('/uploads',express.static('uploads'))

// ================================ UPLOAD VERIFY PAYMENT =================================

const storageConfigFerify = multer.diskStorage({
    // menentukan tempat menyimpan file
    destination : (req,file,cb)=>{
        cb (null, './upload-verify')
    } ,
    // nama file
    filename : (req,file,cb)=>{
        cb(null, 'PAYMENT-'+Date.now()+ '.' + file.mimetype.split('/')[1])
    }
})

const filterConfigVerify = (req,file,cb)=>{
    if(file.mimetype.split('/')[1]==='png' || file.mimetype.split('/')[1]==='jpeg'){
        cb(null,true)

    } else{
        req.validation = {error:true, msg : 'File must be image'}
        cb(null,false)
        // cb(new Error('image must be jpg or png'),false)
    }
}

var uploadverify = multer({storage : storageConfigFerify, fileFilter : filterConfigVerify})
app.use('/upload-verify',express.static('upload-verify'))



// ================================ REGISTER =================================

app.get('/getalluser',(req,res)=>{
    var sql = `select * from db_user`
    db.query(sql,(errbebas,resultbebas)=>{
        if(errbebas) throw errbebas
        res.send(resultbebas)
    })
})

app.get('/user',(req,res)=>{
    var username = req.query.username
    var sql = `select * from db_user where username = "${username}"`
    db.query(sql,(errbebas,resultbebas)=>{
        if(errbebas) throw errbebas
        res.send(resultbebas)
    })
})

app.get('/getalluserbyusername/:username',(req,res)=>{
    var username = req.params.username
    var sql = `select * from db_user where username = '${username}'`
    db.query(sql,(errbebas,resultbebas)=>{
        if(errbebas) throw errbebas
            res.send(resultbebas)        
    })
})

app.post('/addnewuser',(req,res)=>{
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
        subject: 'Verificatin' ,
        html : `<h1> <a href="http://localhost:9500/verified?username=${username}"> CLick Here for Verify Your Account </a> </h1>`
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
})

app.delete('/deleteuser/:username',(req,res)=>{
    var username = req.params.username
    var sql = `delete from db_user where username = '${username}'`
    db.query(sql,(errbebas,resultbebas)=>{
        if (errbebas) throw errbebas
        res.send('berhasil di hapus')
    })
})



// =========================== LOGIN ============================

app.get('/getuserlogin',(req,res)=>{
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
})

// ====================== VERIFY =======================

app.get('/verified',(req,res)=>{
    var username = req.query.username
    var sql = `update db_user set verified =1 where username="${username}"`
    db.query(sql,(errbebas,resultbebas)=>{
        if (errbebas) throw errbebas
        res.send(`<center><h1> Verify Success </h1></center>`)
    })
})

// =========================== NODE MAILER =======================
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

  app.get('/testnodemailer',(req,res)=>{
    var to = req.query.email
    var mailOption = {
        from : 'purwadhika <purwadhika@purwadhika.com>' ,
        to : to ,
        subject: 'test nodemailer' ,
        html : '<h1> klik link ini untuk mengaktifkan </h1>'
    }

    if (to){
        transporter.sendMail(mailOption,(err,res1)=>{
            if(err) throw err
            res.send('email berhasil dikirim')
        })
    }else{
        res.send('alamat email belom ada')
    }
})

// =========================== Product ============================

app.post('/addProduct',upload.single('image'),(req, res)=>{
    try{
        if(req.validation) throw req.validation
        if(req.file.size > 50000000) throw {error:true, msg: 'image too large'}
        // var data = {...JSON.parse(req.body.data), img : req.file.path}
        var newData = JSON.parse(req.body.data)
        newData.product_img = req.file.path
        var sql = `insert into product set?`
        db.query(sql,newData, (err, result)=>{
                    if(err) throw err
                    res.send('BERHASIL MENAMBAH PRODUCT')
                })
    }
    catch(err){
            res.send(err)
    }
})

app.put('/editProduct/:id', upload.single('edit'), (req,res) => {
    var id = req.params.id
    if(req.file){
        var data = JSON.parse(req.body.data)
        data.product_img = req.file.path
        var sql2 = `update product set ? where id = ${id}`
        db.query(sql2, data, (err, result) => {
            if(err) throw err
            fs.unlinkSync(req.body.imageBefore)
            res.send('Update Data Success')
        })
    } else{
        var data = req.body
        var sql = `update product set ? where id = ${id}`
        db.query(sql, data, (err, result) => {
            if(err) throw err
            res.send('Edit Data Sukses')
        })
    }
})

app.get('/getallproduct',(req,res)=>{
    var sql = `select p.id, product_name, product_img, product_serving,
	product_serving,product_calories,product_fat, 
    product_protein, product_carb, product_fiber, 
    product_price, product_discount, product_description, c.product_category
    from product p left join category c on id_category = c.id order by p.id asc;`

    db.query(sql,(errbebas,resultbebas)=>{
        if(errbebas) throw errbebas
        res.send(resultbebas)

    })
})

app.get('/getallproduct/:id',(req,res)=>{
    var id = req.params.id
    var sql = `select p.id, product_name, product_img, product_serving,
	product_serving,product_calories,product_fat, 
    product_protein, product_carb, product_fiber, 
    product_price, product_discount,product_description, c.product_category
    from product p join category c on id_category = c.id where p.id = ${id};`
    db.query(sql,(errbebas,resultbebas)=>{
        if(errbebas) throw errbebas
        res.send(resultbebas)
    })
})



// =========================== Category ============================

app.get('/getallcategory',(req,res)=>{
    var sql = `select * from category`
    db.query(sql,(errbebas,resultbebas)=>{
        if(errbebas) throw errbebas
        res.send(resultbebas)
    })
})

app.post('/addCategory',(req, res)=>{
    console.log(req.body)
    var product_category = req.body.product_category;
    var sql = `select * from category where product_category='${product_category}'`
    db.query(sql, (err,result)=>{
            try{
                if(err) throw err
                if(result.length>0){
                    res.send('data category sudah ada')
                }else{
                    var sql1 = `insert into category (product_category) value ('${product_category}');`
                        db.query(sql1,(err1, result1)=>{
                            if(err1) throw err1
                            var sql2 = `select * from category;`
                            db.query(sql2, (err2,result2)=>{
                                res.send(result2)
                            })
                        })}
        }
            catch(err){
                res.send(err.message)
            }
        })
    
})

app.put('/updateCategory/:id',(req,res)=>{
    var id = req.params.id
    var product_category = req.body.product_category
    var sql = `select * from category where product_category = '${product_category}'`
    var sql1 = `update category set product_category ='${product_category}' where id = ${id};`
    db.query(sql,product_category, (err,result)=> {
        try{
           if(result.length>0){
               res.send('data sudah ada')
           }else{
                db.query(sql1,product_category, (err,result)=> {
                    try{
                        var sql2 = `select * from category;`
                        db.query(sql2, (err2,result2)=>{
                        if (err2) throw err2
                            res.send(result2)
                        })
                    }
                    catch(err){
                        res.send(err)
                    }
                })
           }
        }
        catch(err){
            res.send(err)
        }
    })
})

app.put('/updateCategoryProduct/:id',(req,res)=>{
    var id = req.params.id
    var data = req.body.product_category
    var sql = ` update product set id_category= ${data} where id=${id};`
    db.query(sql,data,(err,result)=>{
        if (err) throw err
            res.send('berhasil')

    })
})


app.delete('/deleteCategory/:id', (req,res)=>{
    var id = req.params.id
    var sql = `delete from category where id = ${id};`
    db.query(sql, (err , result)=>{
        if (err) throw err
        // res.send('BERHASIL DIHAPUS')
            var sql2 = `select * from category;`
                db.query(sql2, (err2,result2)=>{
                if (err2) throw err2
                    res.send(result2)
                })
    })
})

app.get('/getsearch/:id',(req,res)=>{
    try{
         var id = req.params.id
        var sql = `select * from category where id=${id}`
    db.query(sql,(err,result)=>{
        if(err) throw result
            var id_category =(result[0].id)
            var sql1 = `select p.id, product_name, product_img, product_serving,
            product_serving,product_calories,product_fat, 
            product_protein, product_carb, product_fiber, 
            product_price, product_discount, product_description, c.product_category
            from product p left join category c on id_category = c.id where id_category=${id_category} order by p.id  asc ;`
                db.query(sql1,(err1,result1)=>{
                    if (err1) throw err1
                    res.send(result1)
                })
        })
    }catch(err){
        res.send(err)
    }
   
})

// =========================== Cart ============================

app.get('/allcart',(req,res)=>{
    var product_id = req.query.product_id
    var product_username = req.query.product_username
    var sql = `select * from cart where product_id = ${product_id} and product_username = '${product_username}' ;`
    db.query(sql,(err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

app.put('/cart/:id',(req,res)=>{
    var id = req.params.id
    var product_quantity = req.body.product_quantity
    var sql = `update cart set product_quantity= ${product_quantity} where id=${id};`
    db.query(sql,(err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

app.post('/addcart',(req,res)=>{
    var data = req.body
    var sql = `insert into cart set?`
    db.query(sql,data,(err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

app.get('/getallcart/:username',(req,res)=>{
    var username = req.params.username
    var sql = `select c.id, p.product_name, p.product_price, p.product_discount, c.product_quantity from cart as c
    join product as p on c.product_id = p.id where c.product_username = "${username}";`
    db.query(sql,(err,result)=>{
        if (err) throw err
        res.send(result)
    })

})

app.get('/cart',(req,res)=>{
    var product_username = req.query.product_username
    var sql = `select * from cart where product_username = '${product_username}' ;`
    db.query(sql,(err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

app.delete('/cartdelete/:id',(req,res)=>{
    var id = req.params.id
    var sql = `delete from cart where id = ${id};`
    db.query(sql,(err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

// =========================== CHECKOUT ============================


app.post('/history',(req,res)=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();
    var month = ['January', 'February', 'March', 'April', 'Mei', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember']
    var date = dd + ' ' + month[mm] + ' ' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes()+ ':' +today.getSeconds()
    var data = {
        ...req.body,
        date
    }

    var sql = `insert into history set ?`
    db.query(sql,data, (err,result)=>{
        try{
            if (err) throw err
            var sql1 = `select c.id, c.product_username, c.product_id ,p.product_name, p.product_price, p.product_discount, c.product_quantity from cart as c
            join product as p on c.product_id = p.id where c.product_username = "${data.username}";`
            db.query(sql1,(err1,result1)=>{
                if (err1) throw err1
                var sql2 = `select id from history where username='${data.username}' and date='${data.date}'`
                db.query(sql2,(err2,result2)=>{
                    if (err2) throw err2
                    var id = result2[0].id
                    var newArr = []
                    result1.map((val) => {
                        newArr.push(`(${id},${val.product_id},${val.product_quantity},${(val.product_price-(val.product_price*(val.product_discount/100)))*val.product_quantity})`)
                    })
                    var sql3 = `insert into history_detail (id_history, id_product, quantity, total) VALUES ${newArr.join(',')}`
                    db.query(sql3, (err3, result3) => {
                        if (err3) throw err3
                        var idArr = []
                        result1.map((val) => {
                            idArr.push(val.id)
                        })
                        console.log(idArr.join(','))
                        var sql4 = `delete from cart where id in (${idArr.join(',')})`
                        db.query(sql4, (err4, result4) => {
                            if (err4) throw err4

                            var sql5 = `select email from db_user where username ='${data.username}';`
                            db.query(sql5,(err5,result5)=>{
                                if (err5) throw err5
                                var to = result5[0].email

                                var sql6=`select h.username as username, h.total, h.date, quantity, history_detail.total as historyD_total, p.product_name, p.product_price, p.product_discount from history_detail
                                join product p on id_product = p.id
                                join history h on id_history = h.id where id_history=${result2[0].id};`

                                db.query(sql6,(err6,result6)=>{
                                    if (err) throw err
                                    var total = 0
                                    result1.map((val) => {
                                    total += val.product_quantity*(val.product_price-(val.product_price*(val.product_discount/100)))    
                                    })

                                fs.readFile('../support/template/invoice.html', {encoding: 'utf-8'}, (err, hasilRead) => {
                                            if(err) throw err
                                            var template = handlebar.compile(hasilRead)
                                            var totalsemua = result6[0].total
                                            var username = result6[0].username
                                            var data = {result6,totalsemua,username}
                                            
                                            var hasilHbars = template(data)
                                            var options = {
                                                format : 'A4',
                                                orientation : 'landscape',
                                                border : {
                                                    "top": "0.5in",          
                                                    "right": "0.5in",
                                                    "bottom": "0.5in",
                                                    "left": "0.5in"
                                                }
                                            }
                                        
                                            pdf.create(hasilHbars, options).toStream((err, hasilStream) => {
                                                if(err) throw err

                                                var mailOption1 = {
                                                            from : 'FoodQoma <purwadhika@purwadhika.com>',
                                                            to : to ,
                                                            subject: 'INVOICE' ,
                                                            html : `<h1> <a href="http://localhost:3000/Verify-payment"> Upload Your payment here </a> </h1>`,
                                                            attachments :  [
                                                                {
                                                                    filename : 'invoice.pdf',
                                                                    content : hasilStream
                                                                }
                                                            ]
                                                        }
                                                            if (to){
                                                                transporter.sendMail(mailOption1,(err6,result6)=>{
                                                                    if (err6) throw err6
                                                                    console.log('email berhasil dikirim')
                                                                    res.send(result6)
                                                                    })
                                                                }else{
                                                                    res.send('alamat email belom ada')
                                                                    }
                                                    })

                                        })
                            
                                    res.send('success')
                                }) 
                            })
                            
                        })
                    })
                })

            })
        }catch{
            res.send(err)
        }
    })

})

app.get('/showhistory',(req,res)=>{
    var username = req.query.username
    var sql = `select * from history where username ="${username}"`
    db.query(sql,(err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

app.get('/showhistorydetail/:id',(req,res)=>{
    var id_history = req.params.id
    var sql = `select quantity, p.product_name, total, p.product_img from history_detail
    join product p on id_product = p.id where id_history =${id_history};`
    db.query(sql,(err,result)=>{
        try{
            if (err) throw err
            res.send(result)
        }catch{
            if(err) res.send(err)
        }
        
    })
})

// =========================== Verify payment ============================

app.put('/payment-verified',uploadverify.single('payment_verification'),(req, res)=>{
    var username = req.query.username
    var id = req.query.id
    try{
        if(req.validation) throw req.validation
        if(req.file.size > 50000000) throw {error:true, msg: 'image too large'}
        

        var newData = req.file
        newData.img_payment = req.file.path
        console.log((req.file.img_payment))

        var sql = `update history set img_payment = '${newData.img_payment}', status ="DIPROSES" where username ="${username}" and id=${id};`
        db.query(sql,newData, (err, result)=>{
                    if(err) throw err
                    res.send('BERHASIL UPLOAD VERIFIKASI PEMBAYARAN')
                })
    }
    catch(err){
            res.send(err)
    }
})

app.get('/getdatahistory',(req,res)=>{
    var username = req.query.username
    var sql = `select * from history where username = "${username}"  and status ="BELUM BAYAR";`
    db.query(sql,(err,result)=>{
        try{
            if (err) throw err
            res.send(result)
        }catch{
            if(err) res.send(err)
        }
        
    })
})

// =========================== MANAGE TRANSACTION ============================

app.get('/GetDataManageTransaction',(req,res)=>{
    var sql = `select * from history;`
    db.query(sql,(err,result)=>{
        try{
            if (err) throw err
            res.send(result)
        }catch{
            if(err) res.send(err)
        }
        
    })
})

app.get('/GetDataManageTransaction/:id',(req,res)=>{
    var id_history = req.params.id
    var sql = `select * from history where id =${id_history};`
    db.query(sql,(err,result)=>{
        try{
            if (err) throw err
            res.send(result)
            console.log(result)
        }catch{
            if(err) res.send(err)
        }
        
    })
})

app.put('/VerifyDataManageTransaction/:id',(req,res)=>{
    var id_history = req.params.id
    var sql = `update history set status = "DISETUJUI" where id =${id_history};`
    db.query(sql,(err,result)=>{
        try{
            if (err) throw err
            res.send(result)
            console.log(result)
        }catch{
            if(err) res.send(err)
        }
        
    })
})

app.put('/RejectDataManageTransaction',(req,res)=>{
    var id = req.query.id
    var username = req.query.username

    var sql = `update history set status = "DITOLAK" where id =${id};`
    db.query(sql,(err,result)=>{
        try{
            if (err) throw err
            var sql1 = `select email from db_user where username ='${username}'`
            db.query(sql1,(err1,result1)=>{
                if (err) throw err
                var to = result1[0].email

                var mailOption1 = {
                    from : 'FoodQoma <purwadhika@purwadhika.com>',
                    to : to ,
                    subject: 'Information' ,
                    html : `<p> Maaf pesanan anda kami tolak, dengan alasan pembayaran belum kami terima, silahkan ulangi pembayaran dan upload bukti pembayaran. 
                            Terima Kasih.</p>`
                }
                    if (to){
                        transporter.sendMail(mailOption1,(err1,result1)=>{
                            if (err1) throw err1
                            console.log('email berhasil dikirim')
                            res.send(result1)
                        })
                    }else{
                        res.send('alamat email belom ada')
                    }
                res.send(result1)
            })
        }catch{
            if(err) res.send(err)
        }
        
    })
})

// =========================== LAST SEEN ============================

app.post('/lastseen',(req,res)=>{
    try{
        var sql = `select * from last_seen;`
        db.query(sql,(err,result)=>{
            if(err) throw err
            if(result.length>5){
                var sql1=`delete from last_seen where id not in (
                    select id from(
                    select id from last_seen order by id desc limit 5) alias
                    );`
                db.query(sql1,(err1,result1)=>{
                    if (err1) throw err1
                    res.send(result1)
                })
            }else{
                var sql1 = `insert into last_seen set?`
                var data = req.body
                db.query(sql1,data,(err1,result1)=>{
                    if (err1) throw err1
                    res.send(result1)
                })
            }
        })
    }catch(err){
        res.send(err)
    }
})

app.get('/showlastseen/:username',(req,res)=>{
    var username = req.params.username
    var sql = `select * from last_seen where username = '${username}' order by id desc limit 5;`
    db.query(sql,(err,result)=>{
        if(err) throw err
        res.send(result)
    })
})



// =========================== APP LISTEN ============================
app.listen(port, ()=> console.log('aktif di port '+port))

