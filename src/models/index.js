import sequelize from '../config/database.js';
import User from './User.js';
import Map from './Map.js';
import Obstacle from './Obstacle.js';
import StopPoint from './StopPoint.js';
import Route from './Route.js';
import Path from './Path.js';

User.hasMany(Map, { foreignKey: 'userId', onDelete: 'CASCADE' });
Map.belongsTo(User, { foreignKey: 'userId' });

Map.hasMany(Obstacle, { foreignKey: 'mapId', onDelete: 'CASCADE' });
Obstacle.belongsTo(Map, { foreignKey: 'mapId' });

Map.hasMany(StopPoint, { foreignKey: 'mapId', onDelete: 'CASCADE' });
StopPoint.belongsTo(Map, { foreignKey: 'mapId' });

Map.hasMany(Route, { foreignKey: 'mapId', onDelete: 'CASCADE' });
Route.belongsTo(Map, { foreignKey: 'mapId' });

Map.hasMany(Path, { foreignKey: "mapId" });
Path.belongsTo(Map, { foreignKey: "mapId" });

export { sequelize, User, Map, Obstacle, StopPoint, Route, Path };