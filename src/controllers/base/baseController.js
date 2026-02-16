import { ApplicationError } from '../../utils/errors/applicationError.js';

export class BaseController {
  constructor(service) {
    this.service = service;
  }

  async handleRequest(req, res, operation, successStatus = 200) {
    try {
      const result = await operation(req);
      res.status(successStatus).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  handleError(error, res) {
    console.error(`[${new Date().toISOString()}] Error:`, error);

    if (error instanceof ApplicationError) {
      return res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message
        })),
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Registro duplicado',
        details: error.errors.map(e => ({
          field: e.path,
          message: e.message
        })),
        code: 'DUPLICATE_ERROR',
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  create = (req, res) => this.handleRequest(req, res, async () => {
    return await this.service.create(req.body);
  }, 201);

  getAll = (req, res) => this.handleRequest(req, res, async () => {
    return await this.service.getAll();
  });

  getById = (req, res) => this.handleRequest(req, res, async () => {
    return await this.service.getById(req.params.id);
  });

  update = (req, res) => this.handleRequest(req, res, async () => {
    return await this.service.update(req.params.id, req.body);
  });

  remove = (req, res) => this.handleRequest(req, res, async () => {
    await this.service.delete(req.params.id);
    return { message: 'Recurso eliminado correctamente' };
  });
}