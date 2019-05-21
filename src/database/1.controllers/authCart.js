const db = require('./../db/index')

module.exports={
    GetAllCart : (req,res)=>{
        var product_username = req.query.product_username
        var sql = `select * from cart where product_username = '${product_username}' ;`
        db.query(sql,(err,result)=>{
            if (err) throw err
            res.send(result)
        })
    },
    GetAllCartByUsername : (req,res)=>{
        var username = req.params.username
        var sql = `select c.id, p.product_name, p.product_price, p.product_discount, c.product_quantity from cart as c
        join product as p on c.product_id = p.id where c.product_username = "${username}";`
        db.query(sql,(err,result)=>{
            if (err) throw err
            res.send(result)
        })
    
    },
    AddCart : (req,res)=>{
        var data = req.body
        var sql = `insert into cart set?`
        db.query(sql,data,(err,result)=>{
            if (err) throw err
            res.send(result)
        })
    },
    UpdateCartByID : (req,res)=>{
        var id = req.params.id
        var product_quantity = req.body.product_quantity
        var sql = `update cart set product_quantity= ${product_quantity} where id=${id};`
        db.query(sql,(err,result)=>{
            if (err) throw err
            res.send(result)
        })
    },
    GetAllCartByProductIDUsername : (req,res)=>{
        var product_id = req.query.product_id
        var product_username = req.query.product_username
        var sql = `select * from cart where product_id = ${product_id} and product_username = '${product_username}' ;`
        db.query(sql,(err,result)=>{
            if (err) throw err
            res.send(result)
        })
    },
    DeleteCartByID : (req,res)=>{
        var id = req.params.id
        var sql = `delete from cart where id = ${id};`
        db.query(sql,(err,result)=>{
            if (err) throw err
            res.send(result)
        })
    }
}