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

function safeImageURL(source = "") {
  const value = String(source).trim();
  if (!value) return "";
  if (/^\/?img\/[a-z0-9_./-]+\.(webp|png|jpe?g)$/i.test(value)) return value;
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function itemCard(item, categoryName) {
  const tags = (item.etiquetas || []).map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("");
  const prices = (item.variantes || []).map((variant) => `
    <span class="price-line"><span>${escapeHTML(variant.nombre)}</span><strong>${money.format(variant.precio)}</strong></span>
  `).join("");
  const photo = safeImageURL(item.foto);
  const dishImage = photo
    ? `<img src="${escapeHTML(photo)}" alt="${escapeHTML(item.nombre)}" loading="lazy" />`
    : `<span aria-hidden="true">${escapeHTML(item.icono || "🍽️")}</span>`;
  const searchableText = normalizeSearch(`${categoryName} ${item.nombre} ${item.descripcion} ${(item.etiquetas || []).join(" ")} ${(item.variantes || []).map((variant) => variant.nombre).join(" ")}`);
  return `
    <article class="dish ${item.disponible ? "" : "is-unavailable"}" data-search="${escapeHTML(searchableText)}">
      <div class="dish-art">${dishImage}</div>
      <div class="dish-content">
        <div class="dish-heading"><h3>${escapeHTML(item.nombre)}</h3>${item.disponible ? "" : '<span class="sold-out">Sin stock</span>'}</div>
        <p>${escapeHTML(item.descripcion)}</p>
        <div class="tags">${tags}</div>
        <div class="prices">${prices}</div>
      </div>
    </article>`;
}

function renderMenu(data) {
  const business = data.negocio || {};
  document.documentElement.style.setProperty("--accent", business.colorPrincipal || "#d64a2e");
  document.title = `${business.nombre || "Carta"} — Carta digital`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", `${business.eslogan || "Carta digital"} ${business.nombre || ""}`.trim());

  const whatsapp = business.whatsapp ? `https://wa.me/${encodeURIComponent(business.whatsapp)}` : "";
  const instagram = business.instagram ? `https://instagram.com/${encodeURIComponent(business.instagram)}` : "";
  const coverPhoto = safeImageURL(business.imagenPortada);
  const categoriesData = data.categorias || [];
  const categories = categoriesData.map((category, index) => `
    <a class="category-link ${index === 0 ? "active" : ""}" href="#${escapeHTML(category.id)}">${escapeHTML(category.nombre)}</a>
  `).join("");
  const sections = categoriesData.map((category) => `
    <section class="menu-section" id="${escapeHTML(category.id)}" data-category="${escapeHTML(category.nombre.toLowerCase())}">
      <div class="section-heading"><div><span class="eyebrow">La carta</span><h2>${escapeHTML(category.nombre)}</h2></div><p>${escapeHTML(category.bajada || "")}</p></div>
      <div class="dish-grid">${(category.platos || []).map((item) => itemCard(item, category.nombre)).join("")}</div>
    </section>
  `).join("");
  const updatedDate = business.actualizado ? new Date(`${business.actualizado}T12:00:00`) : null;
  const updated = updatedDate && !Number.isNaN(updatedDate.valueOf())
    ? updatedDate.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const ribbon = (business.textosCinta || []).filter(Boolean);
  const ticker = ribbon.length ? `
    <div class="ticker" aria-label="${escapeHTML(ribbon.join(" · "))}"><div>${[...ribbon, ...ribbon].map((text, index) => `${index ? '<b>✳</b>' : ""} ${escapeHTML(text)}`).join(" ")}</div></div>
  ` : "";
  const openMessage = business.mensajePortada ? `<div class="open-label">${escapeHTML(business.mensajePortada)}</div>` : "";
  const kicker = business.rubro ? `<p class="hero-kicker">${escapeHTML(business.rubro)}</p>` : "";
  const stamp = business.sello ? `<span class="hero-stamp">${escapeHTML(business.sello)}</span>` : "";
  const heroArt = coverPhoto ? `<div class="hero-art"><img src="${escapeHTML(coverPhoto)}" alt="${escapeHTML(business.imagenPortadaAlt || business.nombre || "Foto del local")}" fetchpriority="high" />${stamp}</div>` : "";
  const visitHeading = business.fraseVisita ? `<div class="visit-heading"><span class="eyebrow">${escapeHTML(business.nombre || "")}</span><h2>${escapeHTML(business.fraseVisita)}</h2></div>` : "";
  const footerPhrase = business.frasePie ? `<span>${escapeHTML(business.frasePie)}</span>` : "";

  app.innerHTML = `
    <header class="topbar"><a href="#inicio" class="brand-mark" aria-label="Inicio">${escapeHTML(business.inicial || (business.nombre || "C")[0])}</a><span class="topbar-note">Carta digital <i></i> Siempre al día</span><a class="top-order" href="#contacto">Encontranos <span>↗</span></a></header>
    <main id="inicio">
      <section class="hero ${coverPhoto ? "has-cover" : "no-cover"}">
        <div class="hero-copy">${openMessage}${kicker}<h1>${escapeHTML(business.nombre || "")}${business.nombre ? "<span>.</span>" : ""}</h1><p class="hero-description">${escapeHTML(business.eslogan || "")}</p><a class="hero-cta" href="#carta">Ver la carta <span>↓</span></a>${business.direccion ? `<p class="hero-address">⌖ &nbsp;${escapeHTML(business.direccion)}</p>` : ""}</div>
        ${heroArt}
      </section>
      ${ticker}
      <section class="menu-wrap" id="carta"><div class="menu-intro"><div><span class="eyebrow">Lo que sale de la cocina</span><h2>La carta<span>.</span></h2></div><label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Buscar en la carta" aria-label="Buscar platos" /></label></div>
        <nav class="category-nav" aria-label="Categorías de la carta">${categories}</nav>
        ${updated ? `<div class="updated-note"><span>✦</span> Precios actualizados el ${escapeHTML(updated)}</div>` : ""}
        <div class="menu-sections">${sections}</div>
      </section>
      <section class="visit ${visitHeading ? "has-heading" : "no-heading"}" id="contacto">${visitHeading}<div class="visit-details">${business.direccion ? `<div><span class="detail-label">Encontranos</span><p>${escapeHTML(business.direccion)}</p>${business.mapaUrl ? `<a href="${escapeHTML(business.mapaUrl)}" target="_blank" rel="noreferrer">Cómo llegar ↗</a>` : ""}</div>` : ""}${business.horarios?.length ? `<div><span class="detail-label">Horarios</span>${business.horarios.map((row) => `<p>${escapeHTML(row.dias)}<br/><strong>${escapeHTML(row.horas)}</strong></p>`).join("")}</div>` : ""}<div class="visit-actions">${whatsapp ? `<a class="contact-button" href="${whatsapp}" target="_blank" rel="noreferrer">Escribinos por WhatsApp <span>↗</span></a>` : ""}${instagram ? `<a class="instagram-link" href="${instagram}" target="_blank" rel="noreferrer">Instagram @${escapeHTML(business.instagram)} ↗</a>` : ""}</div></div></section>
    </main><footer><a href="#inicio" class="footer-brand">${escapeHTML(business.nombre || "Carta")}${business.nombre ? "<span>.</span>" : ""}</a>${footerPhrase}<span>© ${new Date().getFullYear()}</span></footer>
  `;
  activateNavigation();
  loadHeroAnimation();
  document.querySelector("#search").addEventListener("input", (event) => filterMenu(event.target.value));
}

async function loadHeroAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const { animate, stagger } = await import("https://esm.sh/animejs@4.5.0");
    animate(".hero-copy > *", {
      opacity: [0, 1], y: [18, 0], delay: stagger(90), duration: 700, ease: "outExpo"
    });
    if (document.querySelector(".hero-art")) {
      animate(".hero-art", { opacity: [0, 1], scale: [0.96, 1], duration: 950, ease: "outExpo" });
    }
  } catch {
    // Anime.js es opcional: la carta ya está renderizada aunque el CDN no responda.
  }
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
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("active", link.hash === `#${visible.target.id}`));
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.filter(Boolean).forEach((section) => observer.observe(section));
}

async function start() {
  try {
    if (!slug) throw new Error("Local no encontrado");
    const response = await fetch(`data/${slug}.json`);
    if (!response.ok) throw new Error("Local no encontrado");
    renderMenu(await response.json());
  } catch (error) {
    app.innerHTML = `<main class="error-state"><span>:(</span><h1>${escapeHTML(error.message)}</h1><p>Revisá el enlace o volvé a intentarlo más tarde.</p><a href="./">Volver al inicio</a></main>`;
  }
}

start();
