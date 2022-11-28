var express=require('express')
var router=express.Router()
var controll=require('../controller/controller')
router.get("/",controll.main);
router.get("/rooms",controll.rooms);
router.get("/about",controll.about);
router.get("/roomchat/:start",controll.roomchat)
module.exports=router;