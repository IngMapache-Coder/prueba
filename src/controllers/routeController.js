import * as routeService from '../services/routeService.js';

export const create = async (req, res) => {
  try {
    const route = await routeService.createRoute(req.body);
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const routes = await routeService.getAllRoutes();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const route = await routeService.getRouteById(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const route = await routeService.updateRoute(req.params.id, req.body);
    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    res.json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const route = await routeService.deleteRoute(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    res.json({ message: 'Ruta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};