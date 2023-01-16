
const express = require("express");
const router = express.Router();
const controller=require("../controllers/urlController");

router.post("/createUrl",controller.createurl);
router.get("/getUrl/:codeUrl",controller.geturl)

module.exports=router;







