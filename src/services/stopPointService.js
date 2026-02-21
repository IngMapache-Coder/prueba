import { BaseCrudService } from './base/baseCrudService.js';
import { StopPoint, Map } from '../models/index.js';
import { ResourceNotFoundError } from '../utils/errors/domainErrors.js';

export class StopPointService extends BaseCrudService {
  constructor(model, mapModel, validator) {
    super(model, validator);
    this.mapModel = mapModel;
  }

  async create(data) {
    const map = await this.mapModel.findByPk(data.mapId);
    if (!map) {
      throw new Error('Mapa no encontrado');
    }

    await this.validator.validateCoordinates(data.posX, data.posY, map);
    
    return await super.create(data);
  }

  async getAll() {
    return await this.model.findAll({ include: this.mapModel });
  }

  async getById(id) {
    const stopPoint = await this.model.findByPk(id, { include: this.mapModel });
    
    if (!stopPoint) {
      throw new ResourceNotFoundError('Punto de parada', id);
    }
    
    return stopPoint;
  }

  async update(id, data) {
    const stopPoint = await this.model.findByPk(id);
    if (!stopPoint) {
      throw new ResourceNotFoundError('Punto de parada', id);
    }

    const mapId = data.mapId || stopPoint.mapId;
    const map = await this.mapModel.findByPk(mapId);
    if (!map) {
      throw new Error('Mapa no encontrado');
    }

    const newPosX = data.posX !== undefined ? data.posX : stopPoint.posX;
    const newPosY = data.posY !== undefined ? data.posY : stopPoint.posY;

    await this.validator.validateCoordinates(newPosX, newPosY, map);

    return await stopPoint.update(data);
  }
}