const express = require("express");
const utilisateurController = require("../controllers/utilisateurController");

const router = express.Router();

router.post("/login", utilisateurController.login);
router.post("/register", utilisateurController.register);
router.get("/:id", utilisateurController.getUserById);
router.put("/:id", utilisateurController.updateUser);

module.exports = router;
