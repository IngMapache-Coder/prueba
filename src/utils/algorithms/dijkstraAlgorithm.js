import { BasePathAlgorithm } from './baseAlgorithm.js';
import { PriorityQueue, getNeighbors, reconstructPath } from '../pathUtils.js';

export class DijkstraAlgorithm extends BasePathAlgorithm {

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
    const queue = new PriorityQueue();
    const visited = new Set();
    const distances = new Map();

    const startKey = `${start.x},${start.y}`;
    distances.set(startKey, 0);

    queue.enqueue(
      { x: start.x, y: start.y, parent: null, g: 0 },
      0
    );

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      const currentKey = `${current.x},${current.y}`;

      if (visited.has(currentKey)) continue;
      visited.add(currentKey);

      if (current.x === end.x && current.y === end.y) {
        return {
          path: reconstructPath(current),
          cost: distances.get(currentKey),
          nodesExplored: visited.size
        };
      }

      const neighbors = getNeighbors(grid[current.x][current.y], grid, allowDiagonals);

      for (const neighbor of neighbors) {
        if (neighbor.isObstacle) continue;

        const neighborKey = `${neighbor.x},${neighbor.y}`;
        if (visited.has(neighborKey)) continue;

        const isDiagonal = Math.abs(neighbor.x - current.x) === 1 && 
                          Math.abs(neighbor.y - current.y) === 1;
        const cost = isDiagonal ? 1.414 : 1;
        
        const newDist = distances.get(currentKey) + cost;

        if (!distances.has(neighborKey) || newDist < distances.get(neighborKey)) {
          distances.set(neighborKey, newDist);
          queue.enqueue(
            { x: neighbor.x, y: neighbor.y, parent: current, g: newDist },
            newDist
          );
        }
      }
    }

    throw new Error('No se encontró ruta');
  }

  findPathWithStops(grid, start, end, allowDiagonals, stopPoints) {
    const stopSet = new Set(stopPoints.map(s => `${s.x},${s.y}`));
    const totalStops = stopSet.size;
    const queue = new PriorityQueue();
    const visitedStates = new Map();

    const startStops = stopSet.has(`${start.x},${start.y}`) 
      ? new Set([`${start.x},${start.y}`]) 
      : new Set();

    queue.enqueue(
      {
        x: start.x, y: start.y,
        g: 0,
        parent: null,
        stopsVisited: startStops
      },
      0
    );

    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      const key = `${current.x},${current.y}|${[...current.stopsVisited].sort().join(';')}`;

      if (visitedStates.has(key) && visitedStates.get(key) <= current.g) continue;
      visitedStates.set(key, current.g);

      if (current.x === end.x && current.y === end.y && 
          current.stopsVisited.size === totalStops) {
        return {
          path: reconstructPath(current),
          cost: current.g,
          nodesExplored: visitedStates.size,
          stopsVisited: current.stopsVisited.size
        };
      }

      const neighbors = getNeighbors(grid[current.x][current.y], grid, allowDiagonals);

      for (const neighbor of neighbors) {
        if (neighbor.isObstacle) continue;

        const isDiagonal = Math.abs(neighbor.x - current.x) === 1 && 
                          Math.abs(neighbor.y - current.y) === 1;
        const cost = isDiagonal ? 1.414 : 1;
        const newG = current.g + cost;

        const newStops = new Set(current.stopsVisited);
        const nKey = `${neighbor.x},${neighbor.y}`;
        if (stopSet.has(nKey)) newStops.add(nKey);

        queue.enqueue(
          {
            x: neighbor.x, y: neighbor.y,
            g: newG,
            parent: current,
            stopsVisited: newStops
          },
          newG
        );
      }
    }

    throw new Error('No se encontró ruta que pase por todos los puntos de parada');
  }
}