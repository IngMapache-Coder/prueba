import * as obstacleService from '../services/obstacleService.js';

export const create = async (req, res) => {
  try {
    const obstacle = await obstacleService.createObstacle(req.body);
    res.status(201).json(obstacle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const obstacles = await obstacleService.getAllObstacles();
    res.json(obstacles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const obstacle = await obstacleService.getObstacleById(req.params.id);
    if (!obstacle) {
      return res.status(404).json({ error: 'Obstáculo no encontrado' });
    }
    res.json(obstacle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const obstacle = await obstacleService.updateObstacle(req.params.id, req.body);
    if (!obstacle) {
      return res.status(404).json({ error: 'Obstáculo no encontrado' });
    }
    res.json(obstacle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const obstacle = await obstacleService.deleteObstacle(req.params.id);
    if (!obstacle) {
      return res.status(404).json({ error: 'Obstáculo no encontrado' });
    }
    res.json({ message: 'Obstáculo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};