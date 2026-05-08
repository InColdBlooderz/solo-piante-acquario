let plantsData = [];

async function loadPlants() {
  const res = await fetch("data/plants.json");
  plantsData = await res.json();
  render(plantsData);
}

function render(data) {
  const container = document.getElementById("plant-list");

  container.innerHTML = data.map(p => `
    <div class="plant-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.type}</p>
      <p>${p.difficulty}</p>
      <a href="plant.html?id=${p.id}" class="btn">Dettagli</a>
    </div>
  `).join("");
}

/* SEARCH */
document.getElementById("search").addEventListener("input", e => {
  const val = e.target.value.toLowerCase();
  const filtered = plantsData.filter(p =>
    p.name.toLowerCase().includes(val)
  );
  render(filtered);
});

/* SORT */
document.getElementById("sort").addEventListener("change", e => {
  let sorted = [...plantsData];

  if (e.target.value === "az") {
    sorted.sort((a,b) => a.name.localeCompare(b.name));
  } else {
    sorted.sort((a,b) => b.name.localeCompare(a.name));
  }

  render(sorted);
});

/* FILTER DIFFICULTY */
document.getElementById("difficulty").addEventListener("change", e => {
  const val = e.target.value;
  const filtered = val
    ? plantsData.filter(p => p.difficulty === val)
    : plantsData;

  render(filtered);
});

/* FILTER TYPE */
document.getElementById("type").addEventListener("change", e => {
  const val = e.target.value;
  const filtered = val
    ? plantsData.filter(p => p.type === val)
    : plantsData;

  render(filtered);
});

loadPlants();