import { BaseValidator } from '../services/base/baseValidator.js';
import { ValidationError } from '../utils/errors/domainErrors.js';

export class RouteValidator extends BaseValidator {
  async validate(data) {
    await super.validate(data);

    if (data.startX === undefined || data.startX === null) {
      throw new ValidationError('La posición X de inicio es requerida');
    }

    if (data.startY === undefined || data.startY === null) {
      throw new ValidationError('La posición Y de inicio es requerida');
    }

    if (data.endX === undefined || data.endX === null) {
      throw new ValidationError('La posición X de fin es requerida');
    }

    if (data.endY === undefined || data.endY === null) {
      throw new ValidationError('La posición Y de fin es requerida');
    }

    if (!data.mapId) {
      throw new ValidationError('El mapId es requerido');
    }

    return true;
  }
}