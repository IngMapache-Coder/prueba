import express from 'express';
import obstacleController from '../controllers/obstacleController.js';

const router = express.Router();

router.post('/', obstacleController.create);
router.get('/', obstacleController.getAll);
router.get('/:id', obstacleController.getById);
router.put('/:id', obstacleController.update);
router.delete('/:id', obstacleController.remove);

export default router;