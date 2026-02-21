import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';

export class MapController extends BaseController {
  constructor(mapService = container.get('mapService')) {
    super(mapService);
  }
}

export default new MapController();