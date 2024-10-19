import express from 'express';
import Cart from '../models/cart.js';

const router = express.Router();

// GET /api/cart/:id
router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate('products.eventId'); // Cambia 'products.eventId' al nombre de tu campo
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/cart/:id/product/:productId
router.delete('/:id/product/:productId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        // Filtrar productos para eliminar
        cart.products = cart.products.filter(product => product.eventId.toString() !== req.params.productId);
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/cart/:id/product
router.put('/:id/product', async (req, res) => {
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity) {
        return res.status(400).json({ message: 'eventId y quantity son requeridos' });
    }

    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(product => product.eventId.toString() === eventId);

        if (productIndex > -1) {
            // Actualiza la cantidad del producto existente
            cart.products[productIndex].quantity = quantity;
        } else {
            // Agregar un nuevo producto al carrito
            cart.products.push({ eventId, quantity });
        }

        await cart.save(); // Guarda el carrito actualizado
        res.json(cart); // Devuelve el carrito actualizado
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;

