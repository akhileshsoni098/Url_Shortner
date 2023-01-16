const urlModel=require("../models/model");
const validator=require("validator")
const baseUrl="http://localhost:3000";
const shortid=require("shortid")

const createurl=async function(req,res){
    let data=req.body;
    let longUrl=data.longUrl
    let validUrl=validator.isURL(longUrl);
    if(!validUrl){
        res.status(400).send({msg:"Not a Valid Url"});
    }
    let urlCode =shortid.generate(longUrl);
    let shortUrl=baseUrl+"/"+urlCode;
    
   //const data ={longUrl:longUrl,shortUrl:shortUrl,urlCode:urlCode};
   const url = { longUrl: longUrl, urlCode: urlCode, shortUrl: shortUrl };
        const Data = await urlModel.create(url)
        res.status(201).send({ status: true, data: { longUrl: Data.longUrl, shortUrl: Data.shortUrl, urlCode: Data.urlCode } });
   
}

 const geturl = async function(req,res){
    let codeUrl=req.params.codeUrl
    let longUrl=await urlModel.findOne({urlCode:codeUrl}).select({longUrl:1,_id:0})
    res.status(302).redirect(longUrl.longUrl)
    
         
 }


module.exports.createurl=createurl;
module.exports.geturl=geturl