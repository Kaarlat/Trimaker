import express from 'express';
const router = express.Router();

// Implementa las rutas para productos aquí
// Ejemplo:
router.get('/', (req, res) => {
    res.json({ message: 'Lista de productos' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Crear nuevo producto' });
});

export default router;
