import * as mapService from '../services/mapService.js';

export const create = async (req, res) => {
  try {
    const map = await mapService.createMap(req.body);
    res.status(201).json(map);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const maps = await mapService.getAllMaps();
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const map = await mapService.getMapById(req.params.id);
    if (!map) {
      return res.status(404).json({ error: 'Mapa no encontrado' });
    }
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const map = await mapService.updateMap(req.params.id, req.body);
    if (!map) {
      return res.status(404).json({ error: 'Mapa no encontrado' });
    }
    res.json(map);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const map = await mapService.deleteMap(req.params.id);
    if (!map) {
      return res.status(404).json({ error: 'Mapa no encontrado' });
    }
    res.json({ message: 'Mapa eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};