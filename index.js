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

// mongodb uri connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vncsz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// CRUD operation starts from here
async function run() {
  try {
    await client.connect();
    const database = client.db('travelDestination');
    const travelPlaceCollection = database.collection('tourPlaceName');
    const myTourBookingCollection = database.collection('myBookingList');

    // GET API for destination

    app.get('/destinations', async (req, res) => {
      const cusor = travelPlaceCollection.find({});
      const result = await cusor.toArray();
      res.send(result);
    });

    // get single Travel Destination

    app.get('/destinations/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await travelPlaceCollection.findOne(query);
      res.send(result);
    });

    // POST API travel destiation
    app.post('/destinations', async (req, res) => {
      const tourPlaceInfo = req.body;
      const result = await travelPlaceCollection.insertOne(tourPlaceInfo);
      res.json(result);
    });

    //manageAll Booking api 
    app.get('/managleAllBooking', async (req, res) => {
      const cusor = myTourBookingCollection.find({});
      const result = await cusor.toArray();
      res.send(result);
    });

    //manage singleBooking api
    app.get('/managleAllBooking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await myTourBookingCollection.findOne(query);
      res.send(result);
    });

    // UPDATE mange Booking api
    app.put('/managleAllBooking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateBooking = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateBooking.status,
        },
      };
      const result = await myTourBookingCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    //GET from my booking Collection
    app.get('/myBookingList/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cusor = myTourBookingCollection.find(query);
      const result = await cusor.toArray();
      res.send(result);
    });

    //POST To Mybooking collection
    app.post('/myBookingList/:email', async (req, res) => {
      const email = req.params.email;
      const myBookingInfo = req.body;
      const result = await myTourBookingCollection.insertOne(myBookingInfo);
      res.json(result);
    });

    // DELETE MyBooking api
    app.delete('/deleteMyBooking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await myTourBookingCollection.deleteOne(query);
      res.send(result);
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
