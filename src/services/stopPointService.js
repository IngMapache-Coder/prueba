import { BaseCrudService } from './base/baseCrudService.js';
import { StopPoint, Map } from '../models/index.js';

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
    return await this.model.findByPk(id, { include: this.mapModel });
  }

  async update(id, data) {
    const stopPoint = await this.model.findByPk(id);
    if (!stopPoint) return null;

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