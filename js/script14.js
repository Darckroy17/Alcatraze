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
    
    if (h1) h1.textContent = isEnglish ? 'Lookout' : 'Gai guet';
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
            ? 'Between 5:30 PM and 7:30 PM, inmates are allowed to play music or cards. The occupants of cells 180 to 183 take advantage of the noise to widen the hole in their ventilation grate, while keeping watch with a mirror. The other three have given up escaping because they found that their grate does not lead to the same corridor.'
            : 'Entre 17 h 30 et 19 h 30, les détenus sont autorisés à faire de la musique ou à jouer aux cartes. Les occupants des cellules 180 à 183 profitent du bruit pour agrandir le trou de leur bouche d\'aéra-tion, tout en faisant le guet à l\'aide d\'un miroir. Les trois autres ont renoncé à s\'échapper, car ils ont constaté que leur grille ne débouchait pas dans le même couloir.';
    }

    const objectiveText = document.querySelectorAll('.audio-section p')[1];
    if (objectiveText) {
        objectiveText.textContent = isEnglish 
            ? 'Choose a musical instrument and understand its usefulness.'
            : 'Choisir un instrument de musique et en comprendre l\'utilité.';
    }

    const choiceBoxes = document.querySelectorAll('.choice-box h3');
    const choiceTitles = [
        isEnglish ? 'Word list #1' : 'Liste de mots #1',
        isEnglish ? 'Word list #2' : 'Liste de mots #2',
        isEnglish ? 'Word list #3' : 'Liste de mots #3',
        isEnglish ? 'Word list #4' : 'Liste de mots #4'
    ];
    
    choiceBoxes.forEach((box, index) => {
        if (choiceTitles[index]) {
            box.textContent = choiceTitles[index];
        }
    });

    const listItems = document.querySelectorAll('.prisoner-list li');
    const translations = {
        fr: [
            'ÔLE',
            '1.l\'accordéon',
            'la corde et on',
            'l\'accord des on'
        ],
        en: [
            'OLE',
            '1.the accordion',
            'the rope and on',
            'the chord of on'
        ]
    };
    
    const currentTranslations = isEnglish ? translations.en : translations.fr;
    listItems.forEach((item, index) => {
        if (currentTranslations[index]) {
            item.textContent = currentTranslations[index];
        }
    });

    const textParagraphs = document.querySelectorAll('.image-chemin p');
    if (textParagraphs.length >= 3) {
        if (isEnglish) {
            textParagraphs[0].textContent = 'JAIL\nPENITENTIARY\nVIOLIN\nDUNGEON\nHUT\nBALL\nPRISON CAMP\nJAIL';
            textParagraphs[1].textContent = '• WE escaped\n• WE escaped?\n• WE are ready\n• WE are ready!\n• WE are beheaded\n• WE are beheaded?\n• WE are hanged\n• WE are hanged?';
            textParagraphs[2].textContent = '"It annoys me" that we can\'t escape; it bothers me, this prison! gets angry Fuji Tif, as eager for freedom as his name indicates.\n- We must be there for our friends, says Dave.\nTony helps me with grammar.\nHe asked me to give him my instrument, the day before the escape; I will do him this favor, but I don\'t know what he wants to do with it...';
        } else {
            textParagraphs[0].textContent = 'GEÔLE\nPENITENCIER\nVIOLON\nCACHOT\nCABANE\nBALLON\nBAGNE\nTAULE';
            textParagraphs[1].textContent = '• ON est évadé\n• ON est évadés ?\n• ON est prêt\n• ON est prêts!\n• ON est décapité\n• ON est décapités?\n• ON est pendu\n• ON est pendus ?';
            textParagraphs[2].textContent = '« Ça me gonfle », qu\'on ne puisse pas s\'échapper ;\nça me prend la tête, cette prison ! s\'énerve Fuji Tif, aussi avide de liberté que son nom l\'indique.\n- On doit être là pour nos potes, dit Dave.\nTony m\'aide en grammaire.\nIl m\'a demandé de lui filer mon instrument, la veille de l\'évasion; je vais lui rendre ce service, mais\nje ne sais pas ce qu\'il veut en faire... »';
        }
    }
   
    const choiceButtons = document.querySelectorAll('.choice-box .btn');
    choiceButtons.forEach(button => {
        button.textContent = isEnglish ? 'Choose this list' : 'Choisir cette liste';
    });

    const hintText = document.getElementById('hintText');
    if (hintText) {
        hintText.textContent = isEnglish 
            ? 'The chosen vocabulary, particularly "It annoys me" and "it bothers me" are not there by chance.'
            : 'Le vocabulaire choisie notamment « Ça me gonfle » et « ça me prend la tête » ne sont pas la par hasard.';
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