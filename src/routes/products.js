import express from 'express';
import Event from '../models/event.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, category, available, sort } = req.query;

    const query = {};
    if (category) {
        query.category = category;
    }
    if (available) {
        query.stock = available === 'true' ? { $gt: 0 } : { $gte: 0 };
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === 'asc' ? { price: 1 } : { price: -1 },
    };

    try {
        const products = await Event.paginate(query, options);
        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}` : null,
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

export default router;
