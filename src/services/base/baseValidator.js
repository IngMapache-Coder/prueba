import { ValidationError } from '../../utils/errors/domainErrors.js';

export class BaseValidator {
  constructor(model = null) {
    this.model = model;
  }

  async validate(data) {
    if (!data) {
      throw new ValidationError('Los datos son requeridos');
    }
    return true;
  }

  async validateCoordinates(x, y, map) {
    if (!map) {
      throw new ValidationError('Mapa no encontrado');
    }

    if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
      throw new ValidationError(
        `Posición (${x}, ${y}) fuera del mapa. El mapa es de ${map.width}x${map.height}`
      );
    }

    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new ValidationError('Las coordenadas deben ser números enteros');
    }

    return true;
  }

  async validateMapExists(mapId, mapModel) {
    const map = await mapModel.findByPk(mapId);
    if (!map) {
      throw new ValidationError(`Mapa con id ${mapId} no encontrado`);
    }
    return map;
  }
}