const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gtlcm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('bdtravels_db');
        const travelingData = database.collection('travelData');

        //GET API
        app.get('/travelData', async (req, res) => {
            const cursor = travelingData.find({});
            const travel = await cursor.toArray();
            res.send(travel)
        })

        //GET Single Travel
        app.get('/travelData/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const travels = await travelingData.findOne(query);
            res.send(travels)
        })

        //POST API
        app.post('/travelData', async (req, res) => {
            const travels = req.body;
            const result = await travelingData.insertOne(travels)
            // console.log(result);
            res.json(result)
        });

        //DELETE API
        app.delete('/travelData/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const travels = await travelingData.deleteOne(query);
            res.send(travels)
        })
    }
    finally {
        // await client.close()
    }

} run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Let's start travelling")
})

app.listen(port, () => {
    console.log('Server Running at', port)
})