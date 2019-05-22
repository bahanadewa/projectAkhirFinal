const db = require('./../db/index')
const transporter = require('../supports/nodemailer')

module.exports={
  Uploadverify : (req, res)=>{
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
    },
    GetDataHistory : (req,res)=>{
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
    },
    GetDataManageTransaction :(req,res)=>{
        var sql = `select * from history;`
        db.query(sql,(err,result)=>{
            try{
                if (err) throw err
                res.send(result)
            }catch{
                if(err) res.send(err)
            }
            
        })
    },
    GetDataManageTransactionByID :(req,res)=>{
        var id_history = req.params.id
        var sql = `select * from history where id =${id_history};`
        db.query(sql,(err,result)=>{
            try{
                if (err) throw err
                res.send(result)
            }catch{
                if(err) res.send(err)
            }
            
        })
    },
    VerifyDataManageTransactionByID : (req,res)=>{
        var id_history = req.params.id
        var sql = `update history set status = "DISETUJUI" where id =${id_history};`
        db.query(sql,(err,result)=>{
            try{
                if (err) throw err
                res.send(result)
            }catch{
                if(err) res.send(err)
            }
            
        })
    },
    RejectDataManageTransactionByID : (req,res)=>{
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
    }
}