import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Obstacle = sequelize.define('Obstacle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  posX: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  posY: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  mapId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Maps',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default Obstacle;