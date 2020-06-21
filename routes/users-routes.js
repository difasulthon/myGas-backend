const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  [
    check("fulName").not().isEmpty(),
    check("role").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("photo").not().isEmpty(),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

router.post(
  "/updateProfile/:userId",
  [
    check("fulName").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("photo").not().isEmpty(),
  ],
  usersController.updateProfile
);

module.exports = router;
