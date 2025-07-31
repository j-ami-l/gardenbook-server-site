require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors())
app.use(express.json())

const port = 3000;


app.get('/', (req, res) => {
  res.send("hasan jamil")
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
    const usersCollection = client.db("GardenBook").collection("users")
    const gardernersCollection = client.db("GardenBook").collection("gardeners")


    app.get('/browsetips', async (req, res) => {
      const query = { availability: "Public" };
      const result = await tipsCollection.find(query).toArray()
      res.send(result)
    })


    app.get('/tipdetails/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await tipsCollection.findOne(query)
      res.send(result)
      
    })

    app.post('/user', async (req , res) => {
      const email = req.body
      console.log(email)
      const result = await usersCollection.findOne(email)
      res.send(result)
    })

    app.post('/gardenbook/users', async (req, res) => {
      const newUser = req.body;
      const existingUser = await usersCollection.findOne({ email: newUser.email });
      if (existingUser) {
        return res.status(200).send({ message: "User already exists", user: existingUser });
      }
      const result = await usersCollection.insertOne(newUser);
      res.status(201).send(result);
    });

    app.get('/gardeners', async (req ,res) =>{
        const result = await gardernersCollection.find().toArray()
        res.send(result)
    })

    app.post('/gardeners' ,async (req , res) =>{
      const newGardener = req.body;
      const result = await gardernersCollection.insertOne(newGardener)
      res.send(result)

    })



    app.patch('/gardenbook/userinfo/update', async (req, res) => {
      const email = req.body.email;
      const id = req.body.id
      const filter = { email : email};
      const updateDoc = {
        $addToSet: { likedPost: id }
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
       res.send(result);
    })

    

    app.post('/alltips', async (req, res) => {
      const newPost = req.body;
      const result = await tipsCollection.insertOne(newPost)
      res.send(result)

    })

    app.post('/mytips', async (req, res) => {
      const query = req.body;
      const result = await tipsCollection.find(query).toArray()
      res.send(result)
    })

    app.patch('/mytips/updatelikecount/:id', async (req, res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const likeCount = req.body.likeCount;
      const updateDoc = {
        $set: { likeCount }
      };
      const result = await tipsCollection.updateOne(filter, updateDoc);
       res.send(result);

    })


    app.put('/mytips/update/:id', async (req, res) => {
      const id = req.params.id;
      const updatePost = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: updatePost,
      };
      const result = await tipsCollection.updateOne(filter, updateDoc, options);
      res.send(result)


    })

    app.delete('/delete', async (req, res) => {
      const { id } = req.body
      const query = { _id: new ObjectId({ id }) }

      const result = tipsCollection.deleteOne(query)
      res.send(result)

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
