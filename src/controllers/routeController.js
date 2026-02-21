import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

export class RouteController extends BaseController {
  constructor(routeService = container.get('routeService')) {
    super(routeService);
  }
}

export default new RouteController();