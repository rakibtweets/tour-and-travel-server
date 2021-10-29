const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vncsz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log('~ uri', uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('travelDestination');
    const travelPlaceCollection = database.collection('tourPlaceName');

    // GET API

    app.get('/destinations', async (req, res) => {
      const cusor = travelPlaceCollection.find({});
      const result = await cusor.toArray();
      res.send(result);
    });

    // POST API
    app.post('/destinations', async (req, res) => {
      const tourPlaceInfo = req.body;
      //   console.log('hitting the post', tourPlaceInfo);
      const result = await travelPlaceCollection.insertOne(tourPlaceInfo);
      console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Tour and Travel server');
});

app.listen(port, () => {
  console.log(`Running app listening at port :${port}`);
});
