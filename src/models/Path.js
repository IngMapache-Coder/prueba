import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Path = sequelize.define("Path", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  algorithm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  allowDiagonals: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pathLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nodesExplored: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  path: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

export default Path;