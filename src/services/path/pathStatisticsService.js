export class PathStatisticsService {
  calculate(result, resources, grid) {
    const map = resources.map;
    const stopPointsCoords = resources.stopPoints.map(sp => ({
      x: sp.posX,
      y: sp.posY
    }));

    return {
      efficiency: (result.path.length / result.nodesExplored).toFixed(4),
      explorationRate: (
        (result.nodesExplored / (map.width * map.height)) * 100
      ).toFixed(2) + '%',
      stopsCoverage: stopPointsCoords.length > 0
        ? `${((result.stopsVisited || 0) / stopPointsCoords.length * 100).toFixed(1)}%`
        : 'N/A',
    };
  }

  compare(paths) {
    if (!paths || paths.length === 0) {
      return { message: 'No hay rutas para comparar' };
    }

    const bestByCost = paths.reduce((best, current) => 
      current.cost < best.cost ? current : best
    );

    const bestByNodes = paths.reduce((best, current) => 
      current.nodesExplored < best.nodesExplored ? current : best
    );

    return {
      totalPaths: paths.length,
      bestByCost: {
        id: bestByCost.id,
        algorithm: bestByCost.algorithm,
        cost: bestByCost.cost
      },
      bestByNodes: {
        id: bestByNodes.id,
        algorithm: bestByNodes.algorithm,
        nodesExplored: bestByNodes.nodesExplored
      },
      averageCost: paths.reduce((sum, p) => sum + p.cost, 0) / paths.length,
      averageNodes: paths.reduce((sum, p) => sum + p.nodesExplored, 0) / paths.length
    };
  }
}