"use strict";
const { Model } = require("sequelize");

const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Store);
    }

    static async getProductByFilter(search, sort, hooks) {
      try {
        let options = {};
        if (search) {
          options.where = {
            productName: {
              [Op.iLike]: `%${search}%`,
            },
          };
        }
        if (sort === "high" || !sort) {
          options.order = [["productPrice", "DESC"]];
        } else if (sort === "low") {
          options.order = [["productPrice", "ASC"]];
        }

        options.include = hooks

        return await Product.findAll(options);
      } catch (error) {
        throw error;
      }
    }
  }
  Product.init(
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Product name is required`,
          },
          notEmpty: {
            msg: `Product name is required`,
          },
        },
      },
      productDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Product description is required`,
          },
          notEmpty: {
            msg: `Product description is required`,
          },
        },
      },
      productPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Product price is required`,
          },
          notEmpty: {
            msg: `Product price is required`,
          },
          min: {
            args: [9999],
            msg: `Product price min is Rp 10.000,00`,
          },
        },
      },
      productImage: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Product image is required`,
          },
          notEmpty: {
            msg: `Product image is required`,
          },
        },
      },
      StoreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `Store ID Image is required`,
          },
          notEmpty: {
            msg: `Store ID Image is required`,
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
