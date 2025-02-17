'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Store.belongsTo(models.User)
      Store.hasMany(models.Product)
      Store.hasMany(models.Purchase)
    }
  }
  Store.init({
    storeName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: `Store Name is required`
        },
        notEmpty:{
          msg: `Store Name is required`
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: `Location is required`
        },
        notEmpty:{
          msg: `Location is required`
        }
      }
    },
    profileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: `Store Image is required`
        },
        notEmpty:{
          msg: `Store Image is required`
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull:{
          msg: `User ID is required`
        },
        notEmpty:{
          msg: `User ID is required`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};