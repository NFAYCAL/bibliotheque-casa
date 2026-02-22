// ==============================
// DONNÉES LOCALES (STATIQUE)
// ==============================

const CATEGORIES = [
  { id: "informatique", name: "Informatique", icon: "code" },
  { id: "cuisine", name: "Cuisine", icon: "chef" },
  { id: "sport", name: "Sport", icon: "dumbbell" },
  { id: "voiture", name: "Voiture", icon: "car" }
];

const STORES = [
  { city: "Casablanca", name: "BC Casa Centre", address: "Centre-ville", hours: "09:00–18:00" },
  { city: "Casablanca", name: "BC Maârif", address: "Maârif", hours: "10:00–19:00" },
  { city: "Casablanca", name: "BC Ain Diab", address: "Corniche", hours: "10:00–20:00" }
];

const BOOKS = [
  {
    id: "it-1",
    title: "Azure pour les développeurs",
    author: "M. El Idrissi",
    category: "informatique",
    year: 2025,
    level: "Intermédiaire",
    tags: ["Cloud", "CI/CD"],
    desc: "Guide pratique pour déployer et architecturer des apps cloud.",
    cover: "gradient-blue"
  },
  {
    id: "cook-1",
    title: "Cuisine marocaine moderne",
    author: "N. Ait Lahcen",
    category: "cuisine",
    year: 2022,
    level: "Tous niveaux",
    tags: ["Recettes", "Maroc"],
    desc: "Recettes revisitées et astuces pratiques.",
    cover: "gradient-orange"
  }
];
const els = {
  year: document.getElementById("year"),
  navBtn: document.getElementById("navBtn"),
  mobileNav: document.getElementById("mobileNav"),
  quickCats: document.getElementById("quickCats"),
  featured: document.getElementById("featured"),
  filters: document.getElementById("filters"),
  searchInput: document.getElementById("searchInput"),
  bookGrid: document.getElementById("bookGrid"),
  emptyState: document.getElementById("emptyState"),
  resetBtn: document.getElementById("resetBtn"),
  storeGrid: document.getElementById("storeGrid"),
  cityLine: document.getElementById("cityLine"),

  statBooks: document.getElementById("statBooks"),
  statStores: document.getElementById("statStores"),
  statCities: document.getElementById("statCities"),

  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalMeta: document.getElementById("modalMeta"),
  modalDesc: document.getElementById("modalDesc"),
  modalTags: document.getElementById("modalTags"),
  modalCover: document.getElementById("modalCover"),
  reserveBtn: document.getElementById("reserveBtn"),

  contactForm: document.getElementById("contactForm"),
  formHint: document.getElementById("formHint"),
};

let state = { category: "all", q: "" };
let cache = { categories: [], books: [], stores: [], stats: null };
let currentBook = null;

async function api(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

function icon(name){
  // Minimal inline SVG icons (no external libs)
  const svgs = {
    book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4h11a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7"/><path d="M6 17h13" stroke="currentColor" stroke-width="1.7"/></svg>`,
    store: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9l2-5h14l2 5" stroke="currentColor" stroke-width="1.7"/><path d="M4 9v10h16V9" stroke="currentColor" stroke-width="1.7"/><path d="M9 19v-6h6v6" stroke="currentColor" stroke-width="1.7"/></svg>`,
    pin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" stroke="currentColor" stroke-width="1.7"/><path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" stroke-width="1.7"/></svg>`,
    clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" stroke-width="1.7"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.7"/></svg>`,
    spark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l1.5 6L20 10l-6.5 2L12 22l-1.5-10L4 10l6.5-2L12 2Z" stroke="currentColor" stroke-width="1.7"/></svg>`,
    code: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18 3 12l6-6" stroke="currentColor" stroke-width="1.7"/><path d="M15 6l6 6-6 6" stroke="currentColor" stroke-width="1.7"/><path d="M14 4 10 20" stroke="currentColor" stroke-width="1.7"/></svg>`,
    chef: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 10a5 5 0 0 1 10 0v2H7v-2Z" stroke="currentColor" stroke-width="1.7"/><path d="M9 12v8h6v-8" stroke="currentColor" stroke-width="1.7"/><path d="M8 6a2 2 0 1 1 4 0 2 2 0 1 1 4 0" stroke="currentColor" stroke-width="1.7"/></svg>`,
    dumbbell: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9v6" stroke="currentColor" stroke-width="1.7"/><path d="M18 9v6" stroke="currentColor" stroke-width="1.7"/><path d="M8 10v4" stroke="currentColor" stroke-width="1.7"/><path d="M16 10v4" stroke="currentColor" stroke-width="1.7"/><path d="M10 12h4" stroke="currentColor" stroke-width="1.7"/></svg>`,
    car: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 16v-3l2-5h14l2 5v3" stroke="currentColor" stroke-width="1.7"/><path d="M5 16h14" stroke="currentColor" stroke-width="1.7"/><path d="M7 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="currentColor" stroke-width="1.7"/><path d="M17 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" stroke="currentColor" stroke-width="1.7"/></svg>`,
  };
  return svgs[name] || svgs.spark;
}

function setIconContainers(){
  document.querySelectorAll("[data-ico]").forEach(el => {
    el.innerHTML = icon(el.getAttribute("data-ico"));
  });
}

function coverClass(cover){
  return `cover ${cover || "gradient-blue"}`;
}

function esc(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function formatCategory(catId){
  const c = cache.categories.find(x => x.id === catId);
  return c ? c.name : catId;
}

function buildFilterChips(){
  els.filters.innerHTML = "";
  const all = document.createElement("button");
  all.className = "fchip fchip--active";
  all.textContent = "Tous";
  all.dataset.cat = "all";
  all.addEventListener("click", () => setCategory("all"));
  els.filters.appendChild(all);

  cache.categories.forEach(c => {
    const b = document.createElement("button");
    b.className = "fchip";
    b.dataset.cat = c.id;
    b.textContent = c.name;
    b.addEventListener("click", () => setCategory(c.id));
    els.filters.appendChild(b);
  });
}

function setCategory(cat){
  state.category = cat;
  // UI active
  document.querySelectorAll(".fchip").forEach(ch => {
    ch.classList.toggle("fchip--active", ch.dataset.cat === cat);
  });
  renderBooks();
}

function renderQuickCats(){
  els.quickCats.innerHTML = "";
  cache.categories.forEach(c => {
    const btn = document.createElement("div");
    btn.className = "qc";
    btn.innerHTML = `
      <div class="qc__ico">${icon(c.icon)}</div>
      <div class="qc__txt">
        <strong>${esc(c.name)}</strong>
        <small>Explorer</small>
      </div>
    `;
    btn.addEventListener("click", () => {
      document.getElementById("catalogue").scrollIntoView({behavior:"smooth"});
      setCategory(c.id);
    });
    els.quickCats.appendChild(btn);
  });
}

function renderFeatured(){
  els.featured.innerHTML = "";
  const picks = cache.books.slice(0, 3);
  picks.forEach(b => {
    const row = document.createElement("div");
    row.className = "feat";
    row.innerHTML = `
      <div class="${coverClass(b.cover)}"></div>
      <div>
        <strong>${esc(b.title)}</strong>
        <small>${esc(formatCategory(b.category))} • ${esc(b.level)} • ${esc(b.year)}</small>
      </div>
    `;
    row.addEventListener("click", () => openModal(b));
    els.featured.appendChild(row);
  });
}

function renderBooks(){
  const q = state.q.trim().toLowerCase();

  const filtered = cache.books.filter(b => {
    const inCat = state.category === "all" ? true : b.category === state.category;
    const hay = `${b.title} ${b.author} ${b.desc} ${(b.tags||[]).join(" ")} ${b.level} ${b.year}`.toLowerCase();
    const inQ = q ? hay.includes(q) : true;
    return inCat && inQ;
  });

  els.bookGrid.innerHTML = "";
  if(filtered.length === 0){
    els.emptyState.hidden = false;
    return;
  }
  els.emptyState.hidden = true;

  filtered.forEach(b => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__top">
        <span class="badge">${esc(formatCategory(b.category))}</span>
        <span class="badge">${esc(b.level)}</span>
      </div>

      <div style="display:flex;gap:12px;align-items:center">
        <div class="${coverClass(b.cover)}"></div>
        <div>
          <h3>${esc(b.title)}</h3>
          <div class="muted small">${esc(b.author)} • ${esc(b.year)}</div>
        </div>
      </div>

      <p>${esc(b.desc)}</p>

      <div class="tagRow">
        ${(b.tags||[]).slice(0,3).map(t => `<span class="tag">${esc(t)}</span>`).join("")}
      </div>

      <div class="card__actions">
        <button class="btn btn--primary btn--sm" data-open="${esc(b.id)}">Détails</button>
        <button class="btn btn--sm" data-reserve="${esc(b.id)}">Réserver</button>
      </div>
    `;

    card.querySelector(`[data-open="${b.id}"]`).addEventListener("click", () => openModal(b));
    card.querySelector(`[data-reserve="${b.id}"]`).addEventListener("click", () => {
      alert(`Réservation simulée ✅\n\n"${b.title}"`);
    });

    els.bookGrid.appendChild(card);
  });
}

function renderStores(){
  els.storeGrid.innerHTML = "";
  cache.stores.forEach(s => {
    const card = document.createElement("div");
    card.className = "store";
    card.innerHTML = `
      <div class="store__ico">${icon("store")}</div>
      <div>
        <strong>${esc(s.name)}</strong>
        <small>${esc(s.city)} • ${esc(s.address)}</small>
        <div class="muted small" style="margin-top:6px">Horaires : ${esc(s.hours)}</div>
      </div>
    `;
    els.storeGrid.appendChild(card);
  });
}

function openModal(book){
  currentBook = book;
  els.modalTitle.textContent = book.title;
  els.modalMeta.textContent = `${book.author} • ${formatCategory(book.category)} • ${book.level} • ${book.year}`;
  els.modalDesc.textContent = book.desc;
  els.modalCover.className = coverClass(book.cover);

  els.modalTags.innerHTML = "";
  (book.tags||[]).forEach(t => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = t;
    els.modalTags.appendChild(tag);
  });

  els.modal.setAttribute("aria-hidden","false");
}

function closeModal(){
  els.modal.setAttribute("aria-hidden","true");
  currentBook = null;
}

function wireEvents(){
  els.year.textContent = new Date().getFullYear();

  // Mobile nav
  els.navBtn.addEventListener("click", () => {
    const hidden = els.mobileNav.hasAttribute("hidden");
    if(hidden) els.mobileNav.removeAttribute("hidden");
    else els.mobileNav.setAttribute("hidden","");
  });

  // Search
  els.searchInput.addEventListener("input", (e) => {
    state.q = e.target.value;
    renderBooks();
  });

  // Reset
  els.resetBtn.addEventListener("click", () => {
    state = { category: "all", q: "" };
    els.searchInput.value = "";
    buildFilterChips();
    renderBooks();
  });

  // Modal close
  els.modal.addEventListener("click", (e) => {
    if(e.target?.dataset?.close === "true") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeModal();
  });

  els.reserveBtn.addEventListener("click", () => {
    if(!currentBook) return;
    alert(`Réservation simulée ✅\n\n"${currentBook.title}"`);
  });

  // Contact form
  els.contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(els.contactForm);
    const name = String(fd.get("name") || "").trim();
    els.formHint.textContent = `Merci ${name || ""} ! Message simulé (front only).`;
    els.contactForm.reset();
    setTimeout(() => els.formHint.textContent = "", 3500);
  });
}

async function load(){
  const [categories, books, stores, stats] = await Promise.all([
    api("/api/categories"),
    api("/api/books"),
    api("/api/stores"),
    api("/api/stats"),
  ]);

  cache = { categories, books, stores, stats };

  els.statBooks.textContent = stats.books;
  els.statStores.textContent = stats.stores;
  els.statCities.textContent = stats.cities.length;
  els.cityLine.textContent = `Villes : ${stats.cities.join(" • ")}`;

  buildFilterChips();
  renderQuickCats();
  renderFeatured();
  renderBooks();
  renderStores();
  setIconContainers();
}

wireEvents();
load().catch(err => {
  console.error(err);
  alert("Erreur: impossible de charger les données. Vérifie que le serveur Node est lancé.");
});
