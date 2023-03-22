const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticateUser = require("../middlewares/authentification.middleware");

// SignUp
router.post('/signup', userController.SignUp);

// SignIn
router.post('/signin', userController.SignIn);

// Getprofile
router.post('/profile', authenticateUser, userController.GetProfile);

module.exports = router;