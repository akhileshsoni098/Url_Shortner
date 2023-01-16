const urlModel=require("../models/model");
const validator=require("validator")
const baseUrl="http://localhost:3000";
const shortid=require("shortid")

const createurl=async function(req,res){
    let longUrl=req.body.longUrl;
    let validUrl=validator.isURL(longUrl);
    if(!validUrl){
        res.status(400).send({msg:"Not a Valid Url"});
    }
    let urlCode =shortid.generate(longUrl);
    let shortUrl=baseUrl+"/"+urlCode
    
   //const data ={longUrl:longUrl,shortUrl:shortUrl,urlCode:urlCode};
   const data={}
   data.longUrll=longUrl
   data.shortUrll=shortUrl
   data.codeUrll=urlCode
   
let createdUrl=await urlModel.create(data);

console.log(createdUrl)



  
}

// const geturl =function(req,res){
//     let shortUrl=req.body.shortUrl
    
// }



module.exports.createurl=createurl;