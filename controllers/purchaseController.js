const idrFormat = require("../helpers/idrFormat");
const { Store, Purchase, Product, Customer, User } = require("../models");

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
              include: [{
                model: User,
                include: [Customer]
              }],
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

      const product = await Product.findByPk(ProductId, {include: [Store]});
      // console.log(product);
      // console.log(customer);
      await Purchase.create({
        productName: product.productName,
        productImage: product.productImage,
        productPrice: product.productPrice,
        productQuantity: Number(quantity),
        totalPurchase: product.productPrice * Number(quantity),
        StoreId: product.StoreId,
        UserId: Number(userId)
      });

      res.redirect(`/${userId}/purchase`);
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = purchaseController;
