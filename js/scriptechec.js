// Script pour gérer l'audio
        document.addEventListener('DOMContentLoaded', function() {
            const audio = document.getElementById('ambientSound');
            
            // Tentative de lecture automatique (peut être bloquée par le navigateur)
            audio.play().catch(function(error) {
                console.log('Lecture automatique bloquée par le navigateur');
            });

            // Lecture au premier clic de l'utilisateur si la lecture auto est bloquée
            document.addEventListener('click', function() {
                if (audio.paused) {
                    audio.play();
                }
            }, { once: true });
        });