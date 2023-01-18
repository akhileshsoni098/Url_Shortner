const urlModel=require("../models/model");
const validator=require("validator")
const baseUrl="http://localhost:3000";
const shortid=require("shortid")

const redis=require('redis')
const {promisify}=require("util")

//1. Connect to the redis server
const redisClient = redis.createClient(
    18308,
    "redis-18308.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("d1e6oJqtckL0m03dhEuBs4kTMhF55qba", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });

 //--creating GET_ASYNC and SETASYNC-----------------
 const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
 const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
 
 

const createurl=async function(req,res){
    try{
    //--------------if no data is provided in a body-----------------------------------------
    let data=req.body;
    if(Object.keys(data).length==0){return res.status(400).send({status:false , message:"provide some input of longUrl"})}
    if(Object.keys(data).length!=1){return res.status(400).send({status:false , message:"body only accept longUrl key"})}

    //------------checking whether the key name is longUrl or not--------------------

    let longUrl=data.longUrl
    if(!longUrl) return res.status(400).send({status:false,msg:"please provide key longUrl"})
    //-----------checking whether type of longUrl is string or not--------------
    if(typeof(longUrl) != "string"){return res.status(400).send({status:false , message:"Please provide url in a string format "})}

    //------------checking whetther longUrl is valid or not---------------------
    let validUrl=validator.isURL(longUrl.trim());
    if(!validUrl){
        res.status(400).send({status:false,message:"Not a Valid Url"});
    }
   

    //-------------checking whether the short url is already generated with this long url-------------------
    const sameUrl = await urlModel.findOne({longUrl:longUrl}).select({_id:0 , __v:0 ,createdAt:0 ,updatedAt:0})
        if(sameUrl){return res.status(200).send({status:true , data:sameUrl})}
    
    //---------if short url is not generated yet with this long url then we are generating short url----------
    let urlCode =shortid.generate(longUrl)
    
    let shortUrl=baseUrl+"/"+urlCode.toLowerCase();
    const url = { longUrl: longUrl, urlCode: urlCode.toLowerCase(), shortUrl: shortUrl.toLowerCase() };
        const Data = await urlModel.create(url)
        const data2=await SET_ASYNC(`${urlCode}`, JSON.stringify(Data)) 
        console.log(data2)
        res.status(201).send({ status: true, data: { longUrl: Data.longUrl, shortUrl: Data.shortUrl, urlCode: Data.urlCode.toLowerCase() } });
}catch(error){
    res.status(500).send({msg:error.message})

} 
}
const geturl = async function(req,res){
    try{
    let urlCode=req.params.urlCode
    //------checking whether codeUrl in  path params is provide or not------------ 
    if(!urlCode) return res.status(400).send({status:false,message:"please Enter a codeUrl in params"});

 //---------checking whether codeUrl is valid or not-------------
    let validCodeUrl=shortid.isValid(urlCode)
    if(!validCodeUrl) return res.status(400).send({status:false,message:"please Enter a valid CodeUrl"})

// //    //--------if the codeUrl is valid then we are fetching the data---------- 
    // const result=await GET_ASYNC(`${urlCode}`)
    // console.log(result)
    res.send({msg:false})
    let longUrl=await urlModel.findOne({urlCode:urlCode}).select({longUrl:1,_id:0})
    
    if(!longUrl) return res.status(404).send({status:false,message:"Url not found"})
    res.status(302).redirect(longUrl["longUrl"])
    
    }catch(error){
        res.status(500).send({status:false,msg:error.message})

    }  
      
 }

 const testapi=async function(req,res){
    await GET_ASYNC("urlCode")
    res.send(result)
 }


 module.exports.testapi=testapi
module.exports.createurl=createurl;
module.exports.geturl=geturl