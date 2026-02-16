import { BasePathAlgorithm } from './baseAlgorithm.js';
import { PriorityQueue, heuristic, getNeighbors, reconstructPath } from '../pathUtils.js';

export class AStarAlgorithm extends BasePathAlgorithm {
  findPath(grid, start, end, allowDiagonals = false, stopPoints = []) {
    if (!stopPoints || stopPoints.length === 0) {
      return this.findPathSimple(grid, start, end, allowDiagonals);
    }
    return this.findPathWithStops(grid, start, end, allowDiagonals, stopPoints);
  }

  findPathSimple(grid, start, end, allowDiagonals) {
    const openSet = new PriorityQueue();
    const visited = new Set();
    const gScore = new Map();
    const fScore = new Map();

    const startKey = `${start.x},${start.y}`;
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic.manhattan(start, end));

    openSet.enqueue(
      { x: start.x, y: start.y, parent: null },
      fScore.get(startKey)
    );

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue();
      const currentKey = `${current.x},${current.y}`;

      if (visited.has(currentKey)) continue;
      visited.add(currentKey);

      if (current.x === end.x && current.y === end.y) {
        return {
          path: reconstructPath(current),
          cost: gScore.get(currentKey),
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
        
        const tentativeG = gScore.get(currentKey) + cost;

        if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
          gScore.set(neighborKey, tentativeG);
          fScore.set(neighborKey, tentativeG + heuristic.manhattan(neighbor, end));
          
          openSet.enqueue(
            { x: neighbor.x, y: neighbor.y, parent: current },
            fScore.get(neighborKey)
          );
        }
      }
    }

    throw new Error('No se encontró ruta');
  }

  findPathWithStops(grid, start, end, allowDiagonals, stopPoints) {
    const stopSet = new Set(stopPoints.map(s => `${s.x},${s.y}`));
    const totalStops = stopSet.size;
    const openSet = new PriorityQueue();
    const visitedStates = new Map();

    const startStops = stopSet.has(`${start.x},${start.y}`) 
      ? new Set([`${start.x},${start.y}`]) 
      : new Set();

    const startState = {
      x: start.x, y: start.y,
      g: 0,
      h: heuristic.manhattan(start, end),
      f: 0,
      parent: null,
      stopsVisited: startStops
    };
    startState.f = startState.g + startState.h;

    openSet.enqueue(startState, startState.f);

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue();
      const key = this.makeStateKey(current.x, current.y, current.stopsVisited);

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

        const missed = totalStops - newStops.size;
        const h = heuristic.manhattan(neighbor, end) + missed * 10;

        openSet.enqueue({
          x: neighbor.x, y: neighbor.y,
          g: newG, h,
          f: newG + h,
          parent: current,
          stopsVisited: newStops
        }, newG + h);
      }
    }

    throw new Error('No se encontró ruta que pase por todos los puntos de parada');
  }

  makeStateKey(x, y, stops) {
    return `${x},${y}|${[...stops].sort().join(';')}`;
  }
}