const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express();


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(morgan("dev"));
app.use(cors());

app.get("/api/v1", (req,res) => {
    res.json({
        status: "Online",
    })
});

module.exports = app;