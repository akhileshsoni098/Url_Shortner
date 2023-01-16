const mongoose=require("mongoose")

const urlModel=new mongoose.Schema({
    urlCode:{
        type:String,
        required:true,
        lowerCase:true,
        unique:true
    },
    longUrl:{
        type:String,
        required:true,
        
    },
    shortUrl:{
        type:String,
        required:true,
        

    }
},{timestamps:true})

module.exports=mongoose.model("urlshortner",urlModel);
