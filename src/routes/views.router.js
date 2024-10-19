import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('home');
});

router.get('/api/products', async (req, res) => {
    res.render('products');
});

router.get('/api/carts', (req, res) => {
    res.render('carts'); 
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts'); 
});

export default router;
