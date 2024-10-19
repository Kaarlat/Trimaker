import express from 'express';
import Event from '../models/event';
const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, category, available, sort } = req.query;

    const query = {};
    if (category) {
        query.category = category;
    }
    if (available) {
        query.available = available === 'true'; 
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === 'asc' ? { price: 1 } : { price: -1 },
    };

    try {
        const products = await Event.paginate(query, options); 
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
