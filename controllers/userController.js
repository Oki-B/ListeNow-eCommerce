const { User, Product, Store, Customer } = require("../models");
const { comparePassword } = require("../helpers/bcyrpt");

const { Op } = require("sequelize");
const idrFormat = require("../helpers/idrFormat");
const store = require("../models/store");

class UserController {
  static async getLogin(req, res) {
    try {
      let { error, errors } = req.query;

      res.render("login", { error, errors, title: "Login" });
    } catch (error) {
      res.send(error);
    }
  }

  static async postLogin(req, res) {
    try {
      let { username, password } = req.body;
      let user = await User.findOne({ where: { username } });

      if (!user) {
        return res.redirect(`/login?errors=username`);
      }

      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.redirect(`/login?errors=password`);
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      res.redirect("/");
    } catch (error) {
      res.send(error);
    }
  }

  static async getRegister(req, res) {
    try {
      let { error, errors } = req.query;

      res.render("register", { error, errors, title: "Register" });
    } catch (error) {
      res.send(error);
    }
  }

  static async postRegister(req, res) {
    try {
      let { username, password, email, role } = req.body;
      await User.create({ username, password, email, role });
      const user = await User.findOne({ where: { username } });

      if (role === "store") {
        await Store.create({
          storeName: username,
          location: "-",
          profileUrl: `https://image.pollinations.ai/prompt/placeholderprofilefor${username}?width=640&height=400&nologo=true`,
          UserId: user.id,
        });
      } else {
        await Customer.create({
          name: username,
          profileUrl: `https://image.pollinations.ai/prompt/placeholderprofilefor${username}?width=640&height=400&nologo=true`,
          UserId: user.id,
        });
      }

      res.redirect("/login?success=Register success");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        let errors = error.errors.map((el) => el.message);

        res.redirect(`/register/?errors=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async getHome(req, res) {
    try {
      const role = req.session.role;
      const userId = req.session.userId;
      const { sort, search } = req.query;
      const hooks = [
        {
          model: Store,
          attributes: ["UserId", "id"],
        },
      ];

      const products = await Product.getProductByFilter(search, sort, hooks);

      res.render("home", {
        title: "Home",
        products,
        role,
        userId,
        idrFormat,
        sort,
        search,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      res.send(error);
    }
  }

  static async editProfile(req, res) {
    try {
      const role = req.session.role;
      const userId = req.session.userId;

      let user = null;
      if (role === "store") {
        user = await Store.findOne({ where: { UserId: userId } });
      } else {
        user = await Customer.findOne({ where: { UserId: userId } });
      }

      console.log(user);
      res.render("editProfile", { title: "Edit Profile", role, userId, user });
    } catch (error) {
      res.send(error);
    }
  }

  static async postEditProfile(req, res) {
    try {
      const role = req.session.role;
      const userId = req.session.userId;
      const { name, profileUrl, location } = req.body;

      if (role === "store"){
        await Store.update({ storeName: name, profileUrl, location }, { where: { UserId: userId } });
      } else {
        await Customer.update({ name, profileUrl }, { where: { UserId: userId } });
      }

      res.redirect("/");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController;
