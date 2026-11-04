// Ce script s'exécute dès le chargement du Head
// Si l'utilisateur n'a pas répondu à la question, il est renvoyé à l'accueil
if (sessionStorage.getItem('accessGranted') !== 'true') {
    window.location.href = 'home.html';
}