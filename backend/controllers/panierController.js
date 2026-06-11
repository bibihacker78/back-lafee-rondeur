const Panier = require('../models/Panier');
const db = require('../config/database');



exports.getUserCart = async (req, res) => {
    try {
        const utilisateur_id = req.params.utilisateur_id;
        const cartItems = await Panier.getByUserId(utilisateur_id);
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du panier", error });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { utilisateur_id, produit_id, quantite } = req.body;
        
        if (!utilisateur_id || !produit_id || !quantite) {
            return res.status(400).json({ message: "Tous les champs sont requis (utilisateur_id, produit_id, quantite)" });
        }

        const result = await Panier.addItem(utilisateur_id, produit_id, quantite);
        res.status(201).json({ 
            message: "Produit ajouté au panier avec succès", 
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout au panier", error });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const id = req.params.id;
        const { quantite } = req.body;
        
        if (!quantite) {
            return res.status(400).json({ message: "La quantité est requise" });
        }

        await Panier.updateQuantity(id, quantite);
        res.status(200).json({ message: "Quantité mise à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du panier", error });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
      const id = req.params.id;
  
      const results = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM panier WHERE id = ?', [id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Article de panier non trouvé" });
      }
  
      const panierItem = results[0];
  
      if (panierItem.utilisateur_id !== req.user.id) {
        return res.status(403).json({ message: "Non autorisé à supprimer cet article" });
      }
  
      await Panier.removeItem(id);
      res.status(200).json({ message: "Produit retiré du panier avec succès" });
  
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      res.status(500).json({
        message: "Erreur lors de la suppression du produit du panier",
        error: error.message
      });
    }
  };
  

exports.getCartTotal = async (req, res) => {
    try {
        const utilisateur_id = req.params.utilisateur_id;
        const total = await Panier.getTotal(utilisateur_id);
        res.status(200).json(total);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du calcul du total du panier", error });
    }
};

// Vider le panier d'un utilisateur
exports.clearCart = async (req, res) => {
    try {
      const { utilisateur_id } = req.params;
      
      // Vérifier que l'utilisateur est bien authentifié
      if (req.user.id != utilisateur_id) {
        return res.status(403).json({ message: "Accès non autorisé" });
      }
      
      // Supprimer tous les articles du panier de l'utilisateur
      const result = await db.query(
        'DELETE FROM panier WHERE utilisateur_id = ?', 
        [utilisateur_id]
      );
  
      res.status(200).json({ message: "Panier vidé avec succès" });
    } catch (error) {
      console.error('Erreur lors du vidage du panier :', error);
      res.status(500).json({ message: "Erreur lors du vidage du panier" });
    }
  };