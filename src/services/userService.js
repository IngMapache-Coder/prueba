import { BaseCrudService } from './base/baseCrudService.js';
import { User } from '../models/index.js';
import { ResourceNotFoundError } from '../utils/errors/domainErrors.js';

export class UserService extends BaseCrudService {
  constructor(model, validator) {
    super(model, validator);
  }

  async create(data) {
    if (!data.username) {
      throw new Error('El username es requerido');
    }
    if (!data.email) {
      throw new Error('El email es requerido');
    }
    if (!data.password) {
      throw new Error('La contraseña es requerida');
    }
    return await super.create(data);
  }

  async update(id, data) {
    const user = await this.model.findByPk(id);
    if (!user) {
      throw new ResourceNotFoundError('Usuario', id);
    }
    return await super.update(id, data);
  }
}