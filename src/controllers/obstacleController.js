import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

export class ObstacleController extends BaseController {
  constructor(obstacleService = container.get('obstacleService')) {
    super(obstacleService);
  }
}

export default new ObstacleController();