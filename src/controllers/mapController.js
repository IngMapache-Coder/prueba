import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

class MapController extends BaseController {
  constructor() {
    super(container.get('mapService'));
  }
}

export default new MapController();