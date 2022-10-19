const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  viewLogin,
  createPost,
  editPost,
  deletePost,
  changeData,
  changePassword,
  logoutUser,

  viewAdmin,
  viewRegisterUser,
  registerUser,
  viewEditUser,
  editUser,
  deleteUser,
  viewCreateAdminPost,
  viewAdminEditPost,
  viewAdminSetting,

  viewWriter,
  viewCreateWriterPost,
  viewWriterEditPost,
  viewWriterSetting,
} = require("../controllers/user");

// Middleware
const { isLoggedIn, validate, isUser, isAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

// View Login
router.get("/login", isUser, viewLogin);

// Login Handle
router.post(
  "/login",
  isUser,
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/users/login",
  }),
  function (req, res) {
    if (req.user.role !== "admin") {
      return res.status(301).redirect("/users/user/dashboard");
    }

    return res.status(301).redirect("/users/admin/dashboard");
  }
);

router.get("/logout", logoutUser);

router.post("/create-post", isLoggedIn, upload.single("image"), createPost);
router.post("/update-post", isLoggedIn, upload.single("image"), editPost);
router.post("/delete", isLoggedIn, deletePost);
router.post("/change-data", isLoggedIn, changeData);
router.post("/change-password", isLoggedIn, changePassword);

/*
----------
ADMIN
----------
*/

router.get("/admin/dashboard", isLoggedIn, isUser, viewAdmin);
router.get("/admin/register-user", isLoggedIn, isUser, viewRegisterUser);
router.get("/admin/edit-user/:id", isLoggedIn, isUser, viewEditUser);
router.get("/admin/create", isLoggedIn, isUser, viewCreateAdminPost);
router.get("/admin/edit/:id", isUser, viewAdminEditPost);
router.get("/admin/setting", isLoggedIn, isUser, viewAdminSetting);

router.post("/admin/register-user", isLoggedIn, isUser, validate, registerUser);
router.post("/admin/edit-user", isLoggedIn, isUser, editUser);
router.post("/admin/delete", isLoggedIn, isUser, deleteUser);

/*
    ----------
    WRITER
    ----------
*/

router.get("/user/dashboard", isLoggedIn, isAdmin, viewWriter);
router.get("/user/create", isLoggedIn, isAdmin, viewCreateWriterPost);
router.get("/user/edit/:id", isLoggedIn, isAdmin, viewWriterEditPost);
router.get("/user/setting", isLoggedIn, isAdmin, viewWriterSetting);

module.exports = router;
