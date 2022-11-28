var mongodb=require('mongodb').MongoClient;
module.exports.main=function(req,res)
{
    res.render("main_index",{screen:"scv",test:""})
}
module.exports.rooms=function(req,res)
{
    mongodb.connect("mongodb://127.0.0.1:27017/mydb").then((db,err)=>{

    var dbo =db.db('mydb');
    dbo.collection("cheats").find({}).toArray(function(err,result)
    {
        if(err) throw err;
        console.log(result);
        res.render("main_index",{screen:"rooms",test:JSON.stringify(result)})
        db.close();
    })
    }
    ).then(()=>{}).catch((err)=>{throw err;})
}
module.exports.about=function(req,res)
{
    res.render("main_index",{screen:"about",test:""})
}
module.exports.roomchat=function(req,res)
{ 
    var room=req.params["start"];
    res.render("main_index",{screen:"room-chat",test:req.params['start']});
}