import  express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
const port =3000;
const secretkey="shsahjdh";
const app=express();
const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    },
});
//cors used to connect when there is resitrication connect throught socket two way communication origin means for which http need to allow to connect
app.use(cors({
    origin:"http://localhost:5173/",
    methods:["POST","GET"],
    credentials:true
}))//use it later

app.get("/",(req,res)=>{
    res.send("hello world!");
})
app.get('/login',(req,res)=>{
    const token=jwt.sign({_id:"hdhdhdhdhdhd"},secretkey);

    res.cookie("token",token,{httpOnly:true,secure:true,sameSite:"none"})
    .json({
        message:"Login Succesful",
    })
})
io.use((socket,next)=>{
    //this can be used as for auhtorization means until if we don't call next method it will not enter into io.on() 
    const authorizations=true;
    if(authorizations){
        next();
    }
})
io.on("connection",(socket)=>{
    console.log("user connected");
    console.log(socket.id);
    socket.emit("welcome",`welocme to server ${socket.id}`);
    socket.broadcast.emit("welcome",`${socket.id} joined server`);//means who join new to server living him for all other get notification new person joined
    socket.on("message",({message,room})=>{
        //console.log(socket.id,data);
        //socket.broadcast.emit("receive-message",message);
        socket.to(room).emit("receive-message",message);
       
    })
    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log("user joined ",room);
    })
   
    socket.on("disconnect",()=>{
        console.log(`user disconnected ${socket.id}`);
    })
})
server.listen(port,()=>{
    console.log(`server started at ${port}`);
})

//we are using server .listen because app.listen recreate new server 