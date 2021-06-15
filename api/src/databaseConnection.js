var mysql = require('mysql');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_SECRET,
});

module.exports = conexion;