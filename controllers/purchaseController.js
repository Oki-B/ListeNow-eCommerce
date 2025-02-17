const idrFormat = require("../helpers/idrFormat");
const { Store, Purchase, Product, Customer } = require("../models");

class purchaseController {
  static async getPurchase(req, res) {
    try {
      const userId = req.session.userId;
      const role = req.session.role;

      let store = null;

      if (role === "store") {
        store = await Store.findOne({
          where: { UserId: userId },
          include: [
            {
              model: Purchase,
              include: [Customer],
            },
          ],
        });
      }

      const purchase = await Customer.findOne({
        where: { UserId: userId },
        include: [
          {
            model: Purchase,
            include: [Store],
          },
        ],
      });

      console.log(purchase);

      res.render("purchase", {
        title: "Purchase Lists",
        store,
        purchase,
        role,
        userId,
        idrFormat,
      });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = purchaseController;
