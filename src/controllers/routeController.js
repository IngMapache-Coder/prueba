import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

class RouteController extends BaseController {
  constructor() {
    super(container.get('routeService'));
  }
}

export default new RouteController();