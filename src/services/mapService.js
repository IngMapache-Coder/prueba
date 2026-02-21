import { BaseCrudService } from './base/baseCrudService.js';
import { Map } from '../models/index.js';
import { ResourceNotFoundError } from '../utils/errors/domainErrors.js';

export class MapService extends BaseCrudService {
  constructor(model, userModel, validator) {
    super(model, validator);
    this.userModel = userModel;
  }

  async create(data) {
    const user = await this.userModel.findByPk(data.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return await super.create(data);
  }

  async getAll() {
    return await this.model.findAll({ include: this.userModel });
  }

  async getById(id) {
    const map = await this.model.findByPk(id, { include: this.userModel });
    
    if (!map) {
      throw new ResourceNotFoundError('Mapa', id);
    }
    
    return map;
  }

  async update(id, data) {
    const map = await this.model.findByPk(id);
    
    if (!map) {
      throw new ResourceNotFoundError('Mapa', id);
    }

    if (data.userId) {
      const user = await this.userModel.findByPk(data.userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
    }

    return await super.update(id, data);
  }
}