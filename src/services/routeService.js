import { Route, Map } from "../models/index.js";

export const createRoute = async (routeData) => {
  const map = await Map.findByPk(routeData.mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  if (
    routeData.startX < 0 ||
    routeData.startX >= map.width ||
    routeData.startY < 0 ||
    routeData.startY >= map.height
  ) {
    throw new Error(
      `Posición de inicio fuera del mapa. El mapa es de ${map.width}x${map.height}`,
    );
  }

  if (
    routeData.startX < 0 ||
    routeData.startX >= map.width ||
    routeData.startY < 0 ||
    routeData.startY >= map.height ||
    routeData.endX < 0 ||
    routeData.endX >= map.width ||
    routeData.endY < 0 ||
    routeData.endY >= map.height ||
    !Number.isInteger(routeData.startX) ||
    !Number.isInteger(routeData.startY) ||
    !Number.isInteger(routeData.endX) ||
    !Number.isInteger(routeData.endY)
  ) {
    throw new Error(
      `Posiciones fuera del mapa o no enteras. El mapa es de ${map.width}x${map.height}`,
    );
  }

  return await Route.create(routeData);
};

export const getAllRoutes = async () => {
  return await Route.findAll({ include: Map });
};

export const getRouteById = async (id) => {
  return await Route.findByPk(id, { include: Map });
};

export const updateRoute = async (id, routeData) => {
  const route = await Route.findByPk(id);
  if (!route) return null;

  const mapId = routeData.mapId || route.mapId;
  const map = await Map.findByPk(mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  const newStartX =
    routeData.startX !== undefined ? routeData.startX : route.startX;
  const newStartY =
    routeData.startY !== undefined ? routeData.startY : route.startY;
  const newEndX = routeData.endX !== undefined ? routeData.endX : route.endX;
  const newEndY = routeData.endY !== undefined ? routeData.endY : route.endY;

  if (
    newStartX < 0 ||
    newStartX >= map.width ||
    newStartY < 0 ||
    newStartY >= map.height
  ) {
    throw new Error(
      `Posición de inicio fuera del mapa. El mapa es de ${map.width}x${map.height}`,
    );
  }

  if (
    newEndX < 0 ||
    newEndX >= map.width ||
    newEndY < 0 ||
    newEndY >= map.height
  ) {
    throw new Error(
      `Posición de fin fuera del mapa. El mapa es de ${map.width}x${map.height}`,
    );
  }

  return await route.update(routeData);
};

export const deleteRoute = async (id) => {
  const route = await Route.findByPk(id);
  if (!route) return null;
  await route.destroy();
  return route;
};
