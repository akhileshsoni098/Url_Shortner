
const express=require("express")
const mongoose=require("mongoose")
const app=express()
const bodyParser=require("body-parser");
const route=require("./routes/route")

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://NikithaMerampally:nikitha123@nikithascluster.hwo5ucz.mongodb.net/group16Database",{
    useNewUrlParser: true,
})
.then(()=> console.log("DB is Connected"))
.catch(error=>console.log(error))


app.use("/",route)

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})





