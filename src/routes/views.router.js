import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/api/products', (req, res) => {
    res.render('products');
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;
