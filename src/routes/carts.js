import { Router } from 'express';
import { getCartById, createCart, addProductToCart, updateCart, removeProductFromCart } from './cartController.js'; // Asegúrate de que estas funciones estén implementadas
const router = Router();

router.post('/', async (req, res) => {
    const cart = { products: [] };
    try {
        await createCart(cart);
        res.status(201).send('Carrito creado');
    } catch (err) {
        res.status(500).send('Error al crear el carrito');
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await getCartById(cid);
        res.json(cart);
    } catch (err) {
        res.status(500).send('Error al obtener el carrito');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        await addProductToCart(cid, pid, quantity);
        res.status(200).send('Producto agregado');
    } catch (err) {
        res.status(500).send('Error al agregar el producto');
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        await updateCart(cid, pid, quantity);
        res.status(200).send('Producto actualizado');
    } catch (err) {
        res.status(500).send('Error al actualizar el producto');
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await removeProductFromCart(cid, pid);
        res.status(200).send('Producto eliminado');
    } catch (err) {
        res.status(500).send('Error al eliminar el producto');
    }
});

export default router;
