let isNotLogin = function (req, res, next) {
  if (!req.session.userId) {
    const error = `Please login first to continue`;
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
};

let isLogin = function (req, res, next) {
  if (req.session.userId) {
    return res.redirect(`/`);
  } else {
    next();
  }
};

module.exports = { isLogin, isNotLogin };
