import { BaseValidator } from '../services/base/baseValidator.js';
import { ValidationError } from '../utils/errors/domainErrors.js';

export class ObstacleValidator extends BaseValidator {
  async validate(data) {
    await super.validate(data);

    if (data.posX === undefined || data.posX === null) {
      throw new ValidationError('La posición X es requerida');
    }

    if (data.posY === undefined || data.posY === null) {
      throw new ValidationError('La posición Y es requerida');
    }

    if (!data.mapId) {
      throw new ValidationError('El mapId es requerido');
    }

    return true;
  }
}