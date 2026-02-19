const uiTranslations = {
  fr: {
    headerH1: "ARCHIVES D'ALCATRAZ",
    mainTitle: "Dossiers Confidentiels - Détenus Célèbres",
    viewProfile: "Voir le dossier complet",
    arrivalDate: "Date d'arrivée à Alcatraz:",
    crimesTitle: "Crimes commis:",
    staffNotes: "Notes du personnel:",
    skillsTitle: "Compétences évaluées:",
    skills: ["Intelligence", "Force physique", "Discrétion", "Leadership"],
    statsLabels: ["Âge", "Taille", "Poids", "QI"],
    warning: "Attention: Ce détenu est considéré comme extrêmement dangereux.",
    selectDefault: "Choisis ton évadé.",
    modalDefaultTitle: "Dossier du détenu",
  },
  en: {
    headerH1: "ALCATRAZ ARCHIVES",
    mainTitle: "Confidential Files - Famous Inmates",
    viewProfile: "View full file",
    arrivalDate: "Arrival date at Alcatraz:",
    crimesTitle: "Crimes committed:",
    staffNotes: "Staff notes:",
    skillsTitle: "Assessed skills:",
    skills: ["Intelligence", "Physical Strength", "Stealth", "Leadership"],
    statsLabels: ["Age", "Height", "Weight", "IQ"],
    warning: "Warning: This inmate is considered extremely dangerous.",
    selectDefault: "Pick your fugitive.",
    modalDefaultTitle: "Inmate File",
  },
  es: {
    headerH1: "ARCHIVOS DE ALCATRAZ",
    mainTitle: "Expedientes Confidenciales - Detenidos Famosos",
    viewProfile: "Ver expediente completo",
    arrivalDate: "Fecha de llegada a Alcatraz:",
    crimesTitle: "Delitos cometidos:",
    staffNotes: "Notas del personal:",
    skillsTitle: "Habilidades evaluadas:",
    skills: ["Inteligencia", "Fuerza física", "Sigilo", "Liderazgo"],
    statsLabels: ["Edad", "Altura", "Peso", "CI"],
    warning: "Atención: Este detenido es considerado extremadamente peligroso.",
    selectDefault: "Elige a tu fugitivo.",
    modalDefaultTitle: "Expediente del detenido",
  },
};

const detainees = [
  {
    id: 1,
    name: "Frank Morris",
    number: "AZ1441",
    image: "./images/Frank_Morris.jpg",
    translations: {
      fr: {
        bio: "Extrêmement intelligent (QI 133). Expert en planification.",
        crimes: ["Braquage de banque", "Vol de voiture"],
        arrivalDate: "18 janvier 1960",
        notes: "Très méticuleux.",
      },
      en: {
        bio: "Highly intelligent (IQ 133). Expert in planning.",
        crimes: ["Bank Robbery", "Car Theft"],
        arrivalDate: "January 18, 1960",
        notes: "Very meticulous.",
      },
      es: {
        bio: "Extremadamente inteligente (CI 133). Experto en planificación.",
        crimes: ["Atraco al banco", "Robo de auto"],
        arrivalDate: "18 de enero de 1960",
        notes: "Muy meticuloso.",
      },
    },
    skills: { intelligence: 95, strength: 65, stealth: 85, leadership: 90 },
    stats: { age: 35, height: "173 cm", weight: "70 kg", QI: 133 },
  },
  {
    id: 2,
    name: "John Anglin",
    number: "AZ1476",
    image: "./images/John_Anglin.jpg",
    translations: {
      fr: {
        bio: "Expert en évasion et braquage. Travaille en duo.",
        crimes: ["Braquage de banque", "Évasion"],
        arrivalDate: "21 janvier 1960",
        notes: "Trouve les failles de sécurité.",
      },
      en: {
        bio: "Escape and robbery expert. Works in a duo.",
        crimes: ["Bank Robbery", "Escape"],
        arrivalDate: "January 21, 1960",
        notes: "Finds security flaws.",
      },
      es: {
        bio: "Experto en fugas y robos. Trabaja en dúo.",
        crimes: ["Atraco al banco", "Fuga"],
        arrivalDate: "21 de enero de 1960",
        notes: "Encuentra fallas de seguridad.",
      },
    },
    skills: { intelligence: 75, strength: 80, stealth: 90, leadership: 60 },
    stats: { age: 32, height: "178 cm", weight: "75 kg", QI: 118 },
  },
  {
    id: 3,
    name: "Clarence Anglin",
    number: "AZ1485",
    image: "./images/Clarence_Anglin.png",
    translations: {
      fr: {
        bio: "Déterminé et audacieux. Très résistant physiquement.",
        crimes: ["Évasion multiple"],
        arrivalDate: "10 janvier 1961",
        notes: "Le plus physique des trois.",
      },
      en: {
        bio: "Determined and bold. Very physically resilient.",
        crimes: ["Multiple Escapes"],
        arrivalDate: "January 10, 1961",
        notes: "The most physical of the three.",
      },
      es: {
        bio: "Decidido y audaz. Muy resistente físicamente.",
        crimes: ["Fugas múltiples"],
        arrivalDate: "10 de enero de 1961",
        notes: "El más físico de los tres.",
      },
    },
    skills: { intelligence: 70, strength: 85, stealth: 80, leadership: 65 },
    stats: { age: 31, height: "180 cm", weight: "77 kg", QI: 115 },
  },
];

const currentLang = localStorage.getItem("userLang") || "fr";

function generateDetaineeCards() {
  const container = document.getElementById("detaineesContainer");
  if (!container) return;
  const ui = uiTranslations[currentLang];
  container.innerHTML = "";

  detainees.forEach((detainee, index) => {
    const text = detainee.translations[currentLang];
    const card = document.createElement("div");
    card.className = "detainee-card animated";
    card.style.animationDelay = `${index * 0.2}s`;
    card.innerHTML = `
            <div class="prisoner-number">${detainee.number}</div>
            <div class="detainee-img"><img src="${detainee.image}" alt="${detainee.name}"></div>
            <div class="detainee-info">
                <h3 style="text-align: center;">${detainee.name}</h3>
                <p>${text.bio}</p>
                <button class="action-btn view-profile" data-id="${detainee.id}">${ui.viewProfile}</button>
            </div>
        `;
    container.appendChild(card);
  });

  document.querySelectorAll(".view-profile").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      openDetailModal(parseInt(e.target.dataset.id)),
    );
  });
}

function openDetailModal(id) {
  const detainee = detainees.find((d) => d.id === id);
  if (!detainee) return;
  const ui = uiTranslations[currentLang];
  const text = detainee.translations[currentLang];

  document.getElementById("modalTitle").textContent =
    `Dossier #${detainee.number}: ${detainee.name}`;
  document.getElementById("modalImage").src = detainee.image;
  document.getElementById("modalContent").innerHTML = `
        <p><strong>${ui.arrivalDate}</strong> ${text.arrivalDate}</p>
        <h4>${ui.crimesTitle}</h4>
        <ul>${text.crimes.map((c) => `<li>${c}</li>`).join("")}</ul>
        <p>${text.bio}</p>
        <div class="stats-container">
            <div class="stat-box"><div class="stat-value">${detainee.stats.age}</div><div class="stat-label">${ui.statsLabels[0]}</div></div>
            <div class="stat-box"><div class="stat-value">${detainee.stats.QI}</div><div class="stat-label">${ui.statsLabels[3]}</div></div>
        </div>
        <p class="warning-text" style="color:#ff6b6b; font-style:italic; margin-top:10px;">${ui.warning}</p>
    `;
  document.getElementById("detaineeModal").style.display = "flex";
}

// --- INITIALISATION ---
document.addEventListener("DOMContentLoaded", function () {
  const ui = uiTranslations[currentLang];
  document.documentElement.lang = currentLang;

  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = ui.headerH1;

  const h2 = document.querySelector("h2");
  if (h2) {
    let i = 0;
    const targetText = ui.mainTitle;
    h2.textContent = "";
    function typeWriter() {
      if (i < targetText.length) {
        h2.textContent += targetText.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }
    typeWriter();
  }

  generateDetaineeCards();

  // --- CRÉATION DU MENU DÉROULANT (SANS LABEL) ---
  const contentDiv = document.querySelector(".content");
  if (contentDiv) {
    const menuWrapper = document.createElement("div");
    menuWrapper.style.cssText =
      "margin-top: 40px; text-align: center; border-top: 1px solid #444; padding-top: 20px;";

    const select = document.createElement("select");
    select.style.cssText =
      "padding: 12px 20px; background: #222; color: #ffc107; border: 2px solid #ffc107; border-radius: 4px; cursor: pointer; font-family: inherit; font-weight: bold; font-size: 1.1rem;";

    const defaultOpt = document.createElement("option");
    defaultOpt.textContent = ui.selectDefault;
    defaultOpt.value = "";
    select.appendChild(defaultOpt);

    detainees.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.name;
      select.appendChild(opt);
    });

    select.addEventListener("change", function () {
      if (this.value) {
        localStorage.setItem("selectedCharacterId", this.value);
        window.location.href = "etape01.html";
      }
    });

    menuWrapper.appendChild(select);
    contentDiv.appendChild(menuWrapper);
  }
});

// Fermeture modale
const closeBtn = document.getElementById("closeModal");
if (closeBtn) {
  closeBtn.onclick = () =>
    (document.getElementById("detaineeModal").style.display = "none");
}

window.onclick = (e) => {
  const modal = document.getElementById("detaineeModal");
  if (e.target === modal) modal.style.display = "none";
};
