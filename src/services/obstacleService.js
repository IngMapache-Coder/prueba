import { BaseCrudService } from './base/baseCrudService.js';
import { Obstacle, Map } from '../models/index.js';

export class ObstacleService extends BaseCrudService {
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
    const obstacle = await this.model.findByPk(id);
    if (!obstacle) return null;

    const mapId = data.mapId || obstacle.mapId;
    const map = await this.mapModel.findByPk(mapId);
    if (!map) {
      throw new Error('Mapa no encontrado');
    }

    const newPosX = data.posX !== undefined ? data.posX : obstacle.posX;
    const newPosY = data.posY !== undefined ? data.posY : obstacle.posY;

    await this.validator.validateCoordinates(newPosX, newPosY, map);

    return await obstacle.update(data);
  }
}