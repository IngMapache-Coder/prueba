import { Obstacle, Map } from "../models/index.js";

export const createObstacle = async (obstacleData) => {
  const map = await Map.findByPk(obstacleData.mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  if (
    obstacleData.posX < 0 ||
    obstacleData.posX >= map.width ||
    obstacleData.posY < 0 ||
    obstacleData.posY >= map.height ||
    !Number.isInteger(obstacleData.posX) ||
    !Number.isInteger(obstacleData.posY)
  ) {
    throw new Error(
      `Posición fuera del mapa o no entera. El mapa es de ${map.width}x${map.height}`,
    );
  }

  return await Obstacle.create(obstacleData);
};

export const getAllObstacles = async () => {
  return await Obstacle.findAll({ include: Map });
};

export const getObstacleById = async (id) => {
  return await Obstacle.findByPk(id, { include: Map });
};

export const updateObstacle = async (id, obstacleData) => {
  const obstacle = await Obstacle.findByPk(id);
  if (!obstacle) return null;

  const mapId = obstacleData.mapId || obstacle.mapId;
  const map = await Map.findByPk(mapId);
  if (!map) {
    throw new Error("Mapa no encontrado");
  }

  const newPosX =
    obstacleData.posX !== undefined ? obstacleData.posX : obstacle.posX;
  const newPosY =
    obstacleData.posY !== undefined ? obstacleData.posY : obstacle.posY;

  if (
    newPosX < 0 ||
    newPosX >= map.width ||
    newPosY < 0 ||
    newPosY >= map.height
  ) {
    throw new Error(
      `Posición fuera del mapa. El mapa es de ${map.width}x${map.height}`,
    );
  }

  return await obstacle.update(obstacleData);
};

export const deleteObstacle = async (id) => {
  const obstacle = await Obstacle.findByPk(id);
  if (!obstacle) return null;
  await obstacle.destroy();
  return obstacle;
};
