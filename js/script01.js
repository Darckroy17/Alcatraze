let isDarkMode = true;
let musicPlaying = false;

document.addEventListener("DOMContentLoaded", () => {
  // 1. RÉCUPÉRATION (Via localStorage comme ton script.js)
  const savedLang = localStorage.getItem("userLang") || "fr";

  // 2. APPLICATION DE LA TRADUCTION
  applyTranslations(savedLang);

  // 3. LANCEMENT DES AUTRES MODULES
  setupControlButtons();
  updateTime();
  setInterval(updateTime, 1000);
  checkDarkModePreference();
  setupPrisonerListInteractions();
  setupModals();
  initializeGlobalTimer();
  initializePersistentMusic();
  initializeAmbientSound();
  setupPageUnloadHandler();
});

// --- OBJET DE TRADUCTION DU JEU ---
const translations = {
  fr: {
    title: "Transfert de Prisonnier",
    instrTitle: "Instructions",
    instrText:
      "Le directeur Monk Ashow du pénitencier d'Atlanta n'en peut plus de ces sept détenus : Alban, Alex, Fuji, Phil, Tarek, Théo et Tony tentent sans cesse de se faire la malle. Avec le juge Itsu, ils décident de les envoyer-dans une prison dont personne ne s'évade : ALCATRAZ.",
    objTitle: "Objectif",
    objText: "identifier les 7 prisonniers transférés",
    hintBtn: "Afficher un indice",
    choiceTitle: "Faites votre choix",
    listTitle: "Liste de prisonniers",
    chooseBtn: "Choisir cette liste",
    hintModalTitle: "Indice",
    hintModalText:
      "Regardez attentivement les noms et prénoms de chaque prisonnier. Ils pourraient former un message caché.",
    modeClair: "Mode Clair",
    modeSombre: "Mode Sombre",
    musiqueOn: "🔈 Activer la musique",
    musiqueOff: "🔊 Couper la musique",
  },
  en: {
    title: "Prisoner Transfer",
    instrTitle: "Instructions",
    instrText:
      "Warden Monk Ashow of Atlanta Penitentiary has had enough of these seven inmates: Alban, Alex, Fuji, Phil, Tarek, Théo, and Tony are constantly trying to escape. With Judge Itsu, they decide to send them to a prison no one escapes from: ALCATRAZ.",
    objTitle: "Objective",
    objText: "Identify the 7 transferred prisoners",
    hintBtn: "Show a hint",
    choiceTitle: "Make your choice",
    listTitle: "Prisoner List",
    chooseBtn: "Choose this list",
    hintModalTitle: "Hint",
    hintModalText:
      "Look closely at the first and last names of each prisoner. They might form a hidden message.",
    modeClair: "Light Mode",
    modeSombre: "Dark Mode",
    musiqueOn: "🔈 Turn music on",
    musiqueOff: "🔊 Turn music off",
  },
  es: {
    title: "Traslado de Prisioneros",
    instrTitle: "Instrucciones",
    instrText:
      "El alcaide Monk Ashow de la penitenciaría de Atlanta está harto de estos siete reclusos: Alban, Alex, Fuji, Phil, Tarek, Théo y Tony intentan escapar constantemente. Con el juez Itsu, deciden enviarlos a una prisión de la que nadie escapa: ALCATRAZ.",
    objTitle: "Objetivo",
    objText: "Identificar a los 7 prisioneros trasladados",
    hintBtn: "Mostrar una pista",
    choiceTitle: "Haz tu elección",
    listTitle: "Lista de prisioneros",
    chooseBtn: "Elegir esta lista",
    hintModalTitle: "Pista",
    hintModalText:
      "Mira atentamente los nombres y apellidos de cada prisionero. Podrían formar un mensaje oculto.",
    modeClair: "Modo Claro",
    modeSombre: "Modo Oscuro",
    musiqueOn: "🔈 Activar música",
    musiqueOff: "🔊 Desactivar música",
  },
};

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  // Éléments principaux
  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = t.title;

  const sections = document.querySelectorAll(".audio-section");
  if (sections.length >= 2) {
    const h3_1 = sections[0].querySelector("h3");
    const p_1 = sections[0].querySelector("p");
    const h3_2 = sections[1].querySelector("h3");
    const p_2 = sections[1].querySelector("p");
    if (h3_1) h3_1.textContent = t.instrTitle;
    if (p_1) p_1.textContent = t.instrText;
    if (h3_2) h3_2.textContent = t.objTitle;
    if (p_2) p_2.textContent = t.objText;
  }

  const hintBtn = document.getElementById("hintButton");
  if (hintBtn) hintBtn.textContent = t.hintBtn;

  const choiceH2 = document.querySelector(".container.fade-in-delay-3 h2");
  if (choiceH2) choiceH2.textContent = t.choiceTitle;

  document.querySelectorAll(".choice-box").forEach((box, index) => {
    const title = box.querySelector("h3");
    const btn = box.querySelector(".btn");
    if (title) title.textContent = `${t.listTitle} #${index + 1}`;
    if (btn) btn.textContent = t.chooseBtn;
  });

  // MISE À JOUR DES TEXTES DES BOUTONS DE CONTRÔLE
  updateControlTexts(lang);
}

function updateControlTexts(lang) {
  const t = translations[lang];
  const dmBtn = document.getElementById("dark-mode-toggle");
  const muBtn = document.getElementById("music-toggle");

  if (dmBtn) {
    dmBtn.textContent = document.body.classList.contains("light-mode")
      ? t.modeSombre
      : t.modeClair;
  }

  if (muBtn) {
    muBtn.textContent = musicPlaying ? t.musiqueOff : t.musiqueOn;
  }
}

// --- GESTION DARK MODE ---
function toggleDarkMode() {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  sessionStorage.setItem("darkMode", isLight ? "light" : "dark");

  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

function checkDarkModePreference() {
  if (sessionStorage.getItem("darkMode") === "light") {
    document.body.classList.add("light-mode");
  }
  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

// --- GESTION MUSIQUE ---
function toggleMusic() {
  const bgm = document.getElementById("backgroundMusic");
  if (!bgm) return;
  musicPlaying = !musicPlaying;
  sessionStorage.setItem("escapeRoomMusicPlaying", musicPlaying);
  musicPlaying ? bgm.play() : bgm.pause();

  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

// --- AUTRES FONCTIONS (Inchangées mais nécessaires) ---
function setupControlButtons() {
  const dm = document.getElementById("dark-mode-toggle");
  const mu = document.getElementById("music-toggle");
  if (dm) dm.onclick = toggleDarkMode;
  if (mu) mu.onclick = toggleMusic;
}

function updateTime() {
  const clock = document.getElementById("clock");
  const dateDisp = document.getElementById("date");
  if (!clock || !dateDisp) return;
  const now = new Date();
  const currentLang = localStorage.getItem("userLang") || "fr";
  const locale =
    currentLang === "en" ? "en-US" : currentLang === "es" ? "es-ES" : "fr-FR";
  clock.textContent = now.toLocaleTimeString(locale, { hour12: false });
  dateDisp.textContent = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}

function initializeGlobalTimer() {
  const timerElement = document.getElementById("time-remaining");
  const progressBar = document.getElementById("progress-bar");
  if (!timerElement || !progressBar) return;
  const totalTime = 3600;
  let timeLeft;
  const savedStart = sessionStorage.getItem("escapeRoomStartTime");
  const now = Date.now();
  if (savedStart) {
    const elapsed = Math.floor((now - parseInt(savedStart)) / 1000);
    timeLeft = Math.max(0, totalTime - elapsed);
  } else {
    timeLeft = totalTime;
    sessionStorage.setItem("escapeRoomStartTime", now.toString());
  }
  const interval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(interval);
      sessionStorage.removeItem("escapeRoomStartTime");
      window.location.href = "echec.html";
      return;
    }
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerElement.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    progressBar.style.width = `${(timeLeft / totalTime) * 100}%`;
  }, 1000);
}

function initializePersistentMusic() {
  if (sessionStorage.getItem("escapeRoomMusicPlaying") === "true") {
    musicPlaying = true;
    const bgm = document.getElementById("backgroundMusic");
    if (bgm) bgm.play().catch(() => {});
  }
  const lang = localStorage.getItem("userLang") || "fr";
  updateControlTexts(lang);
}

function setupModals() {
  const hb = document.getElementById("hintButton");
  const hm = document.getElementById("hintModal");
  if (hb && hm) hb.onclick = () => (hm.style.display = "block");
  document
    .querySelectorAll(".close")
    .forEach(
      (c) => (c.onclick = () => (c.closest(".modal").style.display = "none")),
    );
}

function setupPrisonerListInteractions() {
  document.querySelectorAll(".prisoner-list li").forEach((li) => {
    li.onclick = function () {
      this.style.color = "#ff9900";
    };
  });
}

function initializeAmbientSound() {
  const amb = document.getElementById("ambientSound");
  if (!amb) return;
  document.addEventListener("click", () => amb.play().catch(() => {}), {
    once: true,
  });
}

function setupPageUnloadHandler() {
  let internal = false;
  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => (internal = true));
  });
  window.makeChoice = (url) => {
    internal = true;
    window.location.href = url;
  };
}

function zoomImage(img) {
  const modal = document.getElementById("imageModal");
  const enlargedImg = document.getElementById("enlargedImage");
  if (modal && enlargedImg) {
    modal.style.display = "block";
    enlargedImg.src = img.src;
  }
}
