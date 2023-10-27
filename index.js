const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// midleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnbwwnw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addCart = client.db('ecomerceElectronics').collection('popularProducts')
    const addCartPost = client.db('ecomerceElectronics').collection('addCartPost')
    const addWishlist = client.db('ecomerceElectronics').collection('wishlist')


    app.get('/popularProducts', async (req, res) => {
      const result = await addCart.find().toArray();
      res.send(result)
    })
    app.post('/addCartPost', async (req, res) => {
      const data = req.body;
      if (!data) {
        return res.send({ message: 'data not found' })
      }
      const result = addCartPost.insertOne(data);
      res.send(result)
    })

    app.post('/wishlist', async (req, res) => {
      const data = req.body;
      if (!data) {
        return res.send({ message: 'data not found' })
      }
      const result = addWishlist.insertOne(data);
      res.send(result)
    })

    app.get('/wishlist',async(req,res) =>{
      const result = await addWishlist.find().toArray();
      res.send(result)
    })

    app.get('/addCartPost', async (req, res) => {
      const result = await addCartPost.find().toArray();
      res.send(result)
    
    })

    app.get('/addCartPost/:id', async (req, res) => {
      const id = req.params.id
      const result = await addCartPost.findOne({ _id: new ObjectId(id) })
      res.send(result)
    })
   


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get(('/'), (req, res) => {
  res.send('port is runring')
})

app.listen(port, () => {
  console.log(`boss is sitting ${port}`)
})