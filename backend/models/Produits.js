const db = require("../config/database");

class Produit {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM produits", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
  
  static getByCategory(categorie_id) {
    return new Promise((resolve, reject) => {
      // D'abord, récupérer tous les produits de la catégorie
      db.query(
        "SELECT id, nom, prix, image_principale, benefices, conseil_utilisation, ingredients, categorie_id FROM produits WHERE categorie_id = ?", 
        [categorie_id], 
        (err, produits) => {
          if (err) return reject(err);
          
          if (produits.length === 0) {
            return resolve([]);
          }
          
          // Récupérer les IDs de tous les produits
          const produitIds = produits.map(p => p.id);
          
          // Si aucun produit n'est trouvé, retourner un tableau vide
          if (produitIds.length === 0) {
            return resolve([]);
          }
          
          // Ensuite, récupérer toutes les images secondaires pour ces produits
          db.query(
            `SELECT produit_id, image_url FROM images_produits WHERE produit_id IN (${produitIds.map(() => '?').join(',')})`,
            produitIds,
            (errImg, images) => {
              if (errImg) return reject(errImg);
              
              // Associer les images à chaque produit
              const produitsAvecImages = produits.map(produit => {
                const imagesSecondaires = images
                  .filter(img => img.produit_id === produit.id)
                  .map(img => img.image_url);
                  
                return {
                  ...produit,
                  images_secondaires: imagesSecondaires
                };
              });
              
              resolve(produitsAvecImages);
            }
          );
        }
      );
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      // D'abord, récupérer le produit
      db.query("SELECT * FROM produits WHERE id = ?", [id], (err, results) => {
        if (err) return reject(err);
        
        // Si le produit n'existe pas
        if (results.length === 0) {
          return resolve(null);
        }
        
        const produit = results[0];
        
        // Ensuite, récupérer toutes les images secondaires pour ce produit
        db.query(
          "SELECT image_url FROM images_produits WHERE produit_id = ?",
          [id],
          (errImg, images) => {
            if (errImg) return reject(errImg);
            
            // Transformer le résultat en un tableau d'URLs
            const imagesSecondaires = images.map(img => img.image_url);
            
            // Ajouter les images secondaires au produit
            const produitComplet = {
              ...produit,
              images_secondaires: imagesSecondaires
            };
            
            resolve(produitComplet);
          }
        );
      });
    });
  }


/*
  static async create(nom, description, prix, stock, categorie_id, imageFile) {
    try {
      console.log("📂 Image reçue :", imageFile);

      if (!imageFile || !imageFile.path || !imageFile.filename) {
        throw new Error("Fichier image invalide ou non reçu");
      }
      const localPath = imageFile.path;  // Assuming imageFile is passed as an argument
      const remotePath = `/images/${imageFile.filename}`;
  
      // Upload the image to FTP
      const uploadedPath = await uploadImage(localPath, remotePath);
      if (!uploadedPath) {
        throw new Error("Échec de l'upload FTP");
      }
  
      return new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO produits (nom, description, prix, stock, categorie_id, image_principale) VALUES (?, ?, ?, ?, ?, ?)",
          [nom, description, prix, stock, categorie_id, remotePath], // Save the remote path to the database
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  */static async create(nom, description, prix, stock, categorie_id, imagePath, benefices, conseil_utilisation, ingredients) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO produits (nom, description, prix, stock, categorie_id, image_principale, benefices, conseil_utilisation, ingredients) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [nom, description, prix, stock, categorie_id, imagePath, benefices, conseil_utilisation, ingredients],
        (err, result) => {
          if (err) {
            console.error("❌ Erreur lors de l'insertion :", err);
            reject(err);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });
  } catch (err) {
    throw err;
  }
}
static update(id, nom, description, prix, stock, categorie_id, image_principale, benefices, conseil_utilisation, ingredients) {
    return new Promise((resolve, reject) => {
      db.query(
        "UPDATE produits SET nom =?, description =?, prix =?, stock =?, categorie_id =?, image_principale =?, benefices =?, conseil_utilisation =?, ingredients =? WHERE id =?",
        [nom, description, prix, stock, categorie_id, image_principale, benefices, conseil_utilisation, ingredients, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.affectedRows > 0);
        }
      );
    });
  }
  
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM produits WHERE id =?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  // Ajout des images secondaires au produit dans la base de données

  static async addSecondaryImages(produit_id, images) {
    try {
      return new Promise((resolve, reject) => {
        const values = images.map((image) => [produit_id, image]);
        db.query(
          "INSERT INTO images_produits (produit_id, image_url) VALUES ?",
          [values],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

}

module.exports = Produit;
