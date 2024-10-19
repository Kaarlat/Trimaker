import express from 'express';
import Event from '../models/event'; 

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const events = await Event.find(); 
        res.render('home', { events });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).send('Error del servidor');
    }
});

router.get('/api/products', (req, res) => {
    res.render('products'); 
});

router.get('/api/carts', (req, res) => {
    res.render('carts'); 
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts'); 
});

export default router;
