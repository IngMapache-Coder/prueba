import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

export class StopPointController extends BaseController {
  constructor(stopPointService = container.get('stopPointService')) {
    super(stopPointService);
  }
}

export default new StopPointController();