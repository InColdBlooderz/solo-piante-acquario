// Carica plants.json, genera la galleria e gestisce filtri + ricerca
const plantListEl = document.getElementById('plant-list');
const searchEl = document.getElementById('search');
const diffEl = document.getElementById('filter-difficulty');
const typeEl = document.getElementById('filter-type');

let plants = [];

async function loadPlants(){
  try{
    const res = await fetch('data/plants.json');
    plants = await res.json();
    renderPlants(plants);
    updateCartCount();
    document.getElementById('year').innerText = new Date().getFullYear();
  }catch(err){
    console.error('Errore caricamento plants.json', err);
    plantListEl.innerHTML = '<p>Impossibile caricare il catalogo.</p>';
  }
}

function slugToImg(slug){
  return `assets/img/plants/${slug}.jpg`;
}

function renderPlants(list){
  if(!plantListEl) return;
  plantListEl.innerHTML = '';
  if(list.length === 0){
    plantListEl.innerHTML = '<p>Nessuna pianta trovata.</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.innerHTML = `
      <img src="${slugToImg(p.slug)}" alt="${p.nome}" onerror="this.src='assets/img/placeholder.jpg'"/>
      <h3>${p.nome}</h3>
      <p class="desc">${p.descrizione}</p>
      <div class="plant-meta">
        <small>${p.difficolta}</small>
        <small>€${(p.prezzo).toFixed(2)}</small>
      </div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
        <button class="btn" onclick="viewPlant('${p.slug}')">Scheda</button>
        <button class="btn primary" onclick="addToCart('${p.slug}')">Aggiungi</button>
      </div>
    `;
    plantListEl.appendChild(card);
  });
}

function filterAndSearch(){
  const q = (searchEl.value || '').toLowerCase();
  const diff = (diffEl.value || '');
  const type = (typeEl.value || '');

  const filtered = plants.filter(p => {
    const matchQ = p.nome.toLowerCase().includes(q) || p.descrizione.toLowerCase().includes(q);
    const matchDiff = diff ? p.difficolta === diff : true;
    const matchType = type ? p.tipo.includes(type) || p.tipo === type : true;
    return matchQ && matchDiff && matchType;
  });
  renderPlants(filtered);
}

searchEl?.addEventListener('input', filterAndSearch);
diffEl?.addEventListener('change', filterAndSearch);
typeEl?.addEventListener('change', filterAndSearch);

// Visualizza la scheda: genera una pagina temporanea con i dettagli (apre new tab)
function viewPlant(slug){
  const p = plants.find(x => x.slug === slug);
  if(!p) return alert('Scheda non trovata');
  const w = window.open('', '_blank');
  const html = `
    <html><head>
      <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${p.nome}</title>
      <link rel="stylesheet" href="/assets/css/style.css">
    </head>
    <body style="padding:20px">
      <a href="/index.html">← Torna al catalogo</a>
      <h1>${p.nome}</h1>
      <img src="/assets/img/plants/${p.slug}.jpg" style="max-width:360px;width:100%" onerror="this.src='/assets/img/placeholder.jpg'"/>
      <p><strong>Item No:</strong> ${p.item_no || ''}</p>
      <p><strong>Difficoltà:</strong> ${p.difficolta}</p>
      <p><strong>Tipo:</strong> ${p.tipo}</p>
      <p>${p.descrizione}</p>
      <p><strong>Prezzo:</strong> €${p.prezzo.toFixed(2)}</p>
      <div style="margin-top:10px">
        <button onclick="window.opener.addToCart('${p.slug}'); alert('Aggiunta al carrello');" class="btn primary">Aggiungi al carrello</button>
      </div>
    </body></html>
  `;
  w.document.write(html);
  w.document.close();
}

/* Carrello: funzione globale addToCart disponibile anche su index e schede */
window.addToCart = function(slug){
  const p = plants.find(x => x.slug === slug);
  if(!p) return alert('Prodotto non trovato!');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(i => i.slug === slug);
  if(idx === -1) cart.push({ slug: slug, nome: p.nome, prezzo: p.prezzo, qty: 1 });
  else cart[idx].qty += 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${p.nome} aggiunta al carrello`);
};

function updateCartCount(){
  const countEl = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  if(countEl) countEl.innerText = totalQty;
}

// Inizializza
loadPlants();
