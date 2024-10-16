const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let messageHistory = [];

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.emit('messageHistory', messageHistory);

    socket.on('newMessage', (message) => {
     
        const newMessage = { socketid: socket.id, mensaje: message };
        messageHistory.push(newMessage);

        io.emit('newMessage', newMessage);
    });

    
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});


const PORT = process.env.PORT || 8080; 
server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
