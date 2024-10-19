import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Para almacenar los carritos
const carts = {}; 

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Obtener los productos en el carrito
app.get('/api/cart', (req, res) => {
    const cartId = req.query.socketId; 
    if (carts[cartId]) {
        res.json(carts[cartId]); // Enviar el carrito completo
    } else {
        res.json({ products: [] });
    }
});

// Configuración de sockets
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado con ID:', socket.id);
    
    // Inicializar el carrito
    carts[socket.id] = { products: [] };

    socket.on('addToCart', (item) => {
        // Agregar item
        carts[socket.id].products.push(item);
        console.log(`Agregado al carrito: ${JSON.stringify(item)}`);

        // Actualizar carrito
        io.emit('cartUpdated', carts[socket.id]);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
        delete carts[socket.id]; // Limpiar el carrito
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 8080; // Cambia a 8080 o al puerto que estés usando
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
