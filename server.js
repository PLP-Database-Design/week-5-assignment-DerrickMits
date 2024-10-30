require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving patients');
    } else {
      res.json(results);
    }
  });
});

// Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_speciality FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving providers');
    } else {
      res.json(results);
    }
  });
});

// Filter patients by First Name
app.get('/patients/search', (req, res) => {
  const { firstName } = req.query;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [firstName], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving patients by first name');
    } else {
      res.json(results);
    }
  });
});

// Retrieve providers by specialty
app.get('/providers/specialty', (req, res) => {
  const { specialty } = req.query;
  const query = 'SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving providers by specialty');
    } else {
      res.json(results);
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
