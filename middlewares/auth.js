const { check, validationResult } = require("express-validator");

const isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('errors', 'Session Expired')
    return res.redirect("/users/login");
  }

  next();
};

const isAdmin = async (req, res, next) => {
  if (req.isAuthenticated() && req?.user?.role === "admin") {
    return res.redirect("/users/admin/dashboard");
  }

  next();
};

const isUser = async (req, res, next) => {
  if (req.isAuthenticated() && req?.user?.role === "writer") {
    return res.redirect("/users/user/dashboard");
  }

  next();
};

const validate = [
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Enter User Name")
    .toLowerCase(),
  check("name").notEmpty().withMessage("Enter name").trim(),
  check("email").notEmpty().withMessage("Enter Email").trim(),
  check("password")
    .notEmpty()
    .withMessage("Enter Password")
    .isLength({ min: 5 })
    .withMessage("Paswword must be up to Five"),

  check("password2").custom(async (password2, { req }) => {
    const password = req.body.password;
    if (password !== password2) {
      throw new Error("Password does not not match");
    }

    return true;
  }),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .render("users/admin/register-user", { err: errors.array() });
    }

    next();
  },
];

module.exports = {
  isLoggedIn,
  validate,
  isUser,
  isAdmin,
};
