export class BasePathAlgorithm {
  findPath(grid, start, end, allowDiagonals = false, stopPoints = []) {
    throw new Error('Method not implemented');
  }

  getName() {
    return this.constructor.name;
  }

  getHeuristic() {
    return 'manhattan';
  }
}