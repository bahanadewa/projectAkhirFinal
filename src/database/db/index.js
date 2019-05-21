const mysql = require('mysql')

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password  : '123123',
    database : 'food_qoma'
})

module.exports = db