const express = require('express');
const router = express.Router();
const multer = require('multer');
const produitsController = require('../controllers/produitsController');

// Configuration de multer pour gérer l'upload
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage });
  
router.get('/', produitsController.getAllProduit);
router.get('/categorie/:categorie_id', produitsController.getProduitsByCategory);
router.get('/:id', produitsController.getProduitById);
router.put("/:id", produitsController.updateProduit);
router.delete("/:id", produitsController.deleteProduit);
router.post(
    "/",
    upload.fields([
      { name: "image", maxCount: 1 }, // Image principale
      { name: "images_secondaires", maxCount: 5 } // Jusqu'à 5 images secondaires
    ]),
    produitsController.createProduit
  );


module.exports = router;
