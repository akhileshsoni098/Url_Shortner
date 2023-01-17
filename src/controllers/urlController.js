const urlModel=require("../models/model");
const validator=require("validator")
const baseUrl="http://localhost:3000";
const shortid=require("shortid")

const createurl=async function(req,res){
    try{
    //--------------if no data is provided in a body-----------------------------------------
    let data=req.body;
    if(Object.keys(data).length==0){return res.status(400).send({status:false , message:"provide some input of longUrl"})}
    //------------checking whether the key name is longUrl or not--------------------

    let longUrl=data.longUrl
    if(!longUrl) return res.status(400).send({msg:"please provide key longUrl"})
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
        res.status(201).send({ status: true, data: { longUrl: Data.longUrl, shortUrl: Data.shortUrl, urlCode: Data.urlCode.toLowerCase() } });
}catch(error){
    res.status(500).send({msg:error.message})

} 
}
 const geturl = async function(req,res){
    try{
    let codeUrl=req.params.codeUrl
    //------checking whether codeUrl in  path params is provide or not------------ 
    if(!codeUrl) return res.status(400).send({status:false,message:"please Enter a codeUrl in params"});

    //---------checking whether codeUrl is valid or not-------------
    let validCodeUrl=shortid.isValid(codeUrl)
    if(!validCodeUrl) return res.status(400).send({status:false,message:"please Enter a valid CodeUrl"})

   //--------if the codeUrl is valid then we are fetching the data---------- 
    let longUrl=await urlModel.findOne({urlCode:codeUrl}).select({longUrl:1,_id:0})
    if(!longUrl) return res.status(404).send({status:false,message:"Url not found"})
    res.status(302).redirect(longUrl["longUrl"])
    
    }catch(error){
        res.status(500).send({status:false,msg:error.message})

    }      
 }


module.exports.createurl=createurl;
module.exports.geturl=geturl