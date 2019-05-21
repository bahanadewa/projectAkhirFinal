const db = require('./../db/index')

module.exports = {
    GetAllCategory : (req,res)=>{
        var sql = `select * from category`
        db.query(sql,(errbebas,resultbebas)=>{
            if(errbebas) throw errbebas
            res.send(resultbebas)
        })
    },
    AddCategory : (req, res)=>{
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
    },
    EditCategoryByID : (req,res)=>{
        var id = req.params.id
        var data = req.body.product_category
        var sql = ` update product set id_category= ${data} where id=${id};`
        db.query(sql,data,(err,result)=>{
            if (err) throw err
                res.send('berhasil')
    
        })
    },
    DeleteCategoryByID : (req,res)=>{
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
    },
    UpdateCategoryByID : (req,res)=>{
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
    },
    SearchById : (req,res)=>{
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
       
    }
}