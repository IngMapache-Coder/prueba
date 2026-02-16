import * as pathService from '../services/pathService.js';

export const validatePoints = async (req, res) => {
    const { mapId, startPoint, destinationPoint } = req.body;
    try {
        await pathService.validatePoints(mapId, startPoint, destinationPoint);
        res.json({ message: 'Los puntos y el mapa son válidos y existen en la base de datos.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const validateMapConfiguration = async (req, res) => {
    const { mapId } = req.body;
    try {
        await pathService.validateMapConfiguration(mapId);
        res.json({ message: 'La configuración del mapa es válida y contiene ruta, obstáculos y puntos de parada.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const findPath = async (req, res) => {
    try {
        const { mapId, userPreferences } = req.body;
        const { algorithm = "A*", allowDiagonals = false } = userPreferences ?? {};
        const result = await pathService.findPath(mapId, algorithm, allowDiagonals);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const traversePath = async (req, res) => {
    const { pathId, mapId } = req.body;
    try {
        const result = await pathService.traversePath(pathId, mapId);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};