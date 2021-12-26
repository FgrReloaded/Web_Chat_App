const user = {};
const express = require("express");


const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 4000;

const io = require('socket.io')(server);

app.use(express.static('public'));




io.on('connection', socket =>{
    socket.on('new-user-joined', names=>{
        user[socket.id] = names;
        socket.broadcast.emit('user-joined', names);
        io.emit('user-list', user);
    })

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, names:user[socket.id]})
    })
    socket.on('typing', names=>{
        socket.broadcast.emit('typing', names);
    })
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', user[socket.id]);
        delete user[socket.id];
        io.emit('user-list', user);
    })

})


server.listen(port);