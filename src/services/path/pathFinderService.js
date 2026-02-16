import { 
  ResourceNotFoundError, 
  ConfigurationError,
  PathNotFoundError 
} from '../../utils/errors/domainErrors.js';

export class PathFinderService {
  constructor(
    mapModel,
    routeModel,
    obstacleModel,
    stopPointModel,
    pathPersistenceService,
    pathStatisticsService,
    gridFactory,
    algorithmFactory
  ) {
    this.mapModel = mapModel;
    this.routeModel = routeModel;
    this.obstacleModel = obstacleModel;
    this.stopPointModel = stopPointModel;
    this.pathPersistenceService = pathPersistenceService;
    this.pathStatisticsService = pathStatisticsService;
    this.gridFactory = gridFactory;
    this.algorithmFactory = algorithmFactory;
  }

  async validatePoints(mapId, startPoint, destinationPoint) {
    const map = await this.mapModel.findByPk(mapId);
    if (!map) {
      throw new ResourceNotFoundError('Mapa', mapId);
    }

    const route = await this.routeModel.findOne({ where: { mapId } });
    if (!route) {
      throw new ConfigurationError('Ruta no encontrada para el mapa especificado');
    }

    if (route.startX !== startPoint.x || route.startY !== startPoint.y) {
      throw new ConfigurationError('El punto de inicio no coincide con la ruta guardada');
    }

    if (route.endX !== destinationPoint.x || route.endY !== destinationPoint.y) {
      throw new ConfigurationError('El punto de destino no coincide con la ruta guardada');
    }

    return true;
  }

  async validateMapConfiguration(mapId) {
    const map = await this.mapModel.findByPk(mapId);
    if (!map) {
      throw new ResourceNotFoundError('Mapa', mapId);
    }

    const route = await this.routeModel.findOne({ where: { mapId } });
    if (!route) {
      throw new ConfigurationError('El mapa no tiene una ruta configurada');
    }

    const obstacle = await this.obstacleModel.findOne({ where: { mapId } });
    if (!obstacle) {
      throw new ConfigurationError('El mapa no tiene obstáculos configurados');
    }

    const stopPoint = await this.stopPointModel.findOne({ where: { mapId } });
    if (!stopPoint) {
      throw new ConfigurationError('El mapa no tiene puntos de parada configurados');
    }

    return true;
  }

  async findPath(mapId, algorithm, allowDiagonals = false) {
    const resources = await this.validateResources(mapId);
    const grid = this.gridFactory.createFromResources(resources);
    
    const result = await this.executeAlgorithm(
      grid, 
      resources, 
      algorithm, 
      allowDiagonals
    );
    
    const savedPath = await this.pathPersistenceService.save(
      result, 
      mapId, 
      algorithm, 
      allowDiagonals
    );
    
    const statistics = this.pathStatisticsService.calculate(
      result, 
      resources, 
      grid
    );
    
    return this.formatResponse(savedPath, result, resources, statistics);
  }

  async traversePath(pathId, mapId) {
    const pathRecord = await this.pathPersistenceService.getById(pathId);
    
    if (pathRecord.mapId !== parseInt(mapId)) {
      throw new ConfigurationError('La ruta no pertenece al mapa indicado');
    }

    const route = await this.routeModel.findOne({ where: { mapId } });
    if (!route) {
      throw new ConfigurationError('El mapa no tiene ruta configurada');
    }

    const stopPoints = await this.stopPointModel.findAll({ where: { mapId } });
    const obstacles = await this.obstacleModel.findAll({ where: { mapId } });

    this.validatePathAgainstResources(
      pathRecord.path, 
      route, 
      stopPoints, 
      obstacles
    );

    return {
      success: true,
      pathId,
      mapId,
      pathLength: pathRecord.path.length,
      message: 'El recorrido del mapa se completó con éxito, evitando obstáculos y pasando por los puntos de parada.'
    };
  }

  async validateResources(mapId) {
    const map = await this.mapModel.findByPk(mapId);
    if (!map) throw new ResourceNotFoundError('Mapa', mapId);
    
    const route = await this.routeModel.findOne({ where: { mapId } });
    if (!route) throw new ConfigurationError('El mapa no tiene una ruta configurada');
    
    const obstacles = await this.obstacleModel.findAll({ where: { mapId } });
    const stopPoints = await this.stopPointModel.findAll({ where: { mapId } });
    
    return { map, route, obstacles, stopPoints };
  }

  async executeAlgorithm(grid, resources, algorithm, allowDiagonals) {
    const start = { x: resources.route.startX, y: resources.route.startY };
    const end = { x: resources.route.endX, y: resources.route.endY };
    const stopPointsCoords = resources.stopPoints.map(sp => ({ 
      x: sp.posX, 
      y: sp.posY 
    }));
    
    try {
      return await this.algorithmFactory
        .getAlgorithm(algorithm)
        .findPath(grid, start, end, allowDiagonals, stopPointsCoords);
    } catch (error) {
      if (error.message.includes('No se encontró ruta')) {
        throw new PathNotFoundError();
      }
      throw error;
    }
  }

  validatePathAgainstResources(path, route, stopPoints, obstacles) {
    if (!Array.isArray(path) || path.length === 0) {
      throw new ConfigurationError('La ruta está vacía o es inválida');
    }

    const start = path[0];
    const end = path[path.length - 1];

    if (start.x !== route.startX || start.y !== route.startY) {
      throw new ConfigurationError('La ruta no inicia en el punto de inicio del mapa');
    }

    if (end.x !== route.endX || end.y !== route.endY) {
      throw new ConfigurationError('La ruta no finaliza en el punto final del mapa');
    }

    const stopPointsSet = new Set(
      stopPoints.map(sp => `${sp.posX},${sp.posY}`)
    );

    const visitedStops = new Set(
      path.map(p => `${p.x},${p.y}`)
    );

    for (const stop of stopPointsSet) {
      if (!visitedStops.has(stop)) {
        throw new ConfigurationError('La ruta no pasa por todos los puntos de parada');
      }
    }

    const obstacleSet = new Set(
      obstacles.map(o => `${o.posX},${o.posY}`)
    );

    for (const point of path) {
      if (obstacleSet.has(`${point.x},${point.y}`)) {
        throw new ConfigurationError(
          `La ruta pasa por un obstáculo en (${point.x}, ${point.y})`
        );
      }
    }
  }

  formatResponse(savedPath, result, resources, statistics) {
    return {
      success: true,
      pathId: savedPath.id,
      algorithm: savedPath.algorithm,
      mapId: resources.map.id,
      mapSize: { width: resources.map.width, height: resources.map.height },
      startPoint: { x: resources.route.startX, y: resources.route.startY },
      endPoint: { x: resources.route.endX, y: resources.route.endY },
      allowDiagonals: savedPath.allowDiagonals,
      path: result.path,
      pathLength: result.path.length,
      cost: result.cost,
      nodesExplored: result.nodesExplored,
      obstaclesCount: resources.obstacles.length,
      stopPointsCount: resources.stopPoints.length,
      statistics
    };
  }
}