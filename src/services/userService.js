import { BaseCrudService } from './base/baseCrudService.js';
import { User } from '../models/index.js';

export class UserService extends BaseCrudService {
  constructor(model, validator) {
    super(model, validator);
  }

  async create(data) {
    if (!data.username || !data.email || !data.password) {
      throw new Error('Username, email y password son requeridos');
    }
    return await super.create(data);
  }
}