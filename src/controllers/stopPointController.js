import * as stopPointService from '../services/stopPointService.js';

export const create = async (req, res) => {
  try {
    const stopPoint = await stopPointService.createStopPoint(req.body);
    res.status(201).json(stopPoint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const stopPoints = await stopPointService.getAllStopPoints();
    res.json(stopPoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const stopPoint = await stopPointService.getStopPointById(req.params.id);
    if (!stopPoint) {
      return res.status(404).json({ error: 'Punto de parada no encontrado' });
    }
    res.json(stopPoint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const stopPoint = await stopPointService.updateStopPoint(req.params.id, req.body);
    if (!stopPoint) {
      return res.status(404).json({ error: 'Punto de parada no encontrado' });
    }
    res.json(stopPoint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const stopPoint = await stopPointService.deleteStopPoint(req.params.id);
    if (!stopPoint) {
      return res.status(404).json({ error: 'Punto de parada no encontrado' });
    }
    res.json({ message: 'Punto de parada eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};