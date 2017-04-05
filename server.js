const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var dotenv = require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

var db;

MongoClient.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds151070.mlab.com:51070/star-wars-quotes', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, () => {
    console.log('listening on 3000');
  });
});


app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, results) => {
    if (err) return console.log(err);

    // renders index.ejs
    res.render('index.ejs', {quotes: results});
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log('saved to database');
    res.redirect('/');
  });
});

app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate({ name: 'Yoda' }, {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    });
});

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({ name: req.body.name },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send('A darth vader quote got deleted');
    })
})
