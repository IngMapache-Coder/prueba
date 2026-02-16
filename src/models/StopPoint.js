import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StopPoint = sequelize.define('StopPoint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
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

export default StopPoint;