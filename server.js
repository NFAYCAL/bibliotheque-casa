
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

const CATEGORIES = [
  { name: "Informatique" },
  { name: "Cuisine" },
  { name: "Sport" },
  { name: "Voiture" }
];

const BOOKS = [
  { id: "it-1", title: "Apprendre JavaScript", author: "A. Benali", category: "Informatique" },
  { id: "cook-1", title: "Cuisine marocaine moderne", author: "N. Ait Lahcen", category: "Cuisine" },
  { id: "sport-1", title: "Plan d’entraînement 12 semaines", author: "H. Saïdi", category: "Sport" },
  { id: "car-1", title: "Mécanique auto pour débutants", author: "K. Amrani", category: "Voiture" }
];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "bibliotheque-casa" });
});

app.get("/api/books", (req, res) => {
  res.json(BOOKS);
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
