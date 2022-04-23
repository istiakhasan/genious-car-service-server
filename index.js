const express = require("express");
const app = express();
require("dotenv").config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require("mongodb");
// npm i @types/express -D
//geniousCar
//service
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ln10s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
       await client.connect();
       const serviceCollection=client.db('geniousCar').collection('service')
       //load all services
       app.get('/service',async(req,res)=>{
           const query={}
           const cursor=serviceCollection.find(query);
           const result=await cursor.toArray()
           res.send(result)
           
       });
       app.get('/service/:id',async(req,res)=>{
          const id=req.params.id
          const query={_id:ObjectId(id)};
          const service=await  serviceCollection.findOne(query)
          res.send(service)
       })


       app.post('/service',async(req,res)=>{
           const newService=req.body
           const result=await serviceCollection.insertOne(newService)
           res.send(result)
       })
       app.delete('/service/:id',async(req,res)=>{
           const id=req.params.id 
           const query={_id:ObjectId(id)}
           const result=await serviceCollection.deleteOne(query)
           res.send(result)
       })
    } finally {
        // client.close()
    }
};
run().catch(console.dir);

app.listen(port, () => {
    console.log("started successfully");
});