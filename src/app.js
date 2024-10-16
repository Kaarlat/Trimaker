import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import viewsRouter from '../src/routes/views.router.js';
import Message from '../src/models/message.js';
import Event from '../src/models/event.model.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Conexión a MongoDB
mongoose.connect('mongodb+srv://ProyectoFinal:CoderHouse123@proyectofinal.wzy2m.mongodb.net/?retryWrites=true&w=majority&appName=ProyectoFinal', {
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

    // Obtener mensajes 
    Message.find().sort({ timestamp: 1 }).exec().then(messages => {
        socket.emit('messageHistory', messages);
    }).catch(err => {
        console.error('Error al obtener mensajes:', err);
    });

    // Nuevos mensajes
    socket.on('newMessage', (mensaje) => {
        const newMessage = new Message({
            socketid: socket.id,
            mensaje: mensaje
        });

        newMessage.save().then(() => {
            io.emit('newMessage', newMessage);
        }).catch(err => {
            console.error('Error al guardar el mensaje:', err);
        });
    });

    // Escuchar por la creación de nuevos eventos
    socket.on('createEvent', (eventData) => {
        const newEvent = new Event(eventData);

        newEvent.save().then(() => {
            console.log('Evento creado:', newEvent);
            
            Event.find().sort({ createdAt: -1 }).exec().then(events => {
                io.emit('productList', events);
            }).catch(err => {
                console.error('Error al obtener eventos:', err);
            });
        }).catch(err => {
            console.error('Error al guardar el evento:', err);
        });
    });

    // Eliminar productos
    socket.on('deleteProduct', (id) => {
        Event.findByIdAndDelete(id).then(() => {
            Event.find().sort({ createdAt: -1 }).exec().then(events => {
                io.emit('productList', events); /
            });
        }).catch(err => {
            console.error('Error al eliminar el producto:', err);
        });
    });
});

app.get('/api/events', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; 
    const startIndex = (page - 1) * limit; 
    const endIndex = startIndex + limit; 

    // Obtener eventos desde MongoDB
    Event.find().sort({ createdAt: -1 }).exec().then(events => {

        const paginatedEvents = events.slice(startIndex, endIndex);
        
        const totalPages = Math.ceil(events.length / limit);

        const response = {
            status: paginatedEvents.length > 0 ? "success" : "error",
            payload: paginatedEvents,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/events?page=${page - 1}&limit=${limit}` : null,
            nextLink: page < totalPages ? `/api/events?page=${page + 1}&limit=${limit}` : null,
        };

        res.json(response);
    }).catch(err => {
        console.error('Error al obtener eventos:', err);
        res.status(500).json({ status: "error", message: "Error al obtener eventos" });
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
