let isEnglish = false;
let isDarkMode = true;
let musicPlaying = false;

document.addEventListener('DOMContentLoaded', function() {
    setupControlButtons();
    updateTime();
    setInterval(updateTime, 1000);
    checkDarkModePreference();
    checkLanguagePreference();
    setupPrisonerListInteractions();
    setupModals();
    initializeGlobalTimer();
    initializePersistentMusic();
    setupPageUnloadHandler();
});

function setupPageUnloadHandler() {
    let isInternalNavigation = false;
    
    document.addEventListener('click', function(event) {
        const target = event.target;
        const link = target.closest('a');
        
        if (link && link.href) {
            const url = new URL(link.href);
            const currentUrl = new URL(window.location.href);
            
            if (url.hostname === currentUrl.hostname && 
                (url.pathname.includes('etape') || 
                 url.pathname.includes('echec') || 
                 url.pathname.includes('victoire') ||
                 url.pathname.includes('index'))) {
                isInternalNavigation = true;
            }
        }
    });
    
    const originalMakeChoice = window.makeChoice;
    window.makeChoice = function(destination) {
        isInternalNavigation = true;
        return originalMakeChoice ? originalMakeChoice.call(this, destination) : null;
    };
    
    window.addEventListener('beforeunload', function(event) {
        if (!isInternalNavigation) {
            sessionStorage.removeItem('escapeRoomStartTime');
            sessionStorage.removeItem('escapeRoomMusicPlaying');
        }
        isInternalNavigation = false;
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            setTimeout(function() {
                if (document.visibilityState === 'hidden') {
                    const currentUrl = window.location.href;
                    const isGamePage = currentUrl.includes('etape') || 
                                     currentUrl.includes('echec') || 
                                     currentUrl.includes('victoire') ||
                                     currentUrl.includes('index');
                    
                    if (!isGamePage) {
                        sessionStorage.removeItem('escapeRoomStartTime');
                        sessionStorage.removeItem('escapeRoomMusicPlaying');
                    }
                }
            }, 5000);
        }
    });
}

function setupControlButtons() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const languageToggle = document.getElementById('toggle-lang');
    const musicToggle = document.getElementById('music-toggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
}

function initializePersistentMusic() {
    const savedMusicState = sessionStorage.getItem('escapeRoomMusicPlaying');
    if (savedMusicState === 'true') {
        musicPlaying = true;
        const backgroundMusic = document.getElementById('backgroundMusic');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.2;
            backgroundMusic.play()
                .catch(err => console.log('Impossible de jouer la musique:', err));
        }
    }
    updateMusicButtonText();
}

function toggleMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!backgroundMusic) return;
    
    musicPlaying = !musicPlaying;
    
    const currentUrl = window.location.href;
    const isGamePage = currentUrl.includes('etape') || 
                     currentUrl.includes('echec') || 
                     currentUrl.includes('victoire') ||
                     currentUrl.includes('index');
    
    if (isGamePage) {
        sessionStorage.setItem('escapeRoomMusicPlaying', musicPlaying.toString());
    }
    
    if (musicPlaying) {
        backgroundMusic.volume = 0.2;
        backgroundMusic.play()
            .catch(err => console.log('Impossible de jouer la musique:', err));
    } else {
        backgroundMusic.pause();
    }
    
    updateMusicButtonText();
}

function updateMusicButtonText() {
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.textContent = musicPlaying
            ? (isEnglish ? '🔊 Disable music' : '🔊 Désactiver la musique')
            : (isEnglish ? '🔈 Enable music' : '🔈 Activer la musique');
    }
}

function checkDarkModePreference() {
    if (sessionStorage.getItem('darkMode') === 'light') {
        toggleDarkMode();
    }
    updateDarkModeButtonText();
}

function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    isDarkMode = !document.body.classList.contains('light-mode');
    
    sessionStorage.setItem('darkMode', isDarkMode ? 'dark' : 'light');
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.textContent = isDarkMode 
            ? (isEnglish ? 'Light Mode' : 'Mode Clair')
            : (isEnglish ? 'Dark Mode' : 'Mode Sombre');
    }
}

function toggleLanguage() {
    isEnglish = !isEnglish;

    const languageToggle = document.getElementById('toggle-lang');
    if (languageToggle) {
        languageToggle.textContent = isEnglish ? 'Changer en Français' : 'Changer la langue';
    }
    
    updateUILanguage();
    sessionStorage.setItem('language', isEnglish ? 'en' : 'fr');
}

function updateUILanguage() {
    const h1 = document.querySelector('h1');
    const h2 = document.querySelector('h2');
    
    if (h1) h1.textContent = isEnglish ? 'Order brought to pinnacle' : 'L\'ordre porté au pinacle';
    if (h2) h2.textContent = isEnglish ? 'Make your choice' : 'Faites votre choix';

    const hintButton = document.getElementById('hintButton');
    if (hintButton) {
        hintButton.textContent = isEnglish ? 'Show a hint' : 'Afficher un indice';
    }
    
    updateMusicButtonText();
    
    const audioSections = document.querySelectorAll('.audio-section h3');
    if (audioSections.length >= 2) {
        audioSections[0].textContent = isEnglish ? 'Instructions' : 'Instructions';
        audioSections[1].textContent = isEnglish ? 'Objective' : 'Objectif';
    }

    const instructionText = document.querySelector('.audio-section p');
    if (instructionText) {
        instructionText.textContent = isEnglish 
            ? '"This PELICAN is not here by chance," whispers Tony. "I think I understand," replies Alban, passionate about birds and who speaks several languages. In the past, all the great seabirds like pelicans, gannets and albatrosses were indifferently called... "alcatraz". "The card therefore promises an "ALCATRAZ ESCAPE"." exclaims Alex. "Shh!" "There must be another hidden message," risks Theo, throwing himself on what will serve as his bed for the next thirty years. Lights out Tony, with his infallible visual memory and accustomed to analyzing heaps of data, will not fall asleep before having solved this mystery. Before dawn even breaks, his face lights up. Eureka! He has identified a character and discovered a new seven-letter word very promising...'
            : '« Ce PÉLICAN n\'est pas là par hasard, chuchote Tony. - Je crois comprendre, répond Alban, passionné d\'oiseaux et qui parle plusieurs langues. Autrefois, tous les grands oiseaux de mer comme les pélicans, les fous de Bassan et les albatros étaient nommés indifféremment... « alcatraz ». - La carte promet donc une « ÉVASION d\'ALCADRAZ ». s\'exclame Alex. - Chut ! - Il doit y avoir un autre message caché, risque Théo en se jetant sur ce qui lui servira de lit pour les trente prochaines années.› Extinction des feux Tony,à la ménoire visuelle infaillible et habitué à analyser des tas de données, ne s\'endormira pas avant d\'avoir percé ce mystère. Avant même que le jour ne se lève, son visage s\'illumine. Eurêka ! Il a identifié un personnage et découvert un nouveau mot de sept lettres très prometteur...';
    }

    const objectiveText = document.querySelectorAll('.audio-section p')[1];
    if (objectiveText) {
        objectiveText.textContent = isEnglish 
            ? 'identify the new card and discover the character identified by Tony.'
            : 'identifier la nouvelle carte et decouvrire le personage identifier par Tony.';
    }

    const choiceBoxes = document.querySelectorAll('.choice-box h3');
    const choiceTitles = [
        isEnglish ? 'Hologram list #1' : 'Liste d\'olograme #1',
        isEnglish ? 'Hologram list #2' : 'Liste d\'olograme #2',
        isEnglish ? 'Hologram list #3' : 'Liste d\'olograme #3'
    ];
    
    choiceBoxes.forEach((box, index) => {
        if (choiceTitles[index]) {
            box.textContent = choiceTitles[index];
        }
    });

    const listItems = document.querySelectorAll('.prisoner-list li');
    const translations = {
        fr: [
            '1.ALCAPONE, CALEPIN',
            '2. ALCAPONE, PINACLE',
            '3.ALCAPONE, CANPILE'
        ],
        en: [
            '1.ALCAPONE, NOTEBOOK',
            '2. ALCAPONE, PINNACLE',
            '3.ALCAPONE, CANPILE'
        ]
    };
    
    const currentTranslations = isEnglish ? translations.en : translations.fr;
    listItems.forEach((item, index) => {
        if (currentTranslations[index]) {
            item.textContent = currentTranslations[index];
        }
    });
   
    const choiceButtons = document.querySelectorAll('.choice-box .btn');
    choiceButtons.forEach(button => {
        button.textContent = isEnglish ? 'Choose this word' : 'Choisir ce mot';
    });

    const hintText = document.getElementById('hintText');
    if (hintText) {
        hintText.textContent = isEnglish 
            ? 'the title is your best friend.'
            : 'le titre est votre plus grand amie.';
    }
    
    const hintModalTitle = document.querySelector('#hintModal h2');
    if (hintModalTitle) {
        hintModalTitle.textContent = isEnglish ? 'Hint' : 'Indice';
    }

    updateDarkModeButtonText();
    updateTime();
}

function updateTime() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    
    if (!clockElement || !dateElement) return;
    
    let currentTime = new Date();
    
    let timeString = currentTime.toLocaleTimeString(isEnglish ? 'en-US' : 'fr-FR', { 
        hour12: isEnglish 
    });
    clockElement.textContent = timeString;

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    let localeString = isEnglish ? 'en-US' : 'fr-FR';
    let dateString = new Intl.DateTimeFormat(localeString, options).format(currentTime);
    
    dateElement.textContent = dateString;
}

function checkLanguagePreference() {
    const savedLanguage = sessionStorage.getItem('language');
    if (savedLanguage === 'en') {
        isEnglish = true;
        updateUILanguage();
    }
}

function setupPrisonerListInteractions() {
    const prisonerLists = document.querySelectorAll('.prisoner-list');
    
    prisonerLists.forEach(list => {
        const items = list.querySelectorAll('li');
        
        items.forEach(item => {
            item.addEventListener('click', function() {
                this.style.backgroundColor = '#444';
                this.style.color = '#ff9900';
          
                const hintText = document.getElementById('hintText');
                if (hintText) {
                    hintText.textContent = isEnglish
                        ? "Hint found! Look carefully at the pattern in the words."
                        : "Indice trouvé! Regardez attentivement le motif dans les mots.";
                }
                
                setTimeout(() => {
                    const hintModal = document.getElementById('hintModal');
                    if (hintModal) {
                        hintModal.style.display = 'block';
                    }
                }, 500);
            });
        });
    });
}

function setupModals() {
    const hintModal = document.getElementById('hintModal');
    const imageModal = document.getElementById('imageModal');
    const hintButton = document.getElementById('hintButton');
    const closeBtns = document.querySelectorAll('.close');
    
    if (hintButton && hintModal) {
        hintButton.addEventListener('click', function() {
            hintModal.style.display = 'block';
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === hintModal) {
            hintModal.style.display = 'none';
        } else if (event.target === imageModal) {
            imageModal.style.display = 'none';
        }
    });
}

function zoomImage(img) {
    const modal = document.getElementById('imageModal');
    const enlargedImg = document.getElementById('enlargedImage');
    
    if (!modal || !enlargedImg) return;
    
    modal.style.display = 'block';
    enlargedImg.src = img.src;
}

function makeChoice(destination) {
    const currentUrl = window.location.href;
    const isGamePage = currentUrl.includes('etape') || 
                     currentUrl.includes('echec') || 
                     currentUrl.includes('victoire') ||
                     currentUrl.includes('index');
    
    if (isGamePage) {
        if (musicPlaying) {
            sessionStorage.setItem('escapeRoomMusicPlaying', 'true');
        }
    }
    
    window.location.href = destination;
}

function initializeGlobalTimer() {
    const timerElement = document.getElementById('time-remaining');
    const progressBar = document.getElementById('progress-bar');
    
    if (!timerElement || !progressBar) return;
    
    const totalTime = 60 * 60;
    let timeLeft;
    
    const savedStartTime = sessionStorage.getItem('escapeRoomStartTime');
    const currentTime = Date.now();
    
    if (savedStartTime) {
        const elapsedTime = Math.floor((currentTime - parseInt(savedStartTime)) / 1000);
        timeLeft = Math.max(0, totalTime - elapsedTime);
    } else {
        const currentUrl = window.location.href;
        const isGamePage = currentUrl.includes('etape') || 
                         currentUrl.includes('echec') || 
                         currentUrl.includes('victoire') ||
                         currentUrl.includes('index');
        
        if (isGamePage) {
            timeLeft = totalTime;
            sessionStorage.setItem('escapeRoomStartTime', currentTime.toString());
        } else {
            return;
        }
    }
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        if (timeLeft < 60) {
            progressBar.style.backgroundColor = '#ff3333';
            timerElement.style.color = '#ff3333';
        } else if (timeLeft < 120) { 
            progressBar.style.backgroundColor = '#ffcc00';
            timerElement.style.color = '#ffcc00';
        } else {
            progressBar.style.backgroundColor = '#00ff00';
            timerElement.style.color = '#ffffff';
        }
        
        if (timeLeft <= 0) {
            clearInterval(globalTimer);
            sessionStorage.removeItem('escapeRoomStartTime');
            sessionStorage.removeItem('escapeRoomMusicPlaying');
            
            alert(isEnglish 
                ? 'Time\'s up! You have failed your mission.' 
                : 'Temps écoulé! Vous avez échoué dans votre mission.');
            window.location.href = 'echec.html';
            return;
        }
        
        timeLeft--;
    }
    
    updateTimer();
    
    const globalTimer = setInterval(updateTimer, 1000);
    
    window.escapeRoomTimer = globalTimer;
}

function resetGlobalTimer() {
    sessionStorage.removeItem('escapeRoomStartTime');
    sessionStorage.removeItem('escapeRoomMusicPlaying');
    if (window.escapeRoomTimer) {
        clearInterval(window.escapeRoomTimer);
    }
    location.reload();
}

function getRemainingTime() {
    const savedStartTime = sessionStorage.getItem('escapeRoomStartTime');
    if (!savedStartTime) return 0;
    
    const totalTime = 60 * 60;
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - parseInt(savedStartTime)) / 1000);
    
    return Math.max(0, totalTime - elapsedTime);
}