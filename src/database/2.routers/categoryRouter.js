var Router = require('express').Router()

var {GetAllCategory,
    AddCategory,
    DeleteCategoryByID,
    UpdateCategoryByID,
    SearchById,
    EditCategoryByID} = require('../1.controllers/authCategory')

Router.get('/getallcategory',GetAllCategory)
Router.post('/addCategory',AddCategory)
Router.delete('/deleteCategory/:id',DeleteCategoryByID)
Router.put('/updateCategory/:id',UpdateCategoryByID)
Router.get('/getsearch/:id',SearchById)
Router.put('/updateCategoryProduct/:id',EditCategoryByID)

module.exports = Router