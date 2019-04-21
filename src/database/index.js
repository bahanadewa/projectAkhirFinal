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

// ================================ REGISTER =================================

app.get('/getalluser',(req,res)=>{
    var sql = `select * from db_user`
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
    product_price, product_discount, c.product_category
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





// =========================== APP LISTEN ============================
app.listen(port, ()=> console.log('aktif di port '+port))

