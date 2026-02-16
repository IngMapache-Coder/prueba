import { Container } from '../container.js';
import { UserService } from '../services/userService.js';
import { MapService } from '../services/mapService.js';
import { ObstacleService } from '../services/obstacleService.js';
import { RouteService } from '../services/routeService.js';
import { StopPointService } from '../services/stopPointService.js';
import { PathFinderService } from '../services/path/pathFinderService.js';
import { PathPersistenceService } from '../services/path/pathPersistenceService.js';
import { PathStatisticsService } from '../services/path/pathStatisticsService.js';
import { GridFactory } from '../utils/grid/gridFactory.js';
import { AlgorithmFactory } from '../utils/algorithms/algorithmFactory.js';
import { AStarAlgorithm } from '../utils/algorithms/astarAlgorithm.js';
import { DijkstraAlgorithm } from '../utils/algorithms/dijkstraAlgorithm.js';
import { BFSAlgorithm } from '../utils/algorithms/bfsAlgorithm.js';
import { UserValidator } from '../validators/userValidator.js';
import { MapValidator } from '../validators/mapValidator.js';
import { ObstacleValidator } from '../validators/obstacleValidator.js';
import { RouteValidator } from '../validators/routeValidator.js';
import { StopPointValidator } from '../validators/stopPointValidator.js';
import { User, Map, Obstacle, Route, StopPoint, Path } from '../models/index.js';

export const container = new Container();

// Registrar modelos
container.register('userModel', () => User);
container.register('mapModel', () => Map);
container.register('obstacleModel', () => Obstacle);
container.register('routeModel', () => Route);
container.register('stopPointModel', () => StopPoint);
container.register('pathModel', () => Path);

// Registrar validadores
container.register('userValidator', () => new UserValidator());
container.register('mapValidator', () => new MapValidator());
container.register('obstacleValidator', () => new ObstacleValidator());
container.register('routeValidator', () => new RouteValidator());
container.register('stopPointValidator', () => new StopPointValidator());

// Registrar algoritmos
container.register('algorithmFactory', () => {
  const factory = new AlgorithmFactory();
  factory.registerAlgorithm('A*', AStarAlgorithm);
  factory.registerAlgorithm('DIJKSTRA', DijkstraAlgorithm);
  factory.registerAlgorithm('BFS', BFSAlgorithm);
  return factory;
});

// Registrar utilidades
container.register('gridFactory', () => new GridFactory());
container.register('pathPersistenceService', (c) => new PathPersistenceService(c.get('pathModel')));
container.register('pathStatisticsService', () => new PathStatisticsService());

// Registrar servicios
container.register('userService', (c) => new UserService(c.get('userModel'), c.get('userValidator')));
container.register('mapService', (c) => new MapService(c.get('mapModel'), c.get('userModel'), c.get('mapValidator')));
container.register('obstacleService', (c) => new ObstacleService(c.get('obstacleModel'), c.get('mapModel'), c.get('obstacleValidator')));
container.register('routeService', (c) => new RouteService(c.get('routeModel'), c.get('mapModel'), c.get('routeValidator')));
container.register('stopPointService', (c) => new StopPointService(c.get('stopPointModel'), c.get('mapModel'), c.get('stopPointValidator')));

container.register('pathFinderService', (c) => new PathFinderService(
  c.get('mapModel'),
  c.get('routeModel'),
  c.get('obstacleModel'),
  c.get('stopPointModel'),
  c.get('pathPersistenceService'),
  c.get('pathStatisticsService'),
  c.get('gridFactory'),
  c.get('algorithmFactory')
));