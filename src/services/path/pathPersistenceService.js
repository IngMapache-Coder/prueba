import { ResourceNotFoundError } from '../../utils/errors/domainErrors.js';

export class PathPersistenceService {
  constructor(pathModel) {
    this.pathModel = pathModel;
  }

  async save(result, mapId, algorithm, allowDiagonals) {
    return await this.pathModel.create({
      mapId,
      algorithm: algorithm.toUpperCase(),
      allowDiagonals,
      cost: result.cost,
      pathLength: result.path.length,
      nodesExplored: result.nodesExplored,
      path: result.path,
    });
  }

  async getById(id) {
    const path = await this.pathModel.findByPk(id);
    if (!path) {
      throw new ResourceNotFoundError('Path', id);
    }
    return path;
  }

  async getByMapId(mapId) {
    return await this.pathModel.findAll({
      where: { mapId },
      order: [['createdAt', 'DESC']]
    });
  }
}