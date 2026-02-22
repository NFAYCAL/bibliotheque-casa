# bibliothèque-casa (Premium)

Site vitrine premium **sans base de données** (données en mémoire) : Node.js + Express + Front (HTML/CSS/JS).

## Lancer en local
```bash
npm install
npm start
```
Ouvre : http://localhost:3000

## API
- GET /api/health
- GET /api/stats
- GET /api/categories
- GET /api/stores
- GET /api/books?category=all|informatique|cuisine|sport|voiture&q=...
- GET /api/books/:id
