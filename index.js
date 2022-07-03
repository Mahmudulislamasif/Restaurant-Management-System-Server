const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port=process.env.PORT|| 5000;
const app = express();

//middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uhtrr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run()
{
    try{
        await client.connect();
        const foodCollection=client.db('FoodCollection').collection('FoodItems')
        app.get('/foods',async(req,res)=>{
            const query={};
            const cursor=foodCollection.find(query);
            const foods=await cursor.toArray();
            res.send(foods)
        });
        app.get('/food/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const food=await foodCollection.findOne(query)
            res.send(food)
        })
        app.put('/food/:id',async(req,res)=>
        {
          const id=req.params.id;
          console.log(req.body)
          const updateQuantity=req.body;
          const filter={_id:ObjectId(id)}
          const options={upsert:true}
          const updateDoc={
            $set:
            {
                quantity:updateQuantity.quantity
            }
          };
          const result =await foodCollection.updateOne(filter,updateDoc,options)
          res.send(result)
        })

    }
    finally
    {

    }

}

run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("Running")
})
app.listen(port,()=>{
    console.log('Listening to port',port)
})