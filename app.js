const express=require('express');
var app=express();
var http=require('http');
var server=http.createServer(app);
var ejs=require('ejs');
var router=require('./router/routers');
app.set("view engine","ejs");
var session=require('express-session');
var mongodb=require('mongodb').MongoClient;
const { Server }=require('socket.io');
app.use("/public",express.static(__dirname+"\\public"))
const url ="mongodb://127.0.0.1:27017/mydb";
app.set("views",__dirname+"/views");
var sessy=session({
    secret: 'passvalue2socket',
    resave: false,
    saveUninitialized: true  
});
app.use("/",router);
app.use(sessy);
const io=new Server(server);
mongodb.connect(url).then((db)=>{
    var dbo=db.db("mydb");
    dbo.listCollections({name:'cheats'}).toArray(function(err, collInfos) {
        if(collInfos.length==0)
        {
            dbo.createCollection("cheats").then(()=>{console.log("Collection cheats created")});

        }
        else
        {
            console.log("Collection cheats already exsist!")
        }
    })
}
).catch((err)=>{throw err;})
io.on('connection',(socket)=>{
    console.log("A user connected!")
    socket.on('disconnect',()=>{
        console.log("User disconnected!")
    })
    socket.on("add-room",(data)=>{
    mongodb.connect(url).then((db)=>{
        var dbo=db.db("mydb");
        console.log(data.name);
        dbo.collection('cheats').find({name:data.name}).toArray(function(err,res)
        {
 if(err){throw err;}
 console.log(res);
 if(res.length==0)
 {
    dbo.collection('cheats').insertOne(data,function(err,res)
    {
        if (err) throw err;
        db.close();
        socket.join(data.name);
    })
 }
 else
 {
 console.log("Name already exsist!");
 }
        })
   
        console.log(data);})
    })
    socket.on("pri-mes",(data)=>{
     socket.emit(data.room.toString(),data.content);   
     socket.broadcast.emit(data.room.toString(),data.content);   
    })
})
server.listen(7000,(err)=>{
    if(err){throw err};
    console.log("Run at port:7000")
})