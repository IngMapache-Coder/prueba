import { BaseValidator } from '../services/base/baseValidator.js';
import { ValidationError } from '../utils/errors/domainErrors.js';

export class MapValidator extends BaseValidator {
  async validate(data) {
    await super.validate(data);

    if (!data.name) {
      throw new ValidationError('El nombre del mapa es requerido');
    }

    if (!data.width || data.width < 1) {
      throw new ValidationError('El ancho del mapa debe ser mayor a 0');
    }

    if (!data.height || data.height < 1) {
      throw new ValidationError('El alto del mapa debe ser mayor a 0');
    }

    if (!data.userId) {
      throw new ValidationError('El userId es requerido');
    }

    return true;
  }
}