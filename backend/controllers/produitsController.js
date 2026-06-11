const Produit = require("../models/Produits");
const multer = require('multer');
const { uploadImage } = require('../config/ftp'); 

exports.getAllProduit = async (req, res) => {
  try {
    const produits = await Produit.getAll();
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits", error });
  }
};

exports.getProduitsByCategory = async (req, res) => {
  try {
    const { categorie_id } = req.params;
    const produits = await Produit.getByCategory(categorie_id); // Assure-toi d'utiliser `getByCategory`
    res.json(produits);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits par catégorie :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/*
exports.getProduitById = async (req, res) => {
  try {
    const { id } = req.params;
    const produit = await Produit.getById(id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du produit", error });
  }
}; */

/*
exports.createProduit = async (req, res) => {
  try {
    const { nom, description, prix, stock, categorie_id, image_principale } = req.body;

    if (!nom || !description || !prix || !stock || !categorie_id || !image_principale) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    await Produit.create(nom, description, prix, stock, categorie_id, image_principale);
    res.status(201).json({ message: "Produit ajouté avec succès" });
  } catch (error) {
     console.error("Erreur serveur :", error); 
     res.status(500).json({ message: "Erreur serveur", error: error.message }); 
  }
};
*/
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage });

// Route pour créer un produit
/*
exports.createProduit = [
  upload.single('image'),  // Middleware pour gérer le téléchargement du fichier image
  async (req, res) => {
    console.log("Fichier reçu :", req.file);
    console.log("Données reçues :", req.body);
    const { nom, description, prix, stock, categorie_id } = req.body;
    const image_principale = req.file ? req.file.path : null; // Récupère le chemin du fichier téléchargé

    // Vérification de la présence des champs
    if (!nom || !description || !prix || !stock || !categorie_id || !image_principale) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
      // Si l'image est présente, on la télécharge sur le FTP
      const remotePath = `/images/${req.file.filename}`; // Chemin pour le serveur FTP
      console.log("Envoi vers FTP en cours...");
      const uploadedPath = await uploadImage(req.file.path, remotePath);
      console.log("Chemin FTP :", uploadedPath);

      if (!uploadedPath) {
        return res.status(500).json({ message: "Échec de l'upload FTP" });
      }

      // Création du produit dans la base de données avec le chemin de l'image sur le FTP
      const produit = await Produit.create(nom, description, prix, stock, categorie_id, uploadedPath);

      // Télécharger et enregistrer les images secondaires
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const remotePathSecondaire = `/images/produits/${file.filename}`;
            const uploadedPathSecondaire = await uploadImage(file.path, remotePathSecondaire);

            if (uploadedPathSecondaire) {
                const imageUrl = `http://localhost:3000/images/produits/${file.filename}`; // URL pour l'accès HTTP
                // Ajouter l'image secondaire dans la base de données
                await Produit.addImageSecondaire(produit.insertId, imageUrl);  // produit.insertId est l'ID du produit créé
            }
        }
    }
      
      // Réponse réussie
      res.status(201).json({
        message: 'Produit créé avec succès',
        produit
      });


    } catch (err) {
      console.error("Erreur complète :", err);
      res.status(500).json({ message: "Erreur lors de la création du produit" });
    }
  }
];*/
/*
exports.createProduit = async (req, res) => {
  try {
    console.log("Données reçues :", req.body);
    console.log("Fichiers reçus :", req.files);

    const { nom, description, prix, stock, categorie_id } = req.body;
    
    // Sauvegarde UNIQUEMENT le chemin relatif - c'est crucial
    const imagePrincipale = req.files && req.files['image'] 
      ? req.files['image'][0].path 
      : null;
    
    const imagesSecondaires = req.files && req.files['images_secondaires'] 
      ? req.files['images_secondaires'].map(file => file.path) 
      : [];

    console.log("🖼️ Image principale :", imagePrincipale);
    console.log("🖼️ Images secondaires :", imagesSecondaires);
    console.log("🌐 Corps de la requête :", req.body);

    // Vérification des champs obligatoires
    if (!nom || !description || !prix || !stock || !categorie_id || !imagePrincipale) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Création du produit
    const produitId = await Produit.create(nom, description, prix, stock, categorie_id, imagePrincipale);

    // Ajout des images secondaires
    if (imagesSecondaires.length > 0) {
      await Produit.addSecondaryImages(produitId, imagesSecondaires);
    }

    res.status(201).json({ message: "Produit ajouté avec succès", produitId });
  } catch (err) {
    console.error("Erreur complète :", err);
    res.status(500).json({ message: "Erreur lors de la création du produit", error: err.message });
  }
};

exports.getProduitById = async (req, res) => {
  const { id } = req.params;
  
  try {
      // Récupérer le produit
      const produit = await Produit.findById(id);
      if (!produit) {
          return res.status(404).json({ message: "Produit non trouvé" });
      }

      // Récupérer les images secondaires du produit
      const imagesSecondaires = await ImageProduit.findAll({ where: { produit_id: id } });
          // Vérifier si imagesSecondaires est stocké en JSON dans la base
      if (typeof imagesSecondaires === "string") {
        try {
          imagesSecondaires = JSON.parse(imagesSecondaires);
        } catch (err) {
          console.error("⚠️ Erreur de parsing JSON pour les images secondaires :", err);
          imagesSecondaires = [];
        }
      }

      res.status(200).json({
          produit,
          images_secondaires: imagesSecondaires
      });
  } catch (err) {
      console.error("❌ Erreur lors de la récupération du produit et des images secondaires", err);
      res.status(500).json({ message: "Erreur lors de la récupération du produit" });
  }
};
*/
exports.createProduit = async (req, res) => {
  try {
    console.log("🔹 Données reçues :", req.body);
    console.log("🔹 Fichiers reçus :", req.files);

    const { nom, description, prix, stock, categorie_id, benefices, conseil_utilisation, ingredients,} = req.body;
    
    // Vérifier et extraire l'image principale
    const imagePrincipale = req.files?.image?.[0]?.path || null;
    
    // Vérifier et extraire les images secondaires (tableau sécurisé)
    const imagesSecondaires = req.files?.images_secondaires 
      ? req.files.images_secondaires.map(file => file.path) 
      : [];

    console.log("🖼️ Image principale :", imagePrincipale);
    console.log("🖼️ Images secondaires :", imagesSecondaires);

    // Vérification des champs obligatoires
    if (!nom || !description || !prix || !stock || !categorie_id || !imagePrincipale || !benefices || !conseil_utilisation || !ingredients) {
      console.error("❌ Champs manquants :", { nom, description, prix, stock, categorie_id, imagePrincipale, benefices, conseil_utilisation, ingredients });
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Création du produit et récupération de son ID
    const produitId = await Produit.create(nom, description, prix, stock, categorie_id, imagePrincipale, benefices, conseil_utilisation, ingredients,);

    // Ajout des images secondaires si elles existent
    if (imagesSecondaires.length > 0) {
      await Produit.addSecondaryImages(produitId, imagesSecondaires);
    }

    res.status(201).json({ message: "✅ Produit ajouté avec succès", produitId });
  } catch (err) {
    console.error("❌ Erreur complète :", err);
    res.status(500).json({ message: "Erreur lors de la création du produit", error: err.message });
  }
};


exports.getProduitById = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Récupérer le produit avec ses images secondaires
    const produit = await Produit.getById(id);
    
    if (!produit) {
      return res.status(404).json({ message: "🚫 Produit non trouvé" });
    }
    
    // Maintenant que getById inclut déjà les images secondaires, 
    // nous n'avons plus besoin de les récupérer séparément
    res.status(200).json(produit);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du produit", err);
    res.status(500).json({ message: "Erreur lors de la récupération du produitx" });
  }
};

exports.updateProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, prix, stock, categorie_id, benefices, conseil_utilisation, ingredients } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !description || !prix || !stock || !categorie_id) {
      return res.status(400).json({ message: "Les champs requis sont manquants" });
    }

    const success = await Produit.update(id, nom, description, prix, stock, categorie_id, null, benefices, conseil_utilisation, ingredients);
    
    if (!success) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({ message: "✅ Produit mis à jour avec succès" });
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour du produit", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du produit", error: err.message });
  }
};

exports.deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Produit.delete(id);
    res.json({ message: "Produit supprimé avec succès", result });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
  }
}