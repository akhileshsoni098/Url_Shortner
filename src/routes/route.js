const express = require("express");
const router = express.Router();
const controller=require("../controllers/urlController");

router.post("/url/shorten",controller.createurl);
router.get("/:urlCode",controller.geturl)

router.all('/*',function (res ,res){
    res.status(400).send({status :false ,data:"Please send correct url "});
})


module.exports=router;







