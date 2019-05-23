const db = require('./../db/index')
const fs = require('fs')
const handlebar = require('handlebars')
const pdf = require ('html-pdf')
const transporter = require('../supports/nodemailer')

module.exports={
    PushHistoryCheckout : (req,res)=>{
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        var month = ['January', 'February', 'March', 'April', 'Mei', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember']
        var date = dd + ' ' + month[mm] + ' ' + yyyy + ' ' + today.getHours() + ':' + today.getMinutes()+ ':' +today.getSeconds()
        var invoice_number = Date.now()
        var data = {
            ...req.body,
            date,
            invoice_number
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
    
                                    var sql6=`select h.username as username, h.total, h.date, h.invoice_number, quantity, history_detail.total as historyD_total, p.product_name, p.product_price, p.product_discount from history_detail
                                    join product p on id_product = p.id
                                    join history h on id_history = h.id where id_history=${result2[0].id};`
    
                                    db.query(sql6,(err6,result6)=>{
                                        if (err) throw err
                                        var total = 0
                                        result1.map((val) => {
                                        total += val.product_quantity*(val.product_price-(val.product_price*(val.product_discount/100)))    
                                        })
    
                                    fs.readFile('../support/template/index.html', {encoding: 'utf-8'}, (err, hasilRead) => {
                                                if(err) throw err
                                                var template = handlebar.compile(hasilRead)
                                                var totalsemua = result6[0].total
                                                var username = result6[0].username
                                                var numb_invoice = result6[0].invoice_number
                                                var date = result6[0].date


                                                var data = {result6,totalsemua,username,numb_invoice,date}
                                                
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
                                                                html : ``,
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
    
    },
    ShowHistoryByUsername : (req,res)=>{
        var username = req.query.username
        var sql = `select * from history where username ="${username}"`
        db.query(sql,(err,result)=>{
            if (err) throw err
            res.send(result)
        })
    },
    ShowHistoryDetailByID : (req,res)=>{
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
    }
}