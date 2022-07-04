const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



 
app.listen(8080, () => {
    console.log("Server Running on Port 8080");
});
