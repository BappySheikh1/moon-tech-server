require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://moon-tech:0NEKpBy0vdUgT09U@cluster0.frkx4db.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
   useNewUrlParser: true, 
   useUnifiedTopology: true, 
   serverApi: ServerApiVersion.v1 
  });

async function run(){
 
  const productCollection =client.db('moontech').collection('product')
   
  app.get('/products', async (req,res)=>{
    const query ={}
    const cursor = productCollection.find(query)
    const product=await cursor.toArray()

    res.send({ status: true, data: product });
  })

  app.get('/products/:id',async (req,res)=>{
    const id = req.params.id
    const query ={_id : ObjectId(id)}
    const productData= await productCollection.findOne(query)
    res.send(productData)
  })

  app.post('/product', async(req,res)=>{
    const product =req?.body
    // console.log(product);
    const productData= await productCollection.insertOne(product)
    res.send(productData) 
  })

  app.put('/product/:id', async (req,res)=>{
    const id = req.params.id
    const filter ={_id : ObjectId(id)}
    const product =req.body
    console.log(product);
    const UpdateProduct ={
      $set : {
         brand : product.brand,
         model : product.model,
         price : product.price,
      }
    }
    const result =await productCollection.updateOne(filter, UpdateProduct)
    res.send(result)
  })

  app.delete('/product/:id',async (req,res)=>{
    const id =req.params.id
    const query = {_id : ObjectId(id)}
    const deleteProduct = await productCollection.deleteOne(query)
    res.send(deleteProduct)
  })
  
}
run().catch((er)=>{
  console.log(er);
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});