const { User } = require("../models");
const { comparePassword } = require("../helpers/bcyrpt");

const { Op } = require("sequelize");

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
      res.render("home", { title: "Home" });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController;
