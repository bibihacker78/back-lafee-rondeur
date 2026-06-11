const db = require("../config/database");
const bcrypt = require("bcryptjs");

class Utilisateur {

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM utilisateurs WHERE email = ?", [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
  static async findById(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM utilisateurs WHERE id = ?", [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
}

static async create({
  nom, email, mot_de_passe, role = "client",
  telephone, prefixe, adresse, commune, ville, code_postal, pays, info_supplementaire
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      db.query(
        `INSERT INTO utilisateurs 
        (nom, email, mot_de_passe, role, telephone, prefixe, adresse, commune, ville, code_postal, pays, info_supplementaire)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nom, email, hashedPassword, role, telephone, prefixe, adresse, commune, ville, code_postal, pays, info_supplementaire],
        (err, results) => {
          if (err) reject(err);
          else resolve(results.insertId);
        }
      );
    } catch (error) {
      reject(error);  
    }
  });
}
static async update(id, data) {
  return new Promise((resolve, reject) => {
    // Prépare dynamiquement les champs à mettre à jour
    const fields = [];
    const values = [];
    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if (fields.length === 0) return resolve(false);

    values.push(id);
    const sql = `UPDATE utilisateurs SET ${fields.join(", ")} WHERE id = ?`;
    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result.affectedRows > 0);
    });
  });
}

}

module.exports = Utilisateur;
