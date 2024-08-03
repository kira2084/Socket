import { Container, Stack, TextField, Typography, containerClasses } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client";
export default function App() {
  
  const socket =useMemo(()=>io("http://localhost:3000"),[]);//give to connect backend or server
  const [message,setmessage]=useState("");
  const [room,setRoom]=useState("");
  const [socketid,setsocketid]=useState('');
  const [messages,setAllmessage]=useState([]);
  const [joinroom,setjoinroom]=useState();
  useEffect(()=>{
    socket.on("connect",()=>{
      setsocketid(socket.id);
      console.log("connected",socket.id);
    });
    socket.on("welcome",(s)=>console.log(s));
    socket.on("receive-message",(data)=>{
      console.log(data);
      setAllmessage((messages)=>[...messages,data]);
    });
    return ()=>{socket.disconnect();};
  },[])
  const handlerSubmit=(e)=>{
    e.preventDefault();
    socket.emit("message",{message,room});
    setmessage("");
  }
  const handlerSubmit1=(e)=>{
    e.preventDefault();
    socket.emit("join-room",joinroom);
    
    setjoinroom("");
  }
  return (
    <Container maxWidth="sm">
      <br />
      <form onSubmit={handlerSubmit1}>
        <TextField value={joinroom}
        onChange={(e)=>setjoinroom(e.target.value)}
        id='outlined-basic'
        label="join room"
        variant='outlined'
        
        />
         
        <button type="submit" variant="contained" color='Primary'>Join</button>
      </form>
     <Typography variant='h6' component='div'>{socketid}</Typography>
      <form onSubmit={handlerSubmit}>
        <TextField value={message}
        onChange={(e)=>setmessage(e.target.value)}
        id='outlined-basic'
        label="message"
        variant='outlined'/>
         <TextField value={room}
        onChange={(e)=>setRoom(e.target.value)}
        id='outlined-basic'
        label="room"
        variant='outlined'/>
        <button type="submit" variant="contained" color='Primary'>send</button>
      </form>
      <Stack>
        {messages.map((m,i)=>(
          <Typography variant='h2' key={i} component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  )
}
