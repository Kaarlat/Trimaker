const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Para almacenar
const carts = {}; 

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Obtener los productos en el carrito
app.get('/api/cart', (req, res) => {
    const cartId = req.query.socketId; 
    if (carts[cartId]) {
        res.json(carts[cartId].products);
    } else {
        res.json([]);
    }
});

// Socket
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado con ID:', socket.id);
    
    // Inicializar el carrito
    carts[socket.id] = { products: [] };

    socket.on('addToCart', (item) => {
        // Agregar item
        carts[socket.id].products.push(item);
        console.log(`Agregado al carrito: ${JSON.stringify(item)}`);

        // Actualizar cart
        io.emit('cartUpdated', carts[socket.id]);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
        delete carts[socket.id]; // Limpiar el carrito
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
