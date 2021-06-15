const path = require('path')
const expressSession = require('express-session');
const passport = require('passport');


const app = require('./app');

require("dotenv").config();
app.use('/', require("./routes/auth"))
require("./game/Challenger");

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening: http://localhost:${port}`);
});

