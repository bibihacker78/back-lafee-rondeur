const db = require('../config/database');

class Panier {
    static getAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM panier', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static getByUserId(utilisateur_id) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT p.*, pr.nom, pr.prix, pr.image_principale 
                 FROM panier p 
                 JOIN produits pr ON p.produit_id = pr.id 
                 WHERE p.utilisateur_id = ?`, 
                [utilisateur_id], 
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
    }

    static getById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM panier WHERE id = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    static addItem(utilisateur_id, produit_id, quantite) {
        return new Promise((resolve, reject) => {
            // Vérifier d'abord si le produit existe déjà dans le panier
            db.query(
                'SELECT * FROM panier WHERE utilisateur_id = ? AND produit_id = ?',
                [utilisateur_id, produit_id],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else if (results.length > 0) {
                        // Si le produit existe déjà, mettre à jour la quantité
                        const newQuantite = results[0].quantite + quantite;
                        db.query(
                            'UPDATE panier SET quantite = ? WHERE utilisateur_id = ? AND produit_id = ?',
                            [newQuantite, utilisateur_id, produit_id],
                            (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            }
                        );
                    } else {
                        // Si le produit n'existe pas, l'ajouter au panier
                        db.query(
                            'INSERT INTO panier (utilisateur_id, produit_id, quantite) VALUES (?, ?, ?)',
                            [utilisateur_id, produit_id, quantite],
                            (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            }
                        );
                    }
                }
            );
        });
    }

    static updateQuantity(id, quantite) {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE panier SET quantite = ? WHERE id = ?',
                [quantite, id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }
    static removeItem(id) {
        return new Promise((resolve, reject) => {
          db.query('DELETE FROM panier WHERE id = ?', [id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      }
    

    static clearCart(utilisateur_id) {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM panier WHERE utilisateur_id = ?',
                [utilisateur_id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }


    static getTotal(utilisateur_id) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(p.quantite * pr.prix) as total 
                 FROM panier p 
                 JOIN produits pr ON p.produit_id = pr.id 
                 WHERE p.utilisateur_id = ?`,
                [utilisateur_id],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]);
                }
            );
        });
    }
}


module.exports = Panier;