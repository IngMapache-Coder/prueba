export class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isObstacle = false;
    this.isStopPoint = false;
    this.isStart = false;
    this.isEnd = false;
  }
}

export class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(state, priority) {
    this.elements.push({ state, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.elements.shift().state;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

export const heuristic = {
  manhattan: (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
  euclidean: (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)),
  chebyshev: (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)),
};

export const getNeighbors = (node, grid, allowDiagonals = false) => {
  const neighbors = [];
  const { x, y } = node;
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  if (allowDiagonals) {
    directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  }

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
      neighbors.push(grid[nx][ny]);
    }
  }

  return neighbors;
};

export const reconstructPath = (state) => {
  const path = [];
  let current = state;
  while (current) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }
  return path;
};

export const createGridFromMapData = (map, obstacles, stopPoints, route) => {
  const rows = map.height;
  const cols = map.width;

  const grid = [];
  for (let x = 0; x < rows; x++) {
    grid[x] = [];
    for (let y = 0; y < cols; y++) {
      grid[x][y] = new Node(x, y);
    }
  }

  obstacles.forEach((ob) => {
    if (ob.posX < rows && ob.posY < cols) {
      grid[ob.posX][ob.posY].isObstacle = true;
    }
  });

  stopPoints.forEach((sp) => {
    if (sp.posX < rows && sp.posY < cols) {
      grid[sp.posX][sp.posY].isStopPoint = true;
    }
  });

  if (route.startX < rows && route.startY < cols) {
    grid[route.startX][route.startY].isStart = true;
  }

  if (route.endX < rows && route.endY < cols) {
    grid[route.endX][route.endY].isEnd = true;
  }

  return grid;
};

const makeStateKey = (x, y, stops) =>
  `${x},${y}|${[...stops].sort().join(";")}`;

export const findPathAStar = (
  grid,
  start,
  end,
  allowDiagonals = false,
  allStopPoints = [],
) => {
  if (!allStopPoints || allStopPoints.length === 0) {
    return findPathAStarSimple(grid, start, end, allowDiagonals);
  }

  const stopSet = new Set(allStopPoints.map((s) => `${s.x},${s.y}`));
  const totalStops = stopSet.size;

  const openSet = new PriorityQueue();
  const visitedStates = new Map();

  const startStops = new Set();
  if (stopSet.has(`${start.x},${start.y}`)) {
    startStops.add(`${start.x},${start.y}`);
  }

  const startState = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic.manhattan(start, end),
    f: 0,
    parent: null,
    stopsVisited: startStops,
  };
  startState.f = startState.g + startState.h;

  openSet.enqueue(startState, startState.f);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    const key = makeStateKey(current.x, current.y, current.stopsVisited);

    if (visitedStates.has(key) && visitedStates.get(key) <= current.g) {
      continue;
    }
    visitedStates.set(key, current.g);

    if (
      current.x === end.x &&
      current.y === end.y &&
      current.stopsVisited.size === totalStops
    ) {
      return {
        path: reconstructPath(current),
        cost: current.g,
        nodesExplored: visitedStates.size,
        stopsVisited: current.stopsVisited.size,
      };
    }

    const neighbors = getNeighbors(
      grid[current.x][current.y],
      grid,
      allowDiagonals,
    );

    for (const neighbor of neighbors) {
      if (neighbor.isObstacle) continue;

      const isDiagonal =
        Math.abs(neighbor.x - current.x) === 1 &&
        Math.abs(neighbor.y - current.y) === 1;
      const cost = isDiagonal ? 1.414 : 1;
      const newG = current.g + cost;

      const newStops = new Set(current.stopsVisited);
      const nKey = `${neighbor.x},${neighbor.y}`;
      if (stopSet.has(nKey)) newStops.add(nKey);

      const missed = totalStops - newStops.size;
      const h = heuristic.manhattan(neighbor, end) + missed * 10;

      const state = {
        x: neighbor.x,
        y: neighbor.y,
        g: newG,
        h,
        f: newG + h,
        parent: current,
        stopsVisited: newStops,
      };

      openSet.enqueue(state, state.f);
    }
  }

  throw new Error(
    "No se encontró ruta que pase por todos los puntos de parada",
  );
};

export const findPathAStarSimple = (
  grid,
  start,
  end,
  allowDiagonals = false,
  heuristicType = "manhattan",
) => {
  const openSet = new PriorityQueue();
  const visited = new Set();

  const startState = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic[heuristicType](start, end),
    f: 0,
    parent: null,
  };
  startState.f = startState.g + startState.h;

  openSet.enqueue(startState, startState.f);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
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

    const neighbors = getNeighbors(
      grid[current.x][current.y],
      grid,
      allowDiagonals,
    );

    for (const neighbor of neighbors) {
      if (neighbor.isObstacle) continue;

      const isDiagonal =
        Math.abs(neighbor.x - current.x) === 1 &&
        Math.abs(neighbor.y - current.y) === 1;
      const cost = isDiagonal ? 1.414 : 1;

      const g = current.g + cost;
      const h = heuristic[heuristicType](neighbor, end);

      openSet.enqueue(
        {
          x: neighbor.x,
          y: neighbor.y,
          g,
          h,
          f: g + h,
          parent: current,
        },
        g + h,
      );
    }
  }

  throw new Error("No se encontró ruta");
};

export const findPathDijkstra = (
  grid,
  start,
  end,
  allowDiagonals = false,
  allStopPoints = [],
) => {
  if (!allStopPoints || allStopPoints.length === 0) {
    return findPathDijkstraSimple(grid, start, end, allowDiagonals);
  }

  const stopSet = new Set(allStopPoints.map((s) => `${s.x},${s.y}`));
  const totalStops = stopSet.size;

  const queue = new PriorityQueue();
  const visitedStates = new Map();

  const startStops = new Set();
  if (stopSet.has(`${start.x},${start.y}`)) {
    startStops.add(`${start.x},${start.y}`);
  }

  const startState = {
    x: start.x,
    y: start.y,
    g: 0,
    parent: null,
    stopsVisited: startStops,
  };

  queue.enqueue(startState, 0);

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    const key = `${current.x},${current.y}|${[...current.stopsVisited].sort().join(";")}`;

    if (visitedStates.has(key) && visitedStates.get(key) <= current.g) {
      continue;
    }
    visitedStates.set(key, current.g);

    if (
      current.x === end.x &&
      current.y === end.y &&
      current.stopsVisited.size === totalStops
    ) {
      return {
        path: reconstructPath(current),
        cost: current.g,
        nodesExplored: visitedStates.size,
        stopsVisited: current.stopsVisited.size,
      };
    }

    const neighbors = getNeighbors(
      grid[current.x][current.y],
      grid,
      allowDiagonals,
    );

    for (const neighbor of neighbors) {
      if (neighbor.isObstacle) continue;

      const isDiagonal =
        Math.abs(neighbor.x - current.x) === 1 &&
        Math.abs(neighbor.y - current.y) === 1;

      const cost = isDiagonal ? 1.414 : 1;
      const newG = current.g + cost;

      const newStops = new Set(current.stopsVisited);
      const nKey = `${neighbor.x},${neighbor.y}`;
      if (stopSet.has(nKey)) newStops.add(nKey);

      queue.enqueue(
        {
          x: neighbor.x,
          y: neighbor.y,
          g: newG,
          parent: current,
          stopsVisited: newStops,
        },
        newG,
      );
    }
  }

  throw new Error(
    "No se encontró ruta que pase por todos los puntos de parada",
  );
};

export const findPathDijkstraSimple = (
  grid,
  start,
  end,
  allowDiagonals = false,
) => {
  const queue = new PriorityQueue();
  const visited = new Set();

  queue.enqueue(
    {
      x: start.x,
      y: start.y,
      g: 0,
      parent: null,
    },
    0,
  );

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
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

    const neighbors = getNeighbors(
      grid[current.x][current.y],
      grid,
      allowDiagonals,
    );

    for (const neighbor of neighbors) {
      if (neighbor.isObstacle) continue;

      const isDiagonal =
        Math.abs(neighbor.x - current.x) === 1 &&
        Math.abs(neighbor.y - current.y) === 1;

      const cost = isDiagonal ? 1.414 : 1;

      queue.enqueue(
        {
          x: neighbor.x,
          y: neighbor.y,
          g: current.g + cost,
          parent: current,
        },
        current.g + cost,
      );
    }
  }

  throw new Error("No se encontró ruta");
};

export const findPathBFS = (
  grid,
  start,
  end,
  allowDiagonals = false,
  allStopPoints = [],
) => {
  if (!allStopPoints || allStopPoints.length === 0) {
    return findPathBFSSimple(grid, start, end, allowDiagonals);
  }

  const stopSet = new Set(allStopPoints.map((s) => `${s.x},${s.y}`));
  const totalStops = stopSet.size;

  const queue = [];
  const visitedStates = new Set();

  const startStops = new Set();
  if (stopSet.has(`${start.x},${start.y}`)) {
    startStops.add(`${start.x},${start.y}`);
  }

  queue.push({
    x: start.x,
    y: start.y,
    g: 0,
    parent: null,
    stopsVisited: startStops,
  });

  while (queue.length > 0) {
    const current = queue.shift();
    const key = `${current.x},${current.y}|${[...current.stopsVisited].sort().join(";")}`;

    if (visitedStates.has(key)) continue;
    visitedStates.add(key);

    if (
      current.x === end.x &&
      current.y === end.y &&
      current.stopsVisited.size === totalStops
    ) {
      return {
        path: reconstructPath(current),
        cost: current.g,
        nodesExplored: visitedStates.size,
        stopsVisited: current.stopsVisited.size,
      };
    }

    const neighbors = getNeighbors(
      grid[current.x][current.y],
      grid,
      allowDiagonals,
    );

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

  throw new Error(
    "No se encontró ruta que pase por todos los puntos de parada",
  );
};

export const findPathBFSSimple = (grid, start, end, allowDiagonals = false) => {
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

    const neighbors = getNeighbors(
      grid[current.x][current.y],
      grid,
      allowDiagonals,
    );

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

  throw new Error("No se encontró ruta");
};
