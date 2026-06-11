const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

// Dashboard stats: compute real counts from the database
router.get("/stats", auth, isAdmin, async (req, res) => {
  const db = require('../config/database');
  const query = (sql, params=[]) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  try {
    const produitsRes = await query('SELECT COUNT(*) AS count FROM produits');
    const usersRes = await query('SELECT COUNT(*) AS count FROM utilisateurs WHERE role = "client"');
    const commandesRes = await query('SELECT COUNT(*) AS count FROM commandes');
    const chiffreRes = await query('SELECT IFNULL(SUM(total),0) AS total FROM commandes');
    const stockFaibleRes = await query('SELECT COUNT(*) AS count FROM produits WHERE stock <= 5');

    res.json({
      produits: produitsRes[0]?.count || 0,
      commandes: commandesRes[0]?.count || 0,
      utilisateurs: usersRes[0]?.count || 0,
      stockFaible: stockFaibleRes[0]?.count || 0,
      chiffreAffaires: Number(chiffreRes[0]?.total || 0)
    });
  } catch (err) {
    console.error('Erreur récupération stats admin:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des statistiques' });
  }
});

// Exemple : commandes
router.get("/commandes", auth, isAdmin, async (req, res) => {
  res.json({ message: "Liste des commandes admin" });
});

// Retourne la liste des clients (utilisateurs avec role = 'client')
router.get("/clients", auth, isAdmin, async (req, res) => {
  const db = require('../config/database');
  const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

  try {
    const rows = await query(
      `SELECT id, nom, email, role, telephone, date_creation AS created_at FROM utilisateurs WHERE role = 'client' ORDER BY date_creation DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur récupération clients admin:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des clients' });
  }
});

module.exports = router;
