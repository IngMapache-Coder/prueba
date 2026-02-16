import { Map, Route, Obstacle, StopPoint, Path } from "../models/index.js";
import * as algorithms from "../utils/algorithms.js";

export const validatePoints = async (mapId, startPoint, destinationPoint) => {
  const map = await Map.findByPk(mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }
  const route = await Route.findOne({ where: { mapId: mapId } });
  if (!route) {
    throw new Error("Ruta no encontrada para el mapa especificado");
  }

  if (route.startX !== startPoint.x || route.startY !== startPoint.y) {
    throw new Error("El punto de inicio no coincide con la ruta guardada");
  }

  if (route.endX !== destinationPoint.x || route.endY !== destinationPoint.y) {
    throw new Error("El punto de destino no coincide con la ruta guardada");
  }

  return true;
};

export const validateMapConfiguration = async (mapId) => {
  const map = await Map.findByPk(mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  const route = await Route.findOne({ where: { mapId: mapId } });
  if (!route) {
    throw new Error("El mapa no tiene una ruta configurada");
  }

  const obstacle = await Obstacle.findOne({ where: { mapId: mapId } });
  if (!obstacle) {
    throw new Error("El mapa no tiene obstáculos configurados");
  }

  const stopPoint = await StopPoint.findOne({ where: { mapId: mapId } });
  if (!stopPoint) {
    throw new Error("El mapa no tiene puntos de parada configurados");
  }

  return true;
};

export const findPath = async (mapId, algorithm, allowDiagonals = false) => {
  const map = await Map.findByPk(mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  const route = await Route.findOne({ where: { mapId: mapId } });
  if (!route) {
    throw new Error("El mapa no tiene una ruta configurada");
  }

  const obstacles = await Obstacle.findAll({ where: { mapId: mapId } });

  const stopPoints = await StopPoint.findAll({ where: { mapId: mapId } });

  const grid = algorithms.createGridFromMapData(
    map,
    obstacles,
    stopPoints,
    route,
  );

  const start = { x: route.startX, y: route.startY };
  const end = { x: route.endX, y: route.endY };

  const stopPointsCoords = stopPoints.map((sp) => ({
    x: sp.posX,
    y: sp.posY,
  }));

  let result;

  switch (algorithm.toUpperCase()) {
    case "A*":
      result = algorithms.findPathAStar(
        grid,
        start,
        end,
        allowDiagonals,
        stopPointsCoords,
      );
      break;
    case "DIJKSTRA":
      result = algorithms.findPathDijkstra(
        grid,
        start,
        end,
        allowDiagonals,
        stopPointsCoords,
      );
      break;
    case "BFS":
      result = algorithms.findPathBFS(
        grid,
        start,
        end,
        allowDiagonals,
        stopPointsCoords,
      );
      break;
    default:
      throw new Error("Algoritmo no soportado. Use: A*, Dijkstra o BFS");
  }

  const savedPath = await Path.create({
    mapId,
    algorithm: algorithm.toUpperCase(),
    allowDiagonals,
    cost: result.cost,
    pathLength: result.path.length,
    nodesExplored: result.nodesExplored,
    path: result.path,
  });

  return {
    success: true,
    pathId: savedPath.id,
    algorithm,
    mapId,
    mapSize: { width: map.width, height: map.height },
    startPoint: start,
    endPoint: end,
    allowDiagonals,
    path: result.path,
    pathLength: result.path.length,
    cost: result.cost,
    nodesExplored: result.nodesExplored,
    obstaclesCount: obstacles.length,
    stopPointsCount: stopPoints.length,
    statistics: {
      efficiency: (result.path.length / result.nodesExplored).toFixed(4),
      explorationRate:
        ((result.nodesExplored / (map.width * map.height)) * 100).toFixed(2) +
        "%",
      stopsCoverage:
        stopPointsCoords.length > 0
          ? `${((result.stopsVisited / stopPointsCoords.length) * 100).toFixed(1)}%`
          : "N/A",
    },
  };
};

export const traversePath = async (pathId, mapId) => {
  const pathRecord = await Path.findByPk(pathId);
  if (!pathRecord) {
    throw new Error("Ruta no encontrada");
  }

  if (pathRecord.mapId !== mapId) {
    throw new Error("La ruta no pertenece al mapa indicado");
  }

  const route = await Route.findOne({ where: { mapId } });
  if (!route) {
    throw new Error("El mapa no tiene ruta configurada");
  }

  const stopPoints = await StopPoint.findAll({ where: { mapId } });
  const obstacles = await Obstacle.findAll({ where: { mapId } });

  const path = pathRecord.path;

  if (!Array.isArray(path) || path.length === 0) {
    throw new Error("La ruta está vacía o es inválida");
  }

  const start = path[0];
  const end = path[path.length - 1];

  if (start.x !== route.startX || start.y !== route.startY) {
    throw new Error("La ruta no inicia en el punto de inicio del mapa");
  }

  if (end.x !== route.endX || end.y !== route.endY) {
    throw new Error("La ruta no finaliza en el punto final del mapa");
  }

  const stopPointsSet = new Set(
    stopPoints.map((sp) => `${sp.posX},${sp.posY}`)
  );

  const visitedStops = new Set(
    path.map((p) => `${p.x},${p.y}`)
  );

  for (const stop of stopPointsSet) {
    if (!visitedStops.has(stop)) {
      throw new Error("La ruta no pasa por todos los puntos de parada");
    }
  }

  const obstacleSet = new Set(
    obstacles.map((o) => `${o.posX},${o.posY}`)
  );

  for (const point of path) {
    if (obstacleSet.has(`${point.x},${point.y}`)) {
      throw new Error(
        `La ruta pasa por un obstáculo en (${point.x}, ${point.y})`
      );
    }
  }

  return {
    success: true,
    pathId,
    mapId,
    pathLength: path.length,
    message: "El recorrido del mapa se completó con éxito, evitando obstáculos y pasando por los puntos de parada.",
  };
};
