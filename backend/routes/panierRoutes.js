const express = require('express');

const router = express.Router();
const panierController = require('../controllers/panierController');
const auth = require('../middlewares/authMiddleware.js');

// Récupérer le panier d'un utilisateur
router.get('/user/:utilisateur_id', panierController.getUserCart);

// Ajouter un produit au panier
router.post('/', panierController.addToCart);

// Mettre à jour la quantité d'un produit dans le panier
router.put('/:id', panierController.updateCartItem);

// Route pour supprimer un article du panier
router.delete('/item/:id', auth, panierController.removeCartItem);

// Route pour vider le panier d'un utilisateur
router.delete('/clear/:utilisateur_id', auth, panierController.clearCart);

// Obtenir le total du panier d'un utilisateur
router.get('/user/:id/total', panierController.getCartTotal);

module.exports = router;