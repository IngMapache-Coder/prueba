import { BaseCrudService } from './base/baseCrudService.js';
import { Map } from '../models/index.js';

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
    return await this.model.findByPk(id, { include: this.userModel });
  }

  async update(id, data) {
    if (data.userId) {
      const user = await this.userModel.findByPk(data.userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
    }
    return await super.update(id, data);
  }
}