import express from 'express';
const router = express.Router();

// Implementa las rutas para carritos aquí
// Ejemplo:
router.get('/', (req, res) => {
    res.json({ message: 'Lista de carritos' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Crear nuevo carrito' });
});

export default router;
