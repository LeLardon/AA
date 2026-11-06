const headerTexts = {
    debut: "La plus belle histoire d'amour 💛",
    premier_date: "Notre 1er date au resto 🐓",
};

async function loadComponent(elementId, file) {
    try {
        // Résolution robuste du chemin pour GitHub Pages (gère les sous-dossiers et les projets)
        const basePath = window.location.pathname.includes('/') 
            ? window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) 
            : '/';
        const fileUrl = new URL(file, window.location.origin + basePath).href;

        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Erreur lors du chargement : ${file} (Statut: ${response.status})`);
        }

        const html = await response.text();
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = html;

        // Mise en évidence de la page actuelle dans le menu & personnalisation du header
        if (elementId === "header") {
            let currentPage = window.location.pathname.split("/").pop();
            if (!currentPage || currentPage === "") {
                currentPage = "index.html";
            }

            const menuLinks = document.querySelectorAll("#pages-menu a");
            menuLinks.forEach(link => {
                const linkPage = link.getAttribute("href");
                if (linkPage === currentPage || (currentPage === "index.html" && (linkPage === "./" || linkPage === ""))) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }
            });

            // Personnalisation du texte du header
            const page = document.body.dataset.page;
            const textElement = document.getElementById("header-text");

            if (textElement) {
                textElement.textContent = headerTexts[page] || "A💛A";
            }

            // Gestion du menu hamburger
            const menuBtn = document.getElementById("menu-btn");
            const pagesMenu = document.getElementById("pages-menu");

            if (menuBtn && pagesMenu) {
                menuBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    pagesMenu.classList.toggle("hidden");
                    const isOpen = !pagesMenu.classList.contains("hidden");
                    menuBtn.setAttribute("aria-expanded", isOpen);
                });

                // Fermeture en cliquant ailleurs
                document.addEventListener("click", () => {
                    pagesMenu.classList.add("hidden");
                    menuBtn.setAttribute("aria-expanded", "false");
                });

                // Empêche la fermeture en cliquant dans le menu
                pagesMenu.addEventListener("click", (e) => {
                    e.stopPropagation();
                });
            }
        }

    } catch (error) {
        console.error("Erreur loadComponent:", error);
    }
}

// Chargement du header et du footer
document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("header", "header.html");
    await loadComponent("footer", "footer.html");
});

// Autres fonctionnalités (Connexion)
document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");

    if (authForm) {
        authForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const answerInput = document.getElementById("answer-input");
            const errorMsg = document.getElementById("error-msg");

            if (!answerInput) return;

            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswer = "incomparable";

            if (userAnswer === correctAnswer) {
                sessionStorage.setItem("accessGranted", "true");
                window.location.href = "1-debut.html";
            } else {
                if (errorMsg) errorMsg.classList.remove("hidden");
                answerInput.value = "";
            }
        });
    }
});