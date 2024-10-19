import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import viewsRouter from '../src/routes/views.router.js';
import productsRouter from '../src/routes/products.js';
import Message from '../src/models/message.js';
import Event from './models/event.js'; 
import Cart from './models/cart.js'; 

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
app.use('/api/products', productsRouter);

// Socket.IO
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

    // Creación de nuevos eventos
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
                io.emit('productList', events);
            });
        }).catch(err => {
            console.error('Error al eliminar el producto:', err);
        });
    });
});

// Rutas API para productos
app.get('/api/products', async (req, res) => {
    const { page = 1, limit = 10, category, available, sort } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === 'desc' ? { price: -1 } : { price: 1 },
    };

    try {
        const query = {};
        if (category) query.category = category;
        if (available) query.available = available;

        const products = await Event.paginate(query, options);
        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.page - 1 : null,
            nextPage: products.hasNextPage ? products.page + 1 : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.page - 1}&limit=${limit}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.page + 1}&limit=${limit}` : null,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: "error", message: "Error al obtener productos" });
    }
});

// Métodos para el carrito
app.delete('/api/carts/:id', async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ status: "success", message: "Carrito eliminado" });
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ status: "error", message: "Error al eliminar el carrito" });
    }
});

app.put('/api/carts/:id', async (req, res) => {
    const { category } = req.body;
    
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { category }, { new: true });
        res.json({ status: "success", payload: updatedCart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ status: "error", message: "Error al actualizar el carrito" });
    }
});

// Manejo de errores y validaciones
const validateProductData = (data) => {
    if (!data.name || !data.price || !data.category) {
        return { valid: false, message: "Faltan datos obligatorios" };
    }
    return { valid: true };
};


app.post('/api/products', async (req, res) => {
    const { valid, message } = validateProductData(req.body);
    if (!valid) {
        return res.status(400).json({ status: "error", message });
    }

    const newProduct = new Event(req.body);
    try {
        await newProduct.save();
        
        io.emit('productAdded', newProduct);

        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ status: "error", message: "Error al agregar el producto" });
    }
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
