const idrFormat = require("../helpers/idrFormat");
const { default: sendEmail } = require("../helpers/nodemailer");
const { Store, Purchase, Product, Customer, User } = require("../models");
// const store = require("../models/store");

class purchaseController {
  static async getPurchase(req, res) {
    try {
      const userId = req.session.userId;
      const role = req.session.role;

      let store = null;
      let customer = null;

      if (role === "store") {
        store = await Store.findOne({
          where: { UserId: userId },
          include: [
            {
              model: Purchase,
              include: [
                {
                  model: User,
                  include: [Customer],
                },
              ],
            },
          ],
        });
      } else {
        customer = await Customer.findOne({
          where: { UserId: userId },
        });
      }

      // console.log(store);
      const purchase = await Purchase.findAll({
        where: { UserId: userId },
        include: [Store],
      });

      console.log(purchase);

      res.render("purchase", {
        title: "Purchase Lists",
        store,
        purchase,
        customer,
        role,
        userId,
        idrFormat,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async buyProduct(req, res) {
    try {
      const { ProductId } = req.params;
      const userId = req.session.userId;
      const { quantity } = req.body;
      const role = req.session.role;

      const product = await Product.findByPk(ProductId, { include: [Store] });
      // console.log(product);
      // console.log(customer);
      await Purchase.create({
        productName: product.productName,
        productImage: product.productImage,
        productPrice: product.productPrice,
        productQuantity: Number(quantity),
        totalPurchase: product.productPrice * Number(quantity),
        StoreId: product.StoreId,
        UserId: Number(userId),
      });

      let context = {};
      if (role === "store") {
        const user = await User.findByPk(userId, {
          include: [Store],
        });

        context = {
          userName: user.Store.storeName,
          productName: product.productName,
          productImage: product.productImage,
          productPrice: idrFormat(product.productPrice),
          productQuantity: Number(quantity),
          totalPurchase: idrFormat(product.productPrice * Number(quantity)),
          userEmail: user.email,
          storeName: product.Store.storeName,
          storeLocation: product.Store.location,
          storeImage: product.Store.profileUrl,
        };
      } else {
        const user = await User.findByPk(userId, {
          include: [Customer],
        });

        context = {
          userName: user.Customer.name,
          productName: product.productName,
          productImage: product.productImage,
          productPrice: idrFormat(product.productPrice),
          productQuantity: String(quantity),
          totalPurchase: idrFormat(product.productPrice * Number(quantity)),
          userEmail: user.email,
          storeName: product.Store.storeName,
          storeLocation: product.Store.location,
          storeImage: product.Store.profileUrl,
        };
      }

      console.log(context);

      await sendEmail(
        context.userEmail,
        `Purchase Confirmation - ${context.productName}`,
        context,
        "invoiceEmail"
      );
      res.redirect(`/${userId}/purchase`);
    } catch (error) {
      res.send(error);
    }
  }

  // static async printProduct(req, res) {
  //   try {
  //     const { ProductId } = req.params;
  //     const userId = req.session.userId;
  //     const role = req.session.role;
  //     const { quantity } = req.body;

  //     const product = await Product.findByPk(ProductId, { include: [Store] });
  //     // console.log(product);
  //     // console.log(customer);

  //     let user = null;
  //     if (role === "store") {
  //       user = await User.findByPk(userId, {
  //         include: [Store],
  //       });
  //     } else {
  //       user = await User.findByPk(userId, {
  //         include: [Customer],
  //       });
  //     }

  //     res.render(`print`, { user, product, role, userId });

  //   } catch (error) {
  //     res.send(error);
  //   }
  // }
}

module.exports = purchaseController;
