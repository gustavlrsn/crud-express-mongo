// https://zellwk.com/blog/crud-express-mongodb/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var dotenv = require('dotenv').config();

var db;

MongoClient.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds151070.mlab.com:51070/star-wars-quotes', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, results) => {
    if (err) return console.log(err);

    // renders index.ejs
    res.render('index.ejs', {quotes: results});
  })

  //res.sendFile(__dirname + '/index.html');
  // note __dirname is the directory that contains the JavaScript source code

  //res.send('hello world');
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log('saved to database');
    res.redirect('/');
  });
});
