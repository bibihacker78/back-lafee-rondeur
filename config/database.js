const mysql = require('mysql');
const dotenv = require('dotenv');
const express = require('express');



dotenv.config();

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    database : process.env.DB_DATABASE,
    password : process.env.DB_PASSWORD
});

const app = express();
db.connect((err) => {
    if (err) {
      console.error('Erreur de connexion :', err.message);
      return;
    }
    console.log('Connexion réussie à la base de données MySQL');
  });
/*
  app.get("/categories", (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
      
    });
  });

  app.get("/produits", (req, res) => {
    const sql = "SELECT * FROM produits";
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
      
    });
  });


  app.get("/utilisateurs", (req, res) => {
    const sql = "SELECT * FROM utilisateurs";
    db.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
*/

  module.exports = db;