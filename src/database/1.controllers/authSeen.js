const db = require('./../db/index')

module.exports={
    LastSeen : (req,res)=>{
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
    },
    ShowLastSeenByUsername : (req,res)=>{
        var username = req.params.username
        var sql = `select * from last_seen where username = '${username}' order by id desc limit 5;`
        db.query(sql,(err,result)=>{
            if(err) throw err
            res.send(result)
        })
    }
}