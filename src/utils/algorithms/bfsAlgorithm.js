import { BasePathAlgorithm } from './baseAlgorithm.js';
import { getNeighbors, reconstructPath } from '../pathUtils.js';

export class BFSAlgorithm extends BasePathAlgorithm {

  getHeuristic() {
    return null;
  }
  
  findPath(grid, start, end, allowDiagonals = false, stopPoints = []) {
    if (!stopPoints || stopPoints.length === 0) {
      return this.findPathSimple(grid, start, end, allowDiagonals);
    }
    return this.findPathWithStops(grid, start, end, allowDiagonals, stopPoints);
  }

  findPathSimple(grid, start, end, allowDiagonals) {
    const queue = [];
    const visited = new Set();

    queue.push({
      x: start.x,
      y: start.y,
      g: 0,
      parent: null,
    });

    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (current.x === end.x && current.y === end.y) {
        return {
          path: reconstructPath(current),
          cost: current.g,
          nodesExplored: visited.size,
        };
      }

      const neighbors = getNeighbors(grid[current.x][current.y], grid, allowDiagonals);

      for (const neighbor of neighbors) {
        if (neighbor.isObstacle) continue;

        queue.push({
          x: neighbor.x,
          y: neighbor.y,
          g: current.g + 1,
          parent: current,
        });
      }
    }

    throw new Error('No se encontró ruta');
  }

  findPathWithStops(grid, start, end, allowDiagonals, stopPoints) {
    const stopSet = new Set(stopPoints.map(s => `${s.x},${s.y}`));
    const totalStops = stopSet.size;

    const queue = [];
    const visitedStates = new Set();

    const startStops = stopSet.has(`${start.x},${start.y}`) 
      ? new Set([`${start.x},${start.y}`]) 
      : new Set();

    queue.push({
      x: start.x,
      y: start.y,
      g: 0,
      parent: null,
      stopsVisited: startStops,
    });

    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current.x},${current.y}|${[...current.stopsVisited].sort().join(';')}`;

      if (visitedStates.has(key)) continue;
      visitedStates.add(key);

      if (current.x === end.x && current.y === end.y && 
          current.stopsVisited.size === totalStops) {
        return {
          path: reconstructPath(current),
          cost: current.g,
          nodesExplored: visitedStates.size,
          stopsVisited: current.stopsVisited.size,
        };
      }

      const neighbors = getNeighbors(grid[current.x][current.y], grid, allowDiagonals);

      for (const neighbor of neighbors) {
        if (neighbor.isObstacle) continue;

        const newStops = new Set(current.stopsVisited);
        const nKey = `${neighbor.x},${neighbor.y}`;
        if (stopSet.has(nKey)) newStops.add(nKey);

        queue.push({
          x: neighbor.x,
          y: neighbor.y,
          g: current.g + 1,
          parent: current,
          stopsVisited: newStops,
        });
      }
    }

    throw new Error('No se encontró ruta que pase por todos los puntos de parada');
  }
}