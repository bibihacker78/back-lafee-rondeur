const User = require("../models/Utilisateur");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Créer un objet utilisateur sans le mot de passe pour la réponse
    const userResponse = {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role
      // ajoutez d'autres champs si nécessaire
    };

    res.json({
      message: "Connexion réussie",
      token,
      user: userResponse
    });
   
    console.log("📥 BODY REÇU :", req.body);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const {
  nom,
  email,
  mot_de_passe,
  role = "client", // 👈 AJOUT
  telephone,
  prefixe,
  adresse,
  commune,
  ville,
  code_postal,
  pays,
  info_supplementaire
} = req.body;


    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const userId = await User.create({
      nom, email,role, mot_de_passe, telephone, prefixe, adresse, commune, ville, code_postal, pays, info_supplementaire
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", userId });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // On retire le mot de passe de la réponse
    const { mot_de_passe, ...userSansMdp } = user;
    res.json(userSansMdp);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    // Si on veut changer le mot de passe, il faut le hasher
    if (data.mot_de_passe) {
      data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, 10);
    }

    const success = await User.update(id, data);
    if (!success) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou rien à mettre à jour" });
    }
    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};