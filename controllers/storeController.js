const { Sequelize, fn, col } = require("sequelize");
const idrFormat = require("../helpers/idrFormat");
const { User, Store, Product, Purchase } = require("../models/");


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
          }
        ],
        order: [[Product, "updatedAt", "DESC"]],
      });

      const totalSales = await Purchase.findOne({
        attributes: [[fn("SUM", col("totalPurchase")), "totalSales"]],
        where: { StoreId: store.id },
      });
      
      store.dataValues.totalSales = Number(totalSales?.dataValues?.totalSales) || 0; // ✅ Add calculated totalSales
      
      res.render("store", { title: "Store", userId, role, store, idrFormat });
    } catch (error) {
      res.send(error);
    }
  }

  static async getAddProduct(req, res) {
    try {
      let { errors } = req.query;

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
      const { productName, productDescription, productPrice, productImage } =
        req.body;
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

      res.redirect(`/${userId}/store`);
    } catch (error) {
      const userId = req.session.userId;
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let errors = error.errors.map((el) => el.message);

        res.redirect(`/${userId}/store/add-product/?errors=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async getEditProduct(req, res) {
    try {
      const { errors } = req.query;
      const userId = req.session.userId;
      const role = req.session.role;
      const { id } = req.params;

      const product = await Product.findOne({ where: { id } });
      res.render("editProduct", {
        title: "Edit Product",
        userId,
        role,
        product,
        errors,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async postEditProduct(req, res) {
    try {
      const userId = req.session.userId;
      const { productName, productDescription, productPrice, productImage } =
        req.body;
      const { id } = req.params;

      await Product.update(
        {
          productName,
          productDescription,
          productPrice: Number(productPrice),
          productImage,
        },
        { where: { id } }
      );

      res.redirect(`/${userId}/store`);
    } catch (error) {
      const userId = req.session.userId;
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let errors = error.errors.map((el) => el.message);
        const { id } = req.params;
        res.redirect(`/${userId}/store/edit-product/${id}?errors=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async deleteProduct(req, res) {
    try {
      const userId = req.session.userId;
      const { id } = req.params;

      await Product.destroy({ where: { id } });

      res.redirect(`/${userId}/store`);
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = storeController;
