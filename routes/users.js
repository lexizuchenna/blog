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
  adminPost,
} = require("../controllers/user");

// Middleware
const { isLoggedIn, validate } = require("../middlewares/auth");
const upload = require("../middlewares/multer");


router.get("/login", viewLogin);

// Login Handle
router.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/users/login",
  }),
  function (req, res) {
    if (req.user.role !== "admin") {
      console.log(req.user);
      console.log(req.isAuthenticated());
      return res.status(301).redirect("/users/user/dashboard");
    }

    return res.status(301).redirect("/users/admin/dashboard");
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
router.post("/admin/create", isLoggedIn, upload.single("image"), adminPost);

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
