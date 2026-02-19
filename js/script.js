document.addEventListener("DOMContentLoaded", function () {
  // --- ÉLÉMENTS DU DOM ---
  const mainTitle = document.getElementById("main-title");
  const paragraphs = document.querySelectorAll("#main-content p");
  const modalTitle = document.querySelector("#secret-modal h2");
  const modalText = document.querySelector("#secret-modal p");
  const characterBtn = document.getElementById("choose-character");
  const languageSelect = document.getElementById("language-select");

  // --- OBJET DE TRADUCTION ---
  const translations = {
    fr: {
      title: "Bienvenue à Alcatraz : L'île de l'impossible",
      p1: `Nous sommes en 1962, au cœur de l'une des prisons les plus redoutées et les mieux gardées au monde :
                <span class="highlight">Alcatraz</span>. Située sur une île isolée dans la baie de San Francisco, elle est
                réputée pour être inéluctable. Les détenus qui y sont envoyés sont considérés comme les criminels les plus
                dangereux des États-Unis. <span class="highlight">Vous</span> êtes l'un de ces prisonniers. Chaque mouvement est surveillé, chaque
                minute est cruciale, et le moindre faux pas pourrait sceller votre destin. Alcatraz regorge de secrets,
                et tous les indices ne sont pas ce qu'ils semblent être. Alors méfiez-vous!`,
      p2: `Votre objectif : Déjouez les gardes, élucidez les mystères de la prison, et échappez-vous avant qu'il ne
                soit trop tard. Alcatraz n'a jamais été conçu pour laisser quelqu'un s'enfuir... mais serez-vous
                l'exception ?`,
      modalTitle: "Message secret",
      modalText: `Vous avez trouvé un indice caché ! La combinaison du casier 42 est <span class="highlight">3-7-9-1</span>. 
                Gardez cette information précieusement pour votre évasion.`,
      btn: "Choisissez votre personnage",
    },
    en: {
      title: "Welcome to Alcatraz: The Island of No Return",
      p1: `The year is 1962, in the heart of one of the world's most feared and high-security prisons:
                <span class="highlight">Alcatraz</span>. Located on an isolated island in the San Francisco Bay, it is
                renowned for being inescapable. The inmates sent here are considered the most dangerous criminals 
                in the United States. <span class="highlight">You</span> are one of these prisoners. Every move is watched, every
                minute is crucial, and the slightest misstep could seal your fate. Alcatraz is full of secrets,
                and not all clues are what they seem. So, beware!`,
      p2: `Your objective: Outsmart the guards, unravel the mysteries of the prison, and escape before it's 
                too late. Alcatraz was never designed to let anyone leave... but will you be 
                the exception?`,
      modalTitle: "Secret Message",
      modalText: `You found a hidden clue! The combination for locker 42 is <span class="highlight">3-7-9-1</span>. 
                Keep this information safe for your escape.`,
      btn: "Choose your character",
    },
    es: {
      title: "Bienvenidos a Alcatraz: La isla de lo imposible",
      p1: `Estamos en 1962, en el corazón de una de las prisiones más temidas y mejor guardadas del mundo:
                <span class="highlight">Alcatraz</span>. Situada en una isla aislada en la bahía de San Francisco, es
                famosa por ser ineludible. Los reclusos enviados aquí son considerados los criminales más
                peligrosos de los Estados Unidos. <span class="highlight">Tú</span> eres uno de esos prisioneros. Cada movimiento es vigilado, cada
                minuto es crucial, y el más mínimo error podría sellar tu destino. ¡Cuidado!`,
      p2: `Tu objetivo: Burla a los guardias, aclara los misterios de la prisión y escapa antes de que sea 
                demasiado tarde. Alcatraz nunca fue diseñada para dejar que alguien escape... ¿serás tú 
                la excepción?`,
      modalTitle: "Mensaje secreto",
      modalText: `¡Has encontrado una pista oculta! La combinación de la taquilla 42 es <span class="highlight">3-7-9-1</span>. 
                Guarda esta información con cuidado para tu escape.`,
      btn: "Elige tu personaje",
    },
  };

  // --- FONCTION MACHINE À ÉCRIRE ---
  let i = 0;
  function typeWriter(text) {
    if (i < text.length) {
      mainTitle.textContent += text.charAt(i);
      i++;
      setTimeout(() => typeWriter(text), 50);
    }
  }

  // --- MISE À JOUR DE LA LANGUE ---
  function updateLanguage(lang) {
    const data = translations[lang];
    mainTitle.textContent = "";
    i = 0;
    typeWriter(data.title);
    paragraphs[0].innerHTML = data.p1;
    paragraphs[1].innerHTML = data.p2;
    modalTitle.textContent = data.modalTitle;
    modalText.innerHTML = data.modalText;
    characterBtn.textContent = data.btn;
    document.documentElement.lang = lang;
  }

  // --- ÉCOUTEUR AVEC SAUVEGARDE ---
  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      const selectedLang = this.value;
      localStorage.setItem("userLang", selectedLang); // Sauvegarde le choix
      updateLanguage(selectedLang);
    });
  }

  // --- CHARGEMENT INITIAL (Vérifie le localStorage) ---
  const savedLang = localStorage.getItem("userLang") || "fr";
  if (languageSelect) {
    languageSelect.value = savedLang; // Ajuste le menu visuellement
  }
  updateLanguage(savedLang);
});

// --- GESTION DE LA MODALE ---
const secretButton = document.getElementById("secret-button");
const secretModal = document.getElementById("secret-modal");
const closeModal = document.getElementById("close-modal");

if (secretButton) {
  secretButton.addEventListener(
    "click",
    () => (secretModal.style.display = "flex"),
  );
}
if (closeModal) {
  closeModal.addEventListener(
    "click",
    () => (secretModal.style.display = "none"),
  );
}
window.addEventListener("click", (e) => {
  if (e.target === secretModal) secretModal.style.display = "none";
});

// --- KONAMI CODE ---
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      alert("Code secret activé ! Indice cellule 103 débloqué.");
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});
