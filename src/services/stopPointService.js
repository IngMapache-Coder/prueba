import { StopPoint, Map } from "../models/index.js";

export const createStopPoint = async (stopPointData) => {
  const map = await Map.findByPk(stopPointData.mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  if (
    stopPointData.posX < 0 ||
    stopPointData.posX >= map.width ||
    stopPointData.posY < 0 ||
    stopPointData.posY >= map.height ||
    !Number.isInteger(stopPointData.posX) ||
    !Number.isInteger(stopPointData.posY)
  ) {
    throw new Error(
      `Posición fuera del mapa. El mapa es de ${map.width}x${map.height}`,
    );
  }

  return await StopPoint.create(stopPointData);
};

export const getAllStopPoints = async () => {
  return await StopPoint.findAll({ include: Map });
};

export const getStopPointById = async (id) => {
  return await StopPoint.findByPk(id, { include: Map });
};

export const updateStopPoint = async (id, stopPointData) => {
  const stopPoint = await StopPoint.findByPk(id);
  if (!stopPoint) return null;

  const mapId = stopPointData.mapId || stopPoint.mapId;
  const map = await Map.findByPk(mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  const newPosX =
    stopPointData.posX !== undefined ? stopPointData.posX : stopPoint.posX;
  const newPosY =
    stopPointData.posY !== undefined ? stopPointData.posY : stopPoint.posY;

  if (
    newPosX < 0 ||
    newPosX >= map.width ||
    newPosY < 0 ||
    newPosY >= map.height ||
    !Number.isInteger(newPosX) ||
    !Number.isInteger(newPosY)
  ) {
    throw new Error(
      `Posición fuera del mapa. El mapa es de ${map.width}x${map.height}`,
    );
  }

  return await stopPoint.update(stopPointData);
};

export const deleteStopPoint = async (id) => {
  const stopPoint = await StopPoint.findByPk(id);
  if (!stopPoint) return null;
  await stopPoint.destroy();
  return stopPoint;
};
