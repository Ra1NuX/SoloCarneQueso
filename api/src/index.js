const app = require('./app');

app.use("/api/v1/challenger", require('./routes/routes.js'));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening: http://localhost:${port}`);
}); 

