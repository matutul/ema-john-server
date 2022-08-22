const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sghan.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("database is connected successfully");
  console.log(err);
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertMany(products)
      .then(result => {
        res.send(result.insertedCount);
      })
  })
  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.post('/productsByKeys', (req, res) => {
    productsCollection.find({ key: {$in:req.body}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  app.post('/addOrder', (req, res) => {
    ordersCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount>0);
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)