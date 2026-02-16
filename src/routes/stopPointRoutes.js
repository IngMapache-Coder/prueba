import express from 'express';
import * as stopPointController from '../controllers/stopPointController.js';

const router = express.Router();

router.post('/', stopPointController.create);
router.get('/', stopPointController.getAll);
router.get('/:id', stopPointController.getById);
router.put('/:id', stopPointController.update);
router.delete('/:id', stopPointController.remove);

export default router;