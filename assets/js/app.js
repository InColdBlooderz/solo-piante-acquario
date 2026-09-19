let plantsData = [];

async function loadPlants() {
  try {
    // Sostituito con il percorso corretto partendo dalla radice del sito
    const res = await fetch("data/plants.json?v=" + Date.now());
    if (!res.ok) throw new Error(`Errore caricamento: ${res.status}`);
    plantsData = await res.json();
    render(plantsData);
  } catch (error) {
    console.error("Errore nel caricamento del file JSON:", error);
    document.getElementById("plant-list").innerHTML = "<p>Impossibile caricare le piante.</p>";
  }
}

function render(data) {
  const container = document.getElementById("plant-list");

  container.innerHTML = data.map(p => {
    // Gestione del prezzo dinamico (se manca nel JSON assegna un prezzo fisso es. 6.50)
    const prezzo = p.price ? p.price : 6.50;

    return `
      <div class="plant-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p><strong>Tipo:</strong> ${p.type}</p>
        <p><strong>Difficoltà:</strong> ${p.difficulty}</p>
        <p class="price" style="font-weight: bold; margin: 10px 0;">€ ${prezzo.toFixed(2)}</p>
        
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <a href="plant.html?id=${p.id}" class="btn" style="flex: 1; text-align: center;">Dettagli</a>
          <!-- NUOVO PULSANTE PER IL CARRELLO -->
          <button onclick="aggiungiAlCarrello(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${prezzo}, '${p.image}')" class="btn btn-cart" style="flex: 1; cursor: pointer;">Aggiungi</button>
        </div>
      </div>
    `;
  }).join("");
}

/* CARRELLO (SALVATAGGIO IN MEMORIA) */
function aggiungiAlCarrello(id, name, price, image) {
  let carrello = JSON.parse(localStorage.getItem('carrello')) || [];
  const esiste = carrello.find(item => item.id === id);

  if (esiste) {
    esiste.quantita += 1;
  } else {
    carrello.push({ id, nome: name, prezzo: price, immagine: image, quantita: 1 });
  }

  localStorage.setItem('carrello', JSON.stringify(carrello));
  alert(`"${name}" aggiunto al carrello!`);
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  applicaFiltri();
});

/* SORT */
document.getElementById("sort").addEventListener("change", e => {
  applicaFiltri();
});

/* FILTER DIFFICULTY */
document.getElementById("difficulty").addEventListener("change", e => {
  applicaFiltri();
});

/* FILTER POSITION (Sincronizzato con il tuo HTML) */
document.getElementById("position").addEventListener("change", e => {
  applicaFiltri();
});

/* FUNZIONE DI FILTRAGGIO UNIFICATA */
function applicaFiltri() {
  const cercaVal = document.getElementById("search").value.toLowerCase();
  const diffVal = document.getElementById("difficulty").value;
  const posVal = document.getElementById("position").value;
  const sortVal = document.getElementById("sort").value;

  // Mappa l'italiano dell'HTML con l'inglese presente nel tuo plants.json
  const mappaDifficolta = { "Facile": "Easy", "Media": "Medium", "Difficile": "Advanced" };

  let filtered = plantsData.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(cercaVal);
    
    const diffTarget = mappaDifficolta[diffVal] || "";
    const matchDiff = !diffVal || p.difficulty === diffTarget;
    
    // Filtra per posizione (Foreground, Midground, Background, Moss)
    const matchPos = !posVal || p.position === posVal;

    return matchSearch && matchDiff && matchPos;
  });

  // Applica l'ordinamento alfabetico richiesto
  if (sortVal === "az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  render(filtered);
}

loadPlants();
