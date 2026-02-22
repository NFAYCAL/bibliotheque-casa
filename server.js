const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// ---------------------
// Données en mémoire
// ---------------------
const CATEGORIES = [
  { id: "informatique", name: "Informatique", icon: "code" },
  { id: "cuisine", name: "Cuisine", icon: "chef" },
  { id: "sport", name: "Sport", icon: "dumbbell" },
  { id: "voiture", name: "Voiture", icon: "car" },
];

const BOOKS = [
  // Informatique
  {
    id: "it-azure-dev",
    title: "Azure pour les développeurs (pratique)",
    author: "M. El Idrissi",
    category: "informatique",
    year: 2025,
    level: "Intermédiaire",
    tags: ["Cloud", "CI/CD", "Static Web Apps"],
    desc: "Déploiement, GitHub Actions, API, monitoring, et bonnes pratiques pour un vrai projet.",
    cover: "gradient-blue"
  },
  {
    id: "it-js",
    title: "JavaScript Moderne",
    author: "A. Benali",
    category: "informatique",
    year: 2024,
    level: "Débutant",
    tags: ["Front", "DOM", "Fetch"],
    desc: "Une progression claire avec mini-projets : catalogue, recherche, UI responsive.",
    cover: "gradient-green"
  },
  {
    id: "it-arch",
    title: "Architecture Cloud : patterns essentiels",
    author: "S. Kabbaj",
    category: "informatique",
    year: 2023,
    level: "Avancé",
    tags: ["Scalabilité", "Sécurité", "Coûts"],
    desc: "Patterns réels : API Gateway, cache, queues, observabilité, et choix d’architecture.",
    cover: "gradient-purple"
  },

  // Cuisine
  {
    id: "cook-morocco",
    title: "Cuisine marocaine moderne",
    author: "N. Ait Lahcen",
    category: "cuisine",
    year: 2022,
    level: "Tous niveaux",
    tags: ["Maroc", "Recettes", "Organisation"],
    desc: "Recettes revisitées, timing et astuces pour cuisiner bon et vite au quotidien.",
    cover: "gradient-orange"
  },
  {
    id: "cook-sauces",
    title: "Sauces & Pâtes : le guide express",
    author: "L. Romano",
    category: "cuisine",
    year: 2021,
    level: "Débutant",
    tags: ["Rapide", "Familial"],
    desc: "Des sauces crémeuses et légères, avec variations et erreurs à éviter.",
    cover: "gradient-rose"
  },

  // Sport
  {
    id: "sport-12w",
    title: "Plan d’entraînement 12 semaines",
    author: "H. Saïdi",
    category: "sport",
    year: 2024,
    level: "Intermédiaire",
    tags: ["Fitness", "Routine", "Progression"],
    desc: "Force + cardio + mobilité, avec un vrai suivi : RPE, repos, deload.",
    cover: "gradient-cyan"
  },
  {
    id: "sport-nutrition",
    title: "Nutrition du sportif (simple & efficace)",
    author: "D. Rami",
    category: "sport",
    year: 2023,
    level: "Tous niveaux",
    tags: ["Nutrition", "Hydratation"],
    desc: "Macros, timing, hydratation, et plan type pour jours d’entraînement.",
    cover: "gradient-lime"
  },

  // Voiture
  {
    id: "car-basics",
    title: "Mécanique auto pour débutants",
    author: "K. Amrani",
    category: "voiture",
    year: 2020,
    level: "Débutant",
    tags: ["Entretien", "Sécurité"],
    desc: "Comprendre moteur, huiles, freins, pneus, et diagnostics simples.",
    cover: "gradient-slate"
  },
  {
    id: "car-safe",
    title: "Conduite économique & sûre",
    author: "R. El Fassi",
    category: "voiture",
    year: 2022,
    level: "Tous niveaux",
    tags: ["Économie", "Conduite"],
    desc: "Anticipation, freinage, pression pneus, et habitudes qui réduisent la consommation.",
    cover: "gradient-teal"
  }
];

const STORES = [
  { id: "casa-centre", city: "Casablanca", name: "BC Casa Centre", address: "Centre-ville", hours: "09:00–18:00" },
  { id: "maarif", city: "Casablanca", name: "BC Maârif", address: "Quartier Maârif", hours: "10:00–19:00" },
  { id: "ain-diab", city: "Casablanca", name: "BC Ain Diab", address: "Corniche", hours: "10:00–20:00" },
];

function normalize(str) {
  return String(str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// ---------------------
// API
// ---------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "bibliotheque-casa", time: new Date().toISOString() });
});

app.get("/api/categories", (req, res) => {
  res.json(CATEGORIES);
});

app.get("/api/stores", (req, res) => {
  res.json(STORES);
});

app.get("/api/stats", (req, res) => {
  const cities = [...new Set(STORES.map(s => s.city))];
  res.json({
    books: BOOKS.length,
    categories: CATEGORIES.length,
    stores: STORES.length,
    cities
  });
});

// GET /api/books?category=informatique&q=azure
app.get("/api/books", (req, res) => {
  const category = normalize(req.query.category || "all");
  const q = normalize(req.query.q || "");

  let results = BOOKS.slice();

  if (category !== "all") {
    results = results.filter(b => normalize(b.category) === category);
  }

  if (q) {
    results = results.filter(b => {
      const hay = normalize(`${b.title} ${b.author} ${b.desc} ${(b.tags || []).join(" ")} ${b.level} ${b.year}`);
      return hay.includes(q);
    });
  }

  res.json(results);
});

app.get("/api/books/:id", (req, res) => {
  const book = BOOKS.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// ---------------------
// Front statique
// ---------------------
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ bibliothèque-casa premium: http://localhost:${PORT}`));
