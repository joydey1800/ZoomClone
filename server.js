const express = require('express');
const app = express();
const port = process.env.PORT || '3000';


const server = require('http').Server(app);
const { v4: uuidV4 } = require('uuid');

server.listen(port)



const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})


app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);


        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        })
    })
})



