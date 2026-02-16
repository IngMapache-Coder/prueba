import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

class ObstacleController extends BaseController {
  constructor() {
    super(container.get('obstacleService'));
  }
}

export default new ObstacleController();