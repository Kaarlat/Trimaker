import { Router } from 'express';
import { createEvent, getEvents, deleteEvent } from '../models/event.model'; 

const router = Router();

router.post('/', async (req, res) => {
    try {
        const event = await createEvent(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el evento' });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await getEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

// Ruta para eliminar un evento
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteEvent(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el evento' });
    }
});

export default router;
