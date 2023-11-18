const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const port = process.env.PORT || 5000;


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
    // await client.connect();

    const addCart = client.db('ecomerceElectronics').collection('popularProducts')
    const addCartPost = client.db('ecomerceElectronics').collection('addCartPost')
    const addWishlist = client.db('ecomerceElectronics').collection('wishlist')
    const addUsers = client.db('ecomerceElectronics').collection('users')
    const addPayments = client.db('ecomerceElectronics').collection('Payments')
    const allData = client.db('ecomerceElectronics').collection('allData')
    const products = client.db('ecomerceElectronics').collection('products')
    const oneData = client.db('ecomerceElectronics').collection('oneData')
    const aboutMan = client.db('ecomerceElectronics').collection('aboutMan')


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
      const result = await addWishlist.insertOne(data);
      res.send(result)
    })

    // app.delete('/addCartPost/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await addCartPost.deleteOne(query)
    //   res.send(result)
    // })
    app.delete('/addCartPost/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
    
      try {
        const result = await addCartPost.deleteOne(query);
    
        // Check if the deletion was successful
        if (result.deletedCount === 1) {
          res.send({ message: 'Document deleted successfully' });
        } else {
          res.status(404).send({ message: 'Document not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
      }
    });
    

    app.get('/wishlist', async (req, res) => {
      const result = await addWishlist.find().toArray();
      res.send(result)

    })



    app.delete('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const data = { _id: new ObjectId(id) };
      const result = await addWishlist.deleteOne(data)
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

    app.post('/users', async (req, res) => {
      const data = req.body;
      const result = await addUsers.insertOne(data);
      res.send(result)
    })

    app.get('/users',async(req,res) =>{
      const users = await addUsers.find().toArray()
      res.send(users)
    })

    app.post('/payments', async (req, res) => {
      const payment = req.body;
      const result = await addPayments.insertOne(payment);
      res.send(result)
    })

    app.get('/payments', async (req, res) => {
      const payment = await addPayments.find().toArray();
      res.send(payment)
    })

    app.get('/payments/ka', async (req, res) => {
      try {
        // Retrieve the first payment among the first 10 in the collection
        const payment = await addPayments.find().sort({ _id: -1 }).limit(1).next();

        if (!payment) {
          return res.status(404).json({ error: 'No payments found' });
        }

        // Send the payment data as a JSON response
        res.json(payment);
      } catch (error) {
        console.error('Error retrieving payment:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // PAYMENT INTENT 
    app.post('/create-payment-intent', async (req, res) => {
      const { prices } = req.body;
      const amount = prices * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
      });
      res.send({
        clientSecret: paymentIntent.client_secret
      })
    })

    // products
    app.get('/products',async(req,res)=>{
      const result = await products.find().toArray()
      res.send(result)
    })

    app.get('/oneData',async(req,res)=>{
      const result = await oneData.find().toArray()
      res.send(result)
    })

    app.get('/aboutMan',async(req,res)=>{
      const result = await aboutMan.find().toArray()
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