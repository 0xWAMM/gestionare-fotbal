// Array pentru stocarea jucătorilor (încărcăm datele din LocalStorage, dacă există)
let players = JSON.parse(localStorage.getItem("players")) || [];

// Referințe la elementele din DOM
const playerForm = document.getElementById("playerForm");
const confirmedList = document.getElementById("confirmedList");
const waitingList = document.getElementById("waitingList");

// Funcție pentru adăugarea unui jucător
playerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Preluăm valorile din formular
  const name = document.getElementById("name").value.trim();
  const rating = parseFloat(document.getElementById("rating").value);

  // Validare simplă
  if (!name  isNaN(rating)  rating < 1 || rating > 10) {
    alert("Te rugăm să introduci un nume valid și un rating între 1 și 10.");
    return;
  }

  // Adaugă jucătorul în array
  players.push({ name, rating });

  // Sortează jucătorii după rating descrescător
  players.sort((a, b) => b.rating - a.rating);

  // Salvează lista actualizată în LocalStorage
  localStorage.setItem("players", JSON.stringify(players));

  // Actualizează listele afișate
  updateLists();

  // Resetează formularul
  playerForm.reset();
});

// Funcție pentru actualizarea listelor afișate
function updateLists() {
  // Golim listele existente
  confirmedList.innerHTML = "";
  waitingList.innerHTML = "";

  // Separăm participanții confirmați și lista de rezervă
  const confirmedPlayers = players.slice(0, Math.min(14, players.length));
  const waitingPlayers = players.slice(14);

  // Afișăm participanții confirmați
  confirmedPlayers.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = ${player.name} - Rating: ${player.rating};
    confirmedList.appendChild(li);
  });

  // Afișăm lista de rezervă
  waitingPlayers.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = ${player.name} - Rating: ${player.rating};
    waitingList.appendChild(li);
  });
}

// Funcție pentru ștergerea tuturor datelor (Resetare)
function resetData() {
  if (confirm("Ești sigur că vrei să ștergi toate datele?")) {
    players = [];
    localStorage.removeItem("players");
    updateLists();
    alert("Datele au fost șterse.");
  }
}

// Inițializează listele la încărcarea paginii
updateLists();