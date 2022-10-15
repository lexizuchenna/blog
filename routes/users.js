const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  viewLogin,

  viewAdmin,
  viewRegisterUser,
  viewCreateAdminPost,
  viewAdminSetting,

  viewWriter,
  viewCreateWriterPost,
  viewWriterSetting,
  logoutUser,
  registerUser,
} = require("../controllers/user");

// Middleware
const { isLoggedIn, validate } = require("../middlewares/auth");

router.get("/login", viewLogin);

// Login Handle
router.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/users/login",
  }),
  function (req, res) {
    console.log(req.user);
    if (req.user.role === "admin") {
      return res.redirect("/users/admin/dashboard");
    }

    if (req.user.role === "writer") {
      return res.redirect("/users/user/dashboard");
    }
  }
);

router.get("/logout", logoutUser);

/*
    ----------
    ADMIN
    ----------
*/

router.get("/admin/dashboard", isLoggedIn, viewAdmin);
router.get("/admin/register-user", isLoggedIn, viewRegisterUser);
router.get("/admin/create", isLoggedIn, viewCreateAdminPost);
router.get("/admin/setting", isLoggedIn, viewAdminSetting);

router.post("/admin/register-user", isLoggedIn, validate, registerUser);
router.post("/admin/create", isLoggedIn);

/*
    ----------
    WRITER
    ----------
*/

router.get("/user/dashboard", isLoggedIn, viewWriter);
router.get("/user/create", isLoggedIn, viewCreateWriterPost);
router.get("/user/setting", isLoggedIn, viewWriterSetting);

router.post("/user/create", isLoggedIn);

module.exports = router;
