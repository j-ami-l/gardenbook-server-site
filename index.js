require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors())
app.use(express.json())

const port = 3000;


app.get('/', (req, res) => {
  res.send("hasan")
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.blokvlz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const tipsCollection = client.db("GardenBook").collection("tips")

    app.post('/alltips', async (req, res) => {
      const newPost = req.body;
      const result = await tipsCollection.insertOne(newPost)
      res.send(result)

    })

    app.get('/mytips' , async (req , res)=>{
      
    })







    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log("the server is running")
})
