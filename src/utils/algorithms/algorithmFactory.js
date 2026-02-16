import { UnsupportedAlgorithmError } from '../errors/domainErrors.js';

export class AlgorithmFactory {
  constructor() {
    this.algorithms = new Map();
  }

  registerAlgorithm(name, algorithmClass) {
    this.algorithms.set(name.toUpperCase(), algorithmClass);
  }

  getAlgorithm(name) {
    const AlgorithmClass = this.algorithms.get(name.toUpperCase());
    if (!AlgorithmClass) {
      throw new UnsupportedAlgorithmError(name);
    }
    return new AlgorithmClass();
  }

  getAvailableAlgorithms() {
    return Array.from(this.algorithms.keys());
  }
}