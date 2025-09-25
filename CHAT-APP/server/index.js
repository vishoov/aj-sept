const express = require('express');
const app = express();


//we have to do http handshake for socket io
const http = require('http');
const server = http.createServer(app);

//setup cors 
const cors = require('cors');
app.use(cors());

//setting up socket.io
const { Server } = require('socket.io');

const io = new Server(server, {
    cors:{
        origin:"*", //we'll use * for now but in production we should use our client url example http://amazon.com or http://myapp.com 
        methods:["GET", "POST"]
    }
})

//listen on every connection
//event handlers -> emit, on 
//predefined events -> connection, disconnect
io.on(
    "connection",
    (socket)=>{
        console.log(`User connected: ${socket.id}`);

        //Recieve the 'message' from the client
        socket.on('message', (msg)=>{
            console.log("Message received: "+ msg);
            //Broadcast the message to all the clients except the sender
            socket.broadcast.emit('message', msg)
        })


    }
)

app.get("/", (req, res)=>{
    res.send("Hello World");
})


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});