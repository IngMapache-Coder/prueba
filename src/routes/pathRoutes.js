import express from 'express';
import pathController from '../controllers/pathController.js';

const router = express.Router();

router.post('/validate', pathController.validatePoints);
router.post('/validateMapConfig', pathController.validateMapConfiguration);
router.post('/findPath', pathController.findPath);
router.post('/traverse', pathController.traversePath);

export default router;