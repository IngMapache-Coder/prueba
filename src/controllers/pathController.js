import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';
import { ValidationError } from '../utils/errors/domainErrors.js';

export class PathController extends BaseController {
  constructor(pathFinderService = container.get('pathFinderService')) {
    super(null);
    this.pathFinderService = pathFinderService;
  }

  validatePoints = async (req, res, next) => {
    try {
      const { mapId, startPoint, destinationPoint } = req.body;
      
      if (!mapId || !startPoint || !destinationPoint) {
        throw new ValidationError('Se requieren mapId, startPoint y destinationPoint');
      }

      await this.pathFinderService.validatePoints(mapId, startPoint, destinationPoint);
      res.json({ 
        message: 'Los puntos y el mapa son válidos y existen en la base de datos.' 
      });
    } catch (error) {
      next(error);
    }
  };

  validateMapConfiguration = async (req, res, next) => {
    try {
      const { mapId } = req.body;
      
      if (!mapId) {
        throw new ValidationError('Se requiere mapId');
      }

      await this.pathFinderService.validateMapConfiguration(mapId);
      res.json({ 
        message: 'La configuración del mapa es válida y contiene ruta, obstáculos y puntos de parada.' 
      });
    } catch (error) {
      next(error);
    }
  };

  findPath = async (req, res, next) => {
    try {
      const { mapId, userPreferences } = req.body;
      const { algorithm = 'A*', allowDiagonals = false } = userPreferences ?? {};
      
      const result = await this.pathFinderService.findPath(mapId, algorithm, allowDiagonals);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  };

  traversePath = async (req, res, next) => {
    try {
      const { pathId, mapId } = req.body;
      
      if (!pathId || !mapId) {
        throw new ValidationError('Se requieren pathId y mapId');
      }

      const result = await this.pathFinderService.traversePath(pathId, mapId);
      res.json({ result });
    } catch (error) {
      next(error);
    }
  };
}

export default new PathController();