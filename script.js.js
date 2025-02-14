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
// Adaugă jucătorul în array cu rating maxim
  players.push({ name, rating: 10, participated: 0, cancelledLate: 0 });

  function updateRatings() {
    players.forEach(player => {
      // Calculăm ratingul: +1 pentru fiecare participare, -2 pentru fiecare anulare târzie
      player.rating = Math.max(
        0,
        10 + player.participated - (player.cancelledLate * 2) // Rating minim 0
      );
    });

    // Salvează datele actualizate în LocalStorage
    localStorage.setItem("players", JSON.stringify(players));
  }

  // Funcție pentru a marca participarea unui jucător
  function markParticipation(name) {
    const player = players.find(p => p.name === name);
    if (player) {
      player.participated += 1;
      updateRatings();
      updateLists();
      alert(`${name} a fost marcat ca participant.`);
    }
  }

// Funcție pentru a marca o anulare târzie
  function markLateCancellation(name) {
    const player = players.find(p => p.name === name);
    if (player) {
      player.cancelledLate += 1;
      updateRatings();
      updateLists();
      alert(`${name} a fost marcat cu o anulare târzie.`);
    }
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

  confirmedPlayers.forEach((player) => {
    const li = document.createElement("li");

    li.textContent = ${player.name} - Rating: ${player.rating};

    // Buton pentru marcarea participării
    const participateBtn = document.createElement("button");
    participateBtn.textContent = "Marchează Participare";
    participateBtn.style.marginLeft = "10px";
    participateBtn.onclick = () => markParticipation(player.name);

    // Buton pentru marcarea unei anulări târzii
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Anulare Târzie";
    cancelBtn.style.marginLeft = "10px";
    cancelBtn.onclick = () => markLateCancellation(player.name);

    li.appendChild(participateBtn);
    li.appendChild(cancelBtn);

    confirmedList.appendChild(li);
  });

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
// Referințe la elementele din DOM
const chatForm = document.getElementById("chatForm");
const messagesDiv = document.getElementById("messages");

// Ascultă evenimentul de trimitere a mesajului
chatForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Preia numele și mesajul din formular
  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!username || !message) {
    alert("Te rugăm să completezi toate câmpurile.");
    return;
  }

  // Salvează mesajul în Firebase Realtime Database
  firebase.database().ref("messages").push({
    username,
    message,
    timestamp: Date.now()
  });

  // Golește câmpul pentru mesaj
  document.getElementById("message").value = "";
});

// Ascultă modificările din baza de date și actualizează chat-ul
firebase.database().ref("messages").on("child_added", function (snapshot) {
  const data = snapshot.val();

  // Creează un element nou pentru mesaj
  const messageElement = document.createElement("div");
  messageElement.textContent = ${data.username}: ${data.message};

  // Adaugă mesajul la div-ul de mesaje
  messagesDiv.appendChild(messageElement);

  // Derulează automat la ultimul mesaj
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
// Formular pentru modificarea manuală a ratingului
const manualRatingForm = document.getElementById("manualRatingForm");

manualRatingForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("playerName").value.trim();
  const newRating = parseFloat(document.getElementById("newRating").value);

  if (!name  isNaN(newRating)  newRating < 0 || newRating > 10) {
    alert("Te rugăm să introduci un nume valid și un rating între 0 și 10.");
    return;
  }

  const player = players.find(p => p.name === name);

  if (player) {
    player.rating = newRating;
    updateRatings();
    updateLists();
    alert(`Rating-ul lui ${name} a fost actualizat la ${newRating}.`);

    // Resetează formularul
    manualRatingForm.reset();

  } else {
    alert(`Jucătorul ${name} nu a fost găsit.`);
  }
});