import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import viewsRouter from './routes/views.router.js';
import { Message } from '../src/models/message.js';
import { Event } from '../src/models/event.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);


mongoose.connect('mongodb+srv://ProyectoFinal:CoderHouse123@proyectofinal.wzy2m.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error al conectar a MongoDB', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main.handlebars' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/', viewsRouter); 

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

   
    Message.find().sort({ timestamp: 1 }).exec((err, messages) => {
        if (err) throw err;
        socket.emit('messageHistory', messages);
    });

    socket.on('newMessage', (mensaje) => {
        const newMessage = new Message({
            socketid: socket.id,
            mensaje: mensaje
        });

        newMessage.save((err) => {
            if (err) throw err;
            io.emit('newMessage', newMessage);
        });
    });

    socket.on('createEvent', (eventData) => {
        const newEvent = new Event(eventData);

        newEvent.save((err) => {
            if (err) throw err;
            io.emit('eventCreated', newEvent);
        });
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
