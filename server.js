const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

//Initialize SOcket.io Socket
const server = http.createServer(app);
const io = socketIO(server);

// //Port
const port = process.env.PORT || 3000;
const users = {}

// const publicPath = path.join(__dirname + "/../public");
// app.use(express.static(publicPath));

io.on('connection', socket => {
    
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)   
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { name:users[socket.id], message:message})
        
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])   
        delete users[socket.id]
    })
})
app.get('/', (req, res)=>{
    
    res.sendFile(__dirname + '/index.html');
});

server.listen(port, ()=> {
    console.log('Server Listening on Port: ' + port);
    
});