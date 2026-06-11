const Avis = require("../models/avis");

exports.createAvis = async (req, res) => {
  try {
    const { utilisateur_id, produit_id, note, commentaire, nom, email } = req.body;
    if (!produit_id || !note) {
      return res.status(400).json({ message: "Produit et note requis" });
    }
    console.log("Reçu dans req.body :", req.body);
    const avisId = await Avis.create({ utilisateur_id, produit_id, note, commentaire, nom, email });
    res.status(201).json({ message: "Avis ajouté", avisId });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAvisByProduit = async (req, res) => {
  try {
    const {produitId } = req.params;
    const avis = await Avis.getByProduit(produitId);
    res.status(200).json(avis);
    console.log("Données reçues pour avis :", req.body);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteAvis = (req, res) => {
  res.status(501).json({ message: "Suppression non implémentée" });
};