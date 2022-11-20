const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iipillt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const serviceCollection = client.db('mommyCloudKitchen').collection('services');
        const reviewCollection = client.db('mommyCloudKitchen').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.get('/myreviews', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const myreviews = await cursor.toArray();
            res.send(myreviews);
        });

        app.post('/myreviews', async (req, res) => {
            const myreview = req.body;
            const result = await reviewCollection.insertOne(myreview);
            res.send(result);

        });
    }
    finally {

    }

}
run().catch(error => console.error(error));


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server running on ${port}`);
})
