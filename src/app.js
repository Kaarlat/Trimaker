import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.router.js';
import { readJSONFile, writeJSONFile } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main.handlebars' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); 

let products = readJSONFile(path.join(__dirname, '../src/files/products.json'));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('productList', products);

    socket.on('addProduct', (product) => {
        product.id = Date.now(); 
        products.push(product);
        writeJSONFile(path.join(__dirname, '../src/files/products.json'), products);
        io.emit('productList', products);
    });

    socket.on('deleteProduct', (id) => {
        products = products.filter(p => p.id !== id);
        writeJSONFile(path.join(__dirname, '../src/files/products.json'), products);
        io.emit('productList', products);
    });

    socket.on('getProducts', () => {
        socket.emit('productList', products);
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
