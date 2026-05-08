async function loadPlants() {
  try {
    const res = await fetch("data/plants.json");

    if (!res.ok) throw new Error("JSON non trovato");

    const plants = await res.json();

    const container = document.getElementById("plant-list");

    container.innerHTML = plants.map(p => `
      <div class="plant-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.type}</p>
        <p>${p.difficulty}</p>
        <a href="plant.html?id=${p.id}" class="btn">Dettagli</a>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
  }
}

loadPlants();