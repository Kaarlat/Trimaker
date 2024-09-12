import express from 'express';
import path from 'path';
import { engine } from 'express-handlebars';
import cartsRouter from './routes/carts.js';
import productsRouter from './routes/products.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);
const socketServer = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/static', express.static(path.join(__dirname, '../public')));

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
