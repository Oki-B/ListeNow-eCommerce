'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcyrpt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Store)
      User.hasOne(models.Customer)
      User.hasMany(models.Purchase)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: `Username already exists`
      },
      validate: {
        notNull:{
          msg: `Username is required`
        },
        notEmpty:{
          msg: `Username is required`
        }
      }
    },
    password:{ 
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull: {
          msg: "Password is required"
        },
        notEmpty: {
          msg: "Password is required"
        },
        len: {
          args: [5],
          msg : "Password must have at least 5 characters"
        }
      }
    },
    email:{ 
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email already exists"
      },
      validate : {
        notNull: {
          msg: "Email is required"
        },
        notEmpty: {
          msg: "Email is required"
        },
        isEmail: {
          args: true,
          msg: "Invalid email format"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: `Role is required`
        },
        notEmpty:{
          msg: `Role is required`
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = hashPassword(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};