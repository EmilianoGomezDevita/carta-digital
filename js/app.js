import { animate, stagger } from "https://esm.sh/animejs";

const app = document.querySelector("#app");
const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get("n") || "demo";
const slug = /^[a-z0-9-]+$/.test(requestedSlug) ? requestedSlug : "";
const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

function normalizeSearch(value = "") {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

function itemCard(item, categoryName) {
  const tags = (item.etiquetas || []).map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("");
  const prices = item.variantes.map((variant) => `
    <span class="price-line"><span>${escapeHTML(variant.nombre)}</span><strong>${money.format(variant.precio)}</strong></span>
  `).join("");
  return `
    <article class="dish ${item.disponible ? "" : "is-unavailable"}" data-search="${escapeHTML(normalizeSearch(`${categoryName} ${item.nombre} ${item.descripcion} ${(item.etiquetas || []).join(" ")} ${(item.variantes || []).map((variant) => variant.nombre).join(" ")}`))}">
      <div class="dish-art" aria-hidden="true"><span>${escapeHTML(item.icono || "🍽️")}</span></div>
      <div class="dish-content">
        <div class="dish-heading"><h3>${escapeHTML(item.nombre)}</h3>${item.disponible ? "" : '<span class="sold-out">Sin stock</span>'}</div>
        <p>${escapeHTML(item.descripcion)}</p>
        <div class="tags">${tags}</div>
        <div class="prices">${prices}</div>
      </div>
    </article>`;
}

function renderMenu(data) {
  document.documentElement.style.setProperty("--accent", data.negocio.colorPrincipal || "#d64a2e");
  const business = data.negocio;
  document.title = `${business.nombre} — Carta digital`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", `${business.eslogan} Carta digital de ${business.nombre}.`);
  const whatsapp = business.whatsapp ? `https://wa.me/${encodeURIComponent(business.whatsapp)}` : "";
  const instagram = business.instagram ? `https://instagram.com/${encodeURIComponent(business.instagram)}` : "";
  const categories = data.categorias.map((category, index) => `
    <a class="category-link ${index === 0 ? "active" : ""}" href="#${escapeHTML(category.id)}">${escapeHTML(category.nombre)}</a>
  `).join("");
  const sections = data.categorias.map((category) => `
    <section class="menu-section" id="${escapeHTML(category.id)}" data-category="${escapeHTML(category.nombre.toLowerCase())}">
      <div class="section-heading"><div><span class="eyebrow">La carta</span><h2>${escapeHTML(category.nombre)}</h2></div><p>${escapeHTML(category.bajada || "")}</p></div>
      <div class="dish-grid">${category.platos.map((item) => itemCard(item, category.nombre)).join("")}</div>
    </section>
  `).join("");
  const updated = new Date(`${business.actualizado}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  app.innerHTML = `
    <header class="topbar"><a href="#inicio" class="brand-mark" aria-label="Inicio">${escapeHTML(business.inicial || business.nombre[0])}</a><span class="topbar-note">Carta digital <i></i> Siempre al día</span><a class="top-order" href="#contacto">Encontranos <span>↗</span></a></header>
    <main id="inicio">
      <section class="hero">
        <div class="hero-copy"><div class="open-label"><span></span> ABIERTO DESDE LAS 19:00</div><p class="hero-kicker">Burgers de barrio · Buenos Aires</p><h1>${escapeHTML(business.nombre)}<span>.</span></h1><p class="hero-description">${escapeHTML(business.eslogan)}</p><a class="hero-cta" href="#carta">Ver la carta <span>↓</span></a><p class="hero-address">⌖ &nbsp;${escapeHTML(business.direccion)}</p></div>
        <div class="hero-art" role="img" aria-label="Ilustración de una hamburguesa"><div class="sun"></div><div class="art-caption">HECHO<br/>EN EL BARRIO</div><div class="burger"><div class="bun-top"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="lettuce"></div><div class="cheese"></div><div class="patty"></div><div class="bun-bottom"></div></div><span class="hero-stamp">SMASH<br/>&nbsp;&nbsp;YOUR<br/>HUNGER</span></div>
      </section>
      <div class="ticker"><div>BUEN PAN <b>✳</b> CARNE DE VERDAD <b>✳</b> MUCHO CHEDDAR <b>✳</b> HECHO ACÁ <b>✳</b> BUEN PAN <b>✳</b> CARNE DE VERDAD <b>✳</b></div></div>
      <section class="menu-wrap" id="carta"><div class="menu-intro"><div><span class="eyebrow">Lo que sale de la cocina</span><h2>La carta<span>.</span></h2></div><label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Buscar en la carta" aria-label="Buscar platos" /></label></div>
        <nav class="category-nav" aria-label="Categorías de la carta">${categories}</nav>
        <div class="updated-note"><span>✦</span> Precios actualizados el ${updated}</div>
        <div class="menu-sections">${sections}</div>
      </section>
      <section class="visit" id="contacto"><div class="visit-heading"><span class="eyebrow">Pasá cuando quieras</span><h2>Nos vemos<br/>en la esquina<span>.</span></h2></div><div class="visit-details"><div><span class="detail-label">Encontranos</span><p>${escapeHTML(business.direccion)}</p><a href="${escapeHTML(business.mapaUrl)}" target="_blank" rel="noreferrer">Cómo llegar ↗</a></div><div><span class="detail-label">Horarios</span>${business.horarios.map((row) => `<p>${escapeHTML(row.dias)}<br/><strong>${escapeHTML(row.horas)}</strong></p>`).join("")}</div><div class="visit-actions">${whatsapp ? `<a class="contact-button" href="${whatsapp}" target="_blank" rel="noreferrer">Escribinos por WhatsApp <span>↗</span></a>` : ""}${instagram ? `<a class="instagram-link" href="${instagram}" target="_blank" rel="noreferrer">Instagram @${escapeHTML(business.instagram)} ↗</a>` : ""}</div></div></section>
    </main><footer><a href="#inicio" class="footer-brand">${escapeHTML(business.nombre)}<span>.</span></a><span>Una buena burger siempre encuentra su lugar.</span><span>© ${new Date().getFullYear()}</span></footer>
  `;
  activateNavigation();
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animate(".hero-copy > *", {
      opacity: [0, 1],
      y: [18, 0],
      delay: stagger(90),
      duration: 700,
      ease: "outExpo"
    });
    animate(".hero-art", {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration: 950,
      ease: "outExpo"
    });
  }
  document.querySelector("#search").addEventListener("input", (event) => filterMenu(event.target.value));
}

function filterMenu(query) {
  const normalized = normalizeSearch(query);
  document.querySelectorAll(".dish").forEach((card) => {
    card.hidden = !card.dataset.search.includes(normalized);
  });
  document.querySelectorAll(".menu-section").forEach((section) => {
    section.hidden = !section.querySelector(".dish:not([hidden])");
  });
}

function activateNavigation() {
  const links = [...document.querySelectorAll(".category-link")];
  const sections = links.map((link) => document.querySelector(link.getAttribute("href")));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach((section) => observer.observe(section));
}

async function start() {
  try {
    if (!slug || !["demo", "la-esquina"].includes(slug)) throw new Error("Local no encontrado");
    const response = await fetch("data/demo.json");
    if (!response.ok) throw new Error("No se pudo cargar la carta");
    renderMenu(await response.json());
  } catch (error) {
    app.innerHTML = `<main class="error-state"><span>:(</span><h1>${escapeHTML(error.message)}</h1><p>Revisá el enlace o volvé a intentarlo más tarde.</p><a href="./">Volver al inicio</a></main>`;
  }
}

start();
