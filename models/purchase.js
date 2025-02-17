'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Purchase.belongsTo(models.Store)
      Purchase.belongsTo(models.Customer)
    }
  }
  Purchase.init({
    productName: DataTypes.STRING,
    productImage: DataTypes.STRING,
    productPrice: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    totalPurchase: DataTypes.INTEGER,
    StoreId: DataTypes.INTEGER,
    CustomerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Purchase',
  });
  return Purchase;
};