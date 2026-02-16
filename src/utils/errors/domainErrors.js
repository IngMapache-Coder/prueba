import { ApplicationError } from './applicationError.js';

export class ResourceNotFoundError extends ApplicationError {
  constructor(resourceType, id) {
    super(
      `${resourceType} con id ${id} no encontrado`, 
      'RESOURCE_NOT_FOUND', 
      404
    );
  }
}

export class ConfigurationError extends ApplicationError {
  constructor(message) {
    super(message, 'CONFIGURATION_ERROR', 400);
  }
}

export class PathNotFoundError extends ApplicationError {
  constructor() {
    super('No se encontró una ruta válida', 'PATH_NOT_FOUND', 404);
  }
}

export class StopsNotCoveredError extends ApplicationError {
  constructor() {
    super(
      'No se encontró ruta que pase por todos los puntos de parada', 
      'STOPS_NOT_COVERED', 
      404
    );
  }
}

export class UnsupportedAlgorithmError extends ApplicationError {
  constructor(algorithm) {
    super(
      `Algoritmo no soportado: ${algorithm}. Use: A*, Dijkstra o BFS`, 
      'UNSUPPORTED_ALGORITHM', 
      400
    );
  }
}

export class ValidationError extends ApplicationError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class DuplicateError extends ApplicationError {
  constructor(message) {
    super(message, 'DUPLICATE_ERROR', 409);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = 'No autorizado') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = 'Acceso prohibido') {
    super(message, 'FORBIDDEN', 403);
  }
}