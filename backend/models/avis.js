const db = require("../config/database");

class Avis {
static async create({ utilisateur_id = null, produit_id, note, commentaire, nom = null, email = null }) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO avis (utilisateur_id, produit_id, note, commentaire, nom, email) VALUES (?, ?, ?, ?, ?, ?)`,
      [utilisateur_id, produit_id, note, commentaire, nom, email],
      (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      }
    );
  });
}

static async getByProduit(produit_id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT a.*, 
        u.nom AS utilisateur_nom, 
        u.email AS utilisateur_email 
      FROM avis a
      LEFT JOIN utilisateurs u ON a.utilisateur_id = u.id
      WHERE a.produit_id = ?
      ORDER BY a.date_avis DESC`,
      [produit_id],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
}
}
module.exports = Avis;