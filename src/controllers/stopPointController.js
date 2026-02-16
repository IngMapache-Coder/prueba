import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

class StopPointController extends BaseController {
  constructor() {
    super(container.get('stopPointService'));
  }
}

export default new StopPointController();