import { BaseValidator } from '../services/base/baseValidator.js';
import { ValidationError } from '../utils/errors/domainErrors.js';

export class StopPointValidator extends BaseValidator {
  async validate(data) {
    await super.validate(data);

    if (!data.name) {
      throw new ValidationError('El nombre del punto de parada es requerido');
    }

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