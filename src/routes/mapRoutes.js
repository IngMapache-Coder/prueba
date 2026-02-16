import express from 'express';
import mapController from '../controllers/mapController.js';

const router = express.Router();

router.post('/', mapController.create);
router.get('/', mapController.getAll);
router.get('/:id', mapController.getById);
router.put('/:id', mapController.update);
router.delete('/:id', mapController.remove);

export default router;