import { Map, User } from '../models/index.js';

export const createMap = async (mapData) => {
  const user = await User.findByPk(mapData.userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return await Map.create(mapData);
};

export const getAllMaps = async () => {
  return await Map.findAll({ include: User });
};

export const getMapById = async (id) => {
  return await Map.findByPk(id, { include: User });
};

export const updateMap = async (id, mapData) => {
  const map = await Map.findByPk(id);
  if (!map) return null;
  
  if (mapData.userId) {
    const user = await User.findByPk(mapData.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
  }
  
  return await map.update(mapData);
};

export const deleteMap = async (id) => {
  const map = await Map.findByPk(id);
  if (!map) return null;
  await map.destroy();
  return map;
};