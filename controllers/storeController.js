const { or } = require("sequelize");
const idrFormat = require("../helpers/idrFormat");
const { User, Store, Product } = require("../models/");
const e = require("express");

class storeController {
  static async getStore(req, res) {
    try {
      const userId = req.session.userId;
      const role = req.session.role;

      const store = await Store.findOne({
        where: { UserId: userId },
        include: [
          {
            model: Product,
          },
        ],
        order: [[Product, "updatedAt", "DESC"]],
      });
      res.render("store", { title: "Store", userId, role, store, idrFormat });
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddProduct(req, res) {
    try {
      let {errors} = req.query;

      const userId = req.session.userId;
      const role = req.session.role;
      res.render("addProduct", { title: "Add Product", userId, role, errors });
    } catch (error) {
      res.send(error);
    }
  }

  static async postAddProduct(req, res) {
    try {
      const userId = req.session.userId;
      const { productName, productDescription, productPrice, productImage } = req.body;
      const store = await Store.findOne({
        where: { UserId: userId },
      });

      await Product.create({
        productName,
        productDescription,
        productPrice: Number(productPrice), 
        productImage,
        StoreId: store.id,
      });

      res.redirect(`/store/${userId}`);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let errors = error.errors.map((el) => el.message);

        res.redirect(`/store/add-product/?errors=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async getEditProduct(req, res) {
    try {
      const {errors} = req.query;
      const userId = req.session.userId;
      const role = req.session.role;
      const { id } = req.params;

      const product = await Product.findOne({ where: { id }}); 
      res.render("editProduct", { title: "Edit Product", userId, role, product, errors });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = storeController;
