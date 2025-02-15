// Array pentru stocarea jucătorilor
let players = JSON.parse(localStorage.getItem("players")) || [];

// Funcție pentru ștergerea tuturor datelor (Resetare)
function resetData() {
  if (confirm("Ești sigur că vrei să ștergi toate datele?")) {
    players = [];
    localStorage.removeItem("players");
    updateLists();
    alert("Datele au fost șterse.");
  }
}

// Funcție pentru actualizarea ratingurilor
function updateRatings() {
  players.forEach(player => {
    player.rating = Math.max(
      0,
      10 + player.participated - (player.cancelledLate * 2) // Exemplu: calcul rating
    );
  });
  localStorage.setItem("players", JSON.stringify(players));
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
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbujSWfrzBvyxbGQGgKonDUFldHGRsy7g",
  authDomain: "oldboysclub-76e80.firebaseapp.com",
  projectId: "oldboysclub-76e80",
  storageBucket: "oldboysclub-76e80.firebasestorage.app",
  messagingSenderId: "1038529572164",
  appId: "1:1038529572164:web:763807b37a33d29b21fb11",
  measurementId: "G-60GM61XD0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);