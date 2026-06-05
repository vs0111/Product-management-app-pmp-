const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../validations/authValidation");
const validate = require("../middleware/validationMiddleware");

// User Routes
router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);

module.exports = router;
