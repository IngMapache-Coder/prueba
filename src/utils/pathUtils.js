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

  size() {
    return this.elements.length;
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

export const calculatePathCost = (path, allowDiagonals = false) => {
  let cost = 0;
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const isDiagonal = Math.abs(curr.x - prev.x) === 1 && 
                      Math.abs(curr.y - prev.y) === 1;
    cost += isDiagonal ? 1.414 : 1;
  }
  return cost;
};

export const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);