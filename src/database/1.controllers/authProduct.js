const db = require('./../db/index')
const fs = require('fs')

module.exports={
    GetAllProduct : (req,res)=>{
        var sql = `select p.id, product_name, product_img, product_serving,
        product_serving,product_calories,product_fat, 
        product_protein, product_carb, product_fiber, 
        product_price, product_discount, product_description, c.product_category
        from product p left join category c on id_category = c.id order by p.id asc;`
    
        db.query(sql,(errbebas,resultbebas)=>{
            if(errbebas) throw errbebas
            res.send(resultbebas)
    
        })
    },
    GetAllProductById : (req,res)=>{
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
    },
    Addproduct : (req, res)=>{
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
    },
    EditProduct : (req,res) => {
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
    }
}