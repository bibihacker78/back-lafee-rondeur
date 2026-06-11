const express = require("express");
const router = express.Router();

const produitsRoutes = require("./produitsRoutes");
const categorieRoutes = require("./categorieRoutes");
const utilisateurRoutes = require("./utilisateurRoutes");
const panierRoutes = require("./panierRoutes");
const avisRoutes = require("./avisRoutes");
const adminRoutes = require("./admin.routes");

// ❌ PAS de /api ici
router.use("/produits", produitsRoutes);
router.use("/categorie", categorieRoutes);
router.use("/utilisateur", utilisateurRoutes);
router.use("/panier", panierRoutes);
router.use("/avis", avisRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
