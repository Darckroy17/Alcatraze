let isEnglish = false;
let isDarkMode = true;
let musicPlaying = false;
let selectedPiece = null;
let puzzleComplete = false;

document.addEventListener('DOMContentLoaded', function() {
    setupControlButtons();
    updateTime();
    setInterval(updateTime, 1000);
    checkDarkModePreference();
    checkLanguagePreference();
    initializePuzzle();
    startTimer();
});

window.addEventListener('DOMContentLoaded', function() {
    const ambientSound = document.getElementById('ambientSound');
    if (ambientSound) {
        ambientSound.volume = 0.3;
        document.body.addEventListener('click', function() {
            if (ambientSound.paused) {
                ambientSound.play().catch(err => console.log('Impossible de jouer le son:', err));
            }
        }, { once: true });
    }
});

function setupControlButtons() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const languageToggle = document.getElementById('toggle-lang');
    const musicToggle = document.getElementById('music-toggle');
    const resetBtn = document.getElementById('resetBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
    if (languageToggle) languageToggle.addEventListener('click', toggleLanguage);
    if (musicToggle) musicToggle.addEventListener('click', toggleMusic);
    if (resetBtn) resetBtn.addEventListener('click', resetPuzzle);
    if (nextBtn) nextBtn.addEventListener('click', () => window.location.href = 'etape07.html');
}

function toggleMusic() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!backgroundMusic) return;
    
    musicPlaying = !musicPlaying;
    
    if (musicPlaying) {
        backgroundMusic.volume = 0.2;
        backgroundMusic.play().catch(err => console.log('Impossible de jouer la musique:', err));
        musicToggle.textContent = isEnglish ? '🔊 Disable music' : '🔊 Désactiver la musique';
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = isEnglish ? '🔈 Enable music' : '🔈 Activer la musique';
    }
}

function checkDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'light') {
        toggleDarkMode();
    }
    updateDarkModeButtonText();
}

function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    isDarkMode = !document.body.classList.contains('light-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'dark' : 'light');
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
        languageToggle.textContent = isEnglish ? 'Changer en Français' : 'Switch to English';
    }
    updateUILanguage();
    localStorage.setItem('language', isEnglish ? 'en' : 'fr');
}

function updateUILanguage() {
    document.querySelector('h1').textContent = isEnglish ? 'Target Practice' : 'La cible, faire un carton';
    document.getElementById('puzzle-instruction').textContent = isEnglish 
        ? 'Click and drag pieces to reconstruct the pattern. Align dots and lines correctly.'
        : 'Cliquez et faites glisser les pièces pour reconstituer le motif. Alignez les points et les lignes correctement.';
    
    const resetBtn = document.getElementById('resetBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (resetBtn) resetBtn.textContent = isEnglish ? 'Reset' : 'Réinitialiser';
    if (nextBtn) nextBtn.textContent = isEnglish ? 'Next Step' : 'Étape suivante';
    
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.innerHTML = isEnglish 
            ? '<h3>🎉 Puzzle solved successfully! 🎉</h3><p>You can now proceed to the next step.</p>'
            : '<h3>🎉 Puzzle résolu avec succès! 🎉</h3><p>Vous pouvez maintenant passer à l\'étape suivante.</p>';
    }
    
    updateDarkModeButtonText();
    updateTime();
}

function checkLanguagePreference() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'en') {
        isEnglish = true;
        updateUILanguage();
    }
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

let timeLeft = 5 * 60;
const totalTime = timeLeft;

function startTimer() {
    const timerElement = document.getElementById('time-remaining');
    const progressBar = document.getElementById('progress-bar');

    const timer = setInterval(function() {
        timeLeft--;
        
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
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(isEnglish 
                ? 'Time\'s up! You have failed your mission.' 
                : 'Temps écoulé! Vous avez échoué dans votre mission.');
            window.location.href = 'echec.html';
        }
    }, 1000);
}

function initializePuzzle() {
    const board = document.getElementById('puzzleBoard');
    board.innerHTML = '';
    
    const targetPattern = [
        { dots: ['top-left'], lines: [] },
        { dots: [], lines: ['horizontal'] },
        { dots: [], lines: ['horizontal'] },
        { dots: ['top-right'], lines: [] },
        { dots: [], lines: ['vertical'] },
        { dots: ['center'], lines: ['horizontal', 'vertical'] },
        { dots: ['center'], lines: ['horizontal', 'vertical'] },
        { dots: [], lines: ['vertical'] },
        { dots: [], lines: ['vertical'] },
        { dots: ['center'], lines: ['horizontal', 'vertical'] },
        { dots: ['center'], lines: ['horizontal', 'vertical'] },
        { dots: [], lines: ['vertical'] },
        { dots: ['bottom-left'], lines: [] },
        { dots: [], lines: ['horizontal'] },
        { dots: [], lines: ['horizontal'] },
        { dots: ['bottom-right'], lines: [] }
    ];

    const shuffledPattern = [...targetPattern];
    for (let i = shuffledPattern.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPattern[i], shuffledPattern[j]] = [shuffledPattern[j], shuffledPattern[i]];
    }

    shuffledPattern.forEach((pattern, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.originalIndex = targetPattern.indexOf(pattern);
        piece.dataset.currentIndex = index;
        
        pattern.dots.forEach(dotPos => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            
            switch(dotPos) {
                case 'top-left':
                    dot.style.top = '10px';
                    dot.style.left = '10px';
                    break;
                case 'top-right':
                    dot.style.top = '10px';
                    dot.style.right = '10px';
                    break;
                case 'bottom-left':
                    dot.style.bottom = '10px';
                    dot.style.left = '10px';
                    break;
                case 'bottom-right':
                    dot.style.bottom = '10px';
                    dot.style.right = '10px';
                    break;
                case 'center':
                    dot.style.top = '50%';
                    dot.style.left = '50%';
                    dot.style.transform = 'translate(-50%, -50%)';
                    break;
            }
            piece.appendChild(dot);
        });

        pattern.lines.forEach(lineType => {
            const line = document.createElement('div');
            line.className = `line ${lineType}`;
            piece.appendChild(line);
        });

        piece.addEventListener('click', () => selectPiece(piece));
        board.appendChild(piece);
    });

    puzzleComplete = false;
    document.getElementById('nextBtn').disabled = true;
}

function selectPiece(piece) {
    if (selectedPiece === piece) {
        piece.classList.remove('selected');
        selectedPiece = null;
    } else if (selectedPiece === null) {
        piece.classList.add('selected');
        selectedPiece = piece;
    } else {
        swapPieces(selectedPiece, piece);
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    }
}

function swapPieces(piece1, piece2) {
    const board = document.getElementById('puzzleBoard');
    const pieces = Array.from(board.children);
    
    const index1 = pieces.indexOf(piece1);
    const index2 = pieces.indexOf(piece2);
    
    if (index1 < index2) {
        board.insertBefore(piece2, piece1);
        board.insertBefore(piece1, pieces[index2 + 1]);
    } else {
        board.insertBefore(piece1, piece2);
        board.insertBefore(piece2, pieces[index1 + 1]);
    }
    
    [piece1.dataset.currentIndex, piece2.dataset.currentIndex] = 
    [piece2.dataset.currentIndex, piece1.dataset.currentIndex];
    
    checkPuzzleComplete();
}

function checkPuzzleComplete() {
    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    let correct = 0;
    
    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.originalIndex) === index) {
            piece.classList.add('correct');
            correct++;
        } else {
            piece.classList.remove('correct');
        }
    });
    
    if (correct === pieces.length) {
        puzzleComplete = true;
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('nextBtn').disabled = false;
        
        pieces.forEach(piece => {
            piece.style.animation = 'none';
            setTimeout(() => {
                piece.style.animation = 'fadeIn 0.5s ease';
            }, Math.random() * 500);
        });
    }
}

function resetPuzzle() {
    initializePuzzle();
    document.getElementById('successMessage').style.display = 'none';
}