const router = require("express").Router();
const { Signup, login, logout, updatePassword, profilePage } = require("../controller/user.controllers");
const { verifyToken } = require("../middlewares/auth.mw");
// Signup
router.post('/signup', Signup);
// Login
router.post("/login", login)
// Logout
router.get("/logout", logout)
// Update Password
router.put("/updatepassword", verifyToken, updatePassword)
// Profile Page through ID
router.get("/profile/:id", profilePage)


module.exports = router;
