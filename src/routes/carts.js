import { Router } from 'express';
const router = Router();

router.post('/', (req, res) => {
    const cart = { products: [] };
    createCart(cart)
        .then(() => res.status(201).send('Carrito creado'))
        .catch(err => res.status(500).send('Error al crear el carrito'));
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    getCartById(cid)
        .then(cart => res.json(cart))
        .catch(err => res.status(500).send('Error'));
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    addProductToCart(cid, pid, quantity)
        .then(() => res.status(200).send('Producto agregado'))
        .catch(err => res.status(500).send('Error al agregar el producto'));
});

export default router;
