let isEnglish = false;
let isDarkMode = true;
let musicPlaying = false;
let selectedPiece = null;
let puzzleComplete = false;


document.addEventListener('DOMContentLoaded', function () {
    setupControlButtons();
    updateTime();
    setInterval(updateTime, 1000);
    checkDarkModePreference();
    checkLanguagePreference();
    initializePuzzle();
    startTimer();
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
    if (nextBtn) nextBtn.addEventListener('click', () => window.location.href = 'etape12.html');
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

    const preferredMode = 'dark';
    if (preferredMode === 'light') {
        toggleDarkMode();
    }
    updateDarkModeButtonText();
}

function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    isDarkMode = !document.body.classList.contains('light-mode');
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
}

function updateUILanguage() {

    const mainTitle = document.querySelector('h1');
    if (mainTitle) {
        mainTitle.textContent = isEnglish ? 'Frisk and Mumble' : 'fouille et bafouille';
    }


    const instructionsTitle = document.querySelector('.audio-section h3');
    if (instructionsTitle) {
        instructionsTitle.textContent = isEnglish ? 'Instructions' : 'Instructions';
    }

    const instructionsText = document.querySelector('.audio-section p');
    if (instructionsText) {
        instructionsText.textContent = isEnglish
            ? 'Tarek stores, in his small painting workshop behind some covers, the materials needed to make the fake heads and all the “compromising” elements — except, of course, the fake ventilation grates. A bell rings, and six guards rush into Tony\’s cell at a brisk pace: a rumor is spreading that he\’s planning an escape.A search is about to take place.Find the seven hidden cards in his cell.'
            : 'Tarek stocke dans son petit atelier de peinture, derrière des couverriers, le matériel nécessaire à la fabrication des fausses têtes et tous les éléments « compromettants », à part les fausses grilles d\'aération évidemment  Une cloche retentit et six matons arrivent au pas de charge dans la cellule de Tony: la rumeur court qu\'il préparerait une évasion. Une fouille va avoir lieu. Mettez la main sur sept cartes cachées dans sa cellule.';
    }

    const puzzleInstruction = document.getElementById('puzzle-instruction');
    if (puzzleInstruction) {
        puzzleInstruction.textContent = isEnglish
            ? 'Click and drag pieces to reconstruct the pattern. Align dots and lines correctly.'
            : 'Cliquez et faites glisser les pièces pour reconstituer le motif. Alignez les points et les lignes correctement.';
    }

    const resetBtn = document.getElementById('resetBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (resetBtn) resetBtn.textContent = isEnglish ? 'Reset' : 'Réinitialiser';
    if (nextBtn) nextBtn.textContent = isEnglish ? 'Next Step' : 'Étape suivante';

    const successMessage = document.querySelector('#successMessage p');
    if (successMessage) {
        successMessage.textContent = isEnglish
            ? 'You can now proceed to the next step.'
            : 'Vous pouvez maintenant passer à l\'étape suivante.';
    }

    updateDarkModeButtonText();
    updateTime();
}

function checkLanguagePreference() {

    const preferredLanguage = 'fr';
    if (preferredLanguage === 'en') {
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

    const timer = setInterval(function () {
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
    if (!board) return;

    board.innerHTML = '';


    const targetPattern = [
        { dots: ['top-left'], lines: ['horizontal'], shape: 'corner' },
        { dots: [], lines: ['horizontal'], shape: 'edge' },
        { dots: [], lines: ['horizontal'], shape: 'edge' },
        { dots: ['top-right'], lines: ['horizontal', 'vertical'], shape: 'corner' },
        { dots: [], lines: ['vertical'], shape: 'edge' },
        { dots: ['center'], lines: ['horizontal', 'vertical'], shape: 'cross' },
        { dots: ['center'], lines: ['horizontal', 'vertical'], shape: 'cross' },
        { dots: [], lines: ['vertical'], shape: 'edge' },
        { dots: [], lines: ['vertical'], shape: 'edge' },
        { dots: ['center'], lines: ['horizontal', 'vertical'], shape: 'cross' },
        { dots: ['center'], lines: ['horizontal', 'vertical'], shape: 'cross' },
        { dots: [], lines: ['vertical'], shape: 'edge' },
        { dots: ['bottom-left'], lines: ['horizontal', 'vertical'], shape: 'corner' },
        { dots: [], lines: ['horizontal'], shape: 'edge' },
        { dots: [], lines: ['horizontal'], shape: 'edge' },
        { dots: ['bottom-right'], lines: [], shape: 'corner' }
    ];

    const shuffledPattern = [...targetPattern];
    for (let i = shuffledPattern.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPattern[i], shuffledPattern[j]] = [shuffledPattern[j], shuffledPattern[i]];
    }


    shuffledPattern.forEach((pattern, index) => {
        const piece = document.createElement('div');
        piece.className = `puzzle-piece ${pattern.shape}`;
        piece.dataset.originalIndex = targetPattern.indexOf(pattern);
        piece.dataset.currentIndex = index;

        piece.style.background = 'linear-gradient(45deg, #d4a574 25%, transparent 25%), linear-gradient(135deg, #d4a574 25%, transparent 25%)';
        piece.style.backgroundSize = '8px 8px';
        piece.style.backgroundColor = '#c9965a';

        pattern.dots.forEach(dotPos => {
            const dot = document.createElement('div');
            dot.className = 'dot';

            switch (dotPos) {
                case 'top-left':
                    dot.style.top = '5px';
                    dot.style.left = '5px';
                    break;
                case 'top-right':
                    dot.style.top = '5px';
                    dot.style.right = '5px';
                    break;
                case 'bottom-left':
                    dot.style.bottom = '5px';
                    dot.style.left = '5px';
                    break;
                case 'bottom-right':
                    dot.style.bottom = '5px';
                    dot.style.right = '5px';
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

            if (lineType === 'horizontal') {
                line.style.width = '80%';
                line.style.height = '2px';
                line.style.backgroundColor = '#8b4513';
                line.style.position = 'absolute';
                line.style.top = '50%';
                line.style.left = '10%';
                line.style.transform = 'translateY(-50%)';
            } else if (lineType === 'vertical') {
                line.style.width = '2px';
                line.style.height = '80%';
                line.style.backgroundColor = '#8b4513';
                line.style.position = 'absolute';
                line.style.left = '50%';
                line.style.top = '10%';
                line.style.transform = 'translateX(-50%)';
            }

            piece.appendChild(line);
        });


        piece.addEventListener('click', () => selectPiece(piece));
        piece.style.cursor = 'pointer';
        piece.style.transition = 'all 0.3s ease';

        board.appendChild(piece);
    });

    puzzleComplete = false;
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = true;
}

function selectPiece(piece) {
    if (selectedPiece === piece) {

        piece.classList.remove('selected');
        piece.style.transform = 'scale(1)';
        piece.style.boxShadow = 'none';
        selectedPiece = null;
    } else if (selectedPiece === null) {

        piece.classList.add('selected');
        piece.style.transform = 'scale(1.1)';
        piece.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
        selectedPiece = piece;
    } else {

        swapPieces(selectedPiece, piece);
        selectedPiece.classList.remove('selected');
        selectedPiece.style.transform = 'scale(1)';
        selectedPiece.style.boxShadow = 'none';
        selectedPiece = null;
    }
}

function swapPieces(piece1, piece2) {
    const board = document.getElementById('puzzleBoard');
    const pieces = Array.from(board.children);

    const index1 = pieces.indexOf(piece1);
    const index2 = pieces.indexOf(piece2);


    piece1.style.transform = 'scale(0.8) rotate(180deg)';
    piece2.style.transform = 'scale(0.8) rotate(-180deg)';

    setTimeout(() => {

        if (index1 < index2) {
            board.insertBefore(piece2, piece1);
            board.insertBefore(piece1, pieces[index2 + 1]);
        } else {
            board.insertBefore(piece1, piece2);
            board.insertBefore(piece2, pieces[index1 + 1]);
        }


        [piece1.dataset.currentIndex, piece2.dataset.currentIndex] =
            [piece2.dataset.currentIndex, piece1.dataset.currentIndex];

        piece1.style.transform = 'scale(1)';
        piece2.style.transform = 'scale(1)';

        checkPuzzleComplete();
    }, 300);
}

function checkPuzzleComplete() {
    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    let correct = 0;

    pieces.forEach((piece, index) => {
        if (parseInt(piece.dataset.originalIndex) === index) {
            piece.classList.add('correct');
            piece.style.border = '2px solid #4CAF50';
            correct++;
        } else {
            piece.classList.remove('correct');
            piece.style.border = '1px solid #8b4513';
        }
    });

    if (correct === pieces.length) {
        puzzleComplete = true;
        const successMessage = document.getElementById('successMessage');
        const nextBtn = document.getElementById('nextBtn');

        if (successMessage) successMessage.style.display = 'block';
        if (nextBtn) nextBtn.disabled = false;


        pieces.forEach((piece, index) => {
            setTimeout(() => {
                piece.style.animation = 'pulse 1s ease-in-out';
                piece.style.border = '3px solid gold';
                piece.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
            }, index * 100);
        });


        setTimeout(() => {
            alert(isEnglish
                ? '🎉 Congratulations! You\'ve successfully assembled the cardboard pieces!'
                : '🎉 Félicitations! Vous avez réussi la chasse au trésor!');
        }, 1000);
    }
}

function resetPuzzle() {
    initializePuzzle();
    const successMessage = document.getElementById('successMessage');
    if (successMessage) successMessage.style.display = 'none';
}