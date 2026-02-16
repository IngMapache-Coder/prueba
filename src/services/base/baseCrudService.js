import { ResourceNotFoundError } from '../../utils/errors/domainErrors.js';

export class BaseCrudService {
  constructor(model, validator = null) {
    this.model = model;
    this.validator = validator;
  }

  async create(data) {
    if (this.validator) {
      await this.validator.validate(data);
    }
    return await this.model.create(data);
  }

  async getAll() {
    return await this.model.findAll();
  }

  async getById(id) {
    const entity = await this.model.findByPk(id);
    if (!entity) {
      throw new ResourceNotFoundError(this.model.name, id);
    }
    return entity;
  }

  async update(id, data) {
    const entity = await this.model.findByPk(id);
    if (!entity) {
      throw new ResourceNotFoundError(this.model.name, id);
    }

    if (this.validator) {
      await this.validator.validate(data);
    }

    return await entity.update(data);
  }

  async delete(id) {
    const entity = await this.model.findByPk(id);
    if (!entity) {
      throw new ResourceNotFoundError(this.model.name, id);
    }
    await entity.destroy();
    return entity;
  }
}