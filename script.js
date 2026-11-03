document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche le rechargement de la page
    
    const userAnswer = document.getElementById('answer-input').value.trim().toLowerCase();
    const correctAnswer = "8"; // Vous pouvez changer la bonne réponse ici
    const errorMsg = document.getElementById('error-msg');

    if (userAnswer === correctAnswer) {
        // Enregistre l'autorisation dans la session du navigateur
        sessionStorage.setItem('accessGranted', 'true');
        // Redirige vers la première page
        window.location.href = 'page1.html';
    } else {
        errorMsg.classList.remove('hidden');
        document.getElementById('answer-input').value = '';
    }
});