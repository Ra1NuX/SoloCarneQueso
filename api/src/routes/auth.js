const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = 10;

const conexion = require("../databaseConnection");

const nuevoUsernameKey = (username) => {
    
    let result='';
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    const charactersLength = characters.length;

    const query = conexion.query(`SELECT usernameKey FROM users WHERE username = ${username}`);

    query.on('result', row => {
        
    })

    for (let i = 0; i < 4; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}




router.get('/', (req, res) => {

});

router.post('/LogIn', async(req, res) => {
    let errno = "-1";
    let err_message = "Todo ha funcionado con exito";

    await conexion.query(`SELECT * FROM users WHERE username = "${req.body.username}"`, (err, val, fields) => {
        if(val.length != 0) {
            bcrypt.compare(req.body.password,val[0].password, (err, same) => {
                if (!same) {
                    errno = "003";
                    err_message = "El usuario o la contraseña no son correctos.";
                }
                res.json({
                    "Error Code": errno,
                    "description": err_message
                });
            });
        }
        else{
            errno = "003";
            err_message = "El usuario o la contraseña no son correctos.";
            res.json({
                "Error Code": errno,
                "description": err_message
            });
        }
    })
})
router.post('/SignIn', (req, res) => {
    let errno = "-1";
    let err_message = "Todo ha funcionado con exito";
    bcrypt.hash(req.body.password, saltRounds, (err, encryptedPass) => {
        conexion.query(`INSERT INTO users(username, user_email, password, usernameKey) 
        SELECT '${req.body.username}', '${req.body.email}', '${encryptedPass}', '${nuevoUsernameKey(req.body.username)}' 
        WHERE NOT EXISTS (SELECT * FROM users WHERE user_email = "${req.body.email}")`, (err, select) => {
            if (err) {
                errno = "000";
                err_message = "La conexion con la base de datos ha fallado";
            }

            if (select.affectedRows == 0) {
                errno = "001";
                err_message = "Ese correo electronico ya esta en uso.";
            }

            res.json({
                "Error Code": errno,
                "description": err_message
            });
        });
    });
});

module.exports = router;
