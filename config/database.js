const mysql = require('mysql2');
const dotenv = require('dotenv');
const express = require('express');



dotenv.config();

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,      
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


  module.exports = db;