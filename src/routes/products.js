import express from 'express';
const router = express.Router();

let products = [];

router.get('/', (req, res) => {
    res.json(products);
});

router.post('/', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        products[index] = req.body;
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== parseInt(id));
    res.status(204).end();
});

export default router;
