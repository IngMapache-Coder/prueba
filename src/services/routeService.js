import { BaseCrudService } from './base/baseCrudService.js';
import { Route, Map } from '../models/index.js';
import { ResourceNotFoundError } from '../utils/errors/domainErrors.js';

export class RouteService extends BaseCrudService {
  constructor(model, mapModel, validator) {
    super(model, validator);
    this.mapModel = mapModel;
  }

  async create(data) {
    const map = await this.mapModel.findByPk(data.mapId);
    if (!map) {
      throw new Error('Mapa no encontrado');
    }

    await this.validator.validateCoordinates(data.startX, data.startY, map);
    await this.validator.validateCoordinates(data.endX, data.endY, map);
    
    return await super.create(data);
  }

  async getAll() {
    return await this.model.findAll({ include: this.mapModel });
  }

  async getById(id) {
    const route = await this.model.findByPk(id, { include: this.mapModel });
    
    if (!route) {
      throw new ResourceNotFoundError('Ruta', id);
    }
    
    return route;
  }

  async update(id, data) {
    const route = await this.model.findByPk(id);
    if (!route) {
      throw new ResourceNotFoundError('Ruta', id);
    }

    const mapId = data.mapId || route.mapId;
    const map = await this.mapModel.findByPk(mapId);
    if (!map) {
      throw new Error('Mapa no encontrado');
    }

    const newStartX = data.startX !== undefined ? data.startX : route.startX;
    const newStartY = data.startY !== undefined ? data.startY : route.startY;
    const newEndX = data.endX !== undefined ? data.endX : route.endX;
    const newEndY = data.endY !== undefined ? data.endY : route.endY;

    await this.validator.validateCoordinates(newStartX, newStartY, map);
    await this.validator.validateCoordinates(newEndX, newEndY, map);

    return await route.update(data);
  }
}