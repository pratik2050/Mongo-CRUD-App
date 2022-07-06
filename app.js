const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

const url = require('./secret');
const { ObjectId } = require('mongodb');

const app = express();

app.use(bodyParser.json());    //return parameter as JSON

const client = new MongoClient(url, {
    useNewUrlParser : true,
    useUnifiedTopology : true           //creating client to connect to db
});
 

// MongoClient.connect(url, (err,db) => {
//     if (err) throw err;
//     console.log("Connected");

//     db.close();
// })

client.connect(err => {
    const myDB = client.db('People').collection('Friends');

    app.get('/user/:name', (req, res) => {      //filtering GET
        myDB.find(req.params).toArray().then(results => {
            console.log(results);
            res.contentType('application/json');
            res.send(JSON.stringify(results));
        });
    });

    app.route('/users')
        .get((req, res) => {
            myDB.find().toArray().then(results => {
                console.log(results);
                res.contentType('application/json');
                res.send(JSON.stringify(results));
            });
        })
        .post((req, res) => {
            console.log(req.body);
            myDB.insertOne(req.body).then(result => {
                console.log(req.body);
                res.contentType('application/json');
                res.send(JSON.stringify(result));
            })
        })
        .put((req, res) => {
            console.log(req.body);
            myDB.findOneAndUpdate(
                {
                    _id:ObjectId(req.body._id)
                }, 
                {$set: {
                    name: req.body.name
                }}, 
                {
                    upsert: false
                }).then(result => {
                    console.log(req.body);
                    res.contentType('application/json');
                    res.send({"status":true});
                })
        })
        .delete((req, res) => {
            myDB.deleteOne({
                _id : ObjectId(req.body._id)
            }).then(result => {
                let flag = true;

                if (result.deletedCount === 0) {
                    flag = false
                }

                res.send({'status': flag})
            })
            .catch(err => {
                console.log(err);
            })
        })

});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



 
app.listen(8080, () => {
    console.log("Server Running on Port 8080");
});
