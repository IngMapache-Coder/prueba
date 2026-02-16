import { BaseController } from './base/baseController.js';
import { container } from '../config/dependencyInjection.js';
import { ValidationError } from '../utils/errors/domainErrors.js';

class PathController extends BaseController {
  constructor() {
    super(null);
    this.pathFinderService = container.get('pathFinderService');
  }

  validatePoints = (req, res) => this.handleRequest(req, res, async () => {
    const { mapId, startPoint, destinationPoint } = req.body;
    
    if (!mapId || !startPoint || !destinationPoint) {
      throw new ValidationError('Se requieren mapId, startPoint y destinationPoint');
    }

    await this.pathFinderService.validatePoints(mapId, startPoint, destinationPoint);
    return { message: 'Los puntos y el mapa son válidos y existen en la base de datos.' };
  });

  validateMapConfiguration = (req, res) => this.handleRequest(req, res, async () => {
    const { mapId } = req.body;
    
    if (!mapId) {
      throw new ValidationError('Se requiere mapId');
    }

    await this.pathFinderService.validateMapConfiguration(mapId);
    return { message: 'La configuración del mapa es válida y contiene ruta, obstáculos y puntos de parada.' };
  });

  findPath = (req, res) => this.handleRequest(req, res, async () => {
    const { mapId, userPreferences } = req.body;
    const { algorithm = 'A*', allowDiagonals = false } = userPreferences ?? {};
    
    const result = await this.pathFinderService.findPath(mapId, algorithm, allowDiagonals);
    return { result };
  });

  traversePath = (req, res) => this.handleRequest(req, res, async () => {
    const { pathId, mapId } = req.body;
    
    if (!pathId || !mapId) {
      throw new ValidationError('Se requieren pathId y mapId');
    }

    const result = await this.pathFinderService.traversePath(pathId, mapId);
    return { result };
  });
}

export default new PathController();