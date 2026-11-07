const headerTexts = {
    debut: "La plus belle histoire d'amour 💛",
    premier_date: "Notre 1er date et notre 1e resto 🐓",
    aquarium: "L'aquarium 🐟​",
    the_end: "",
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

// Gestion de l'affichage / masquage du mot de passe (via l'icône œil)
document.addEventListener("click", function(e) {
    const toggleBtn = e.target.closest("#togglePassword");
    if (toggleBtn) {
        const passwordInput = document.getElementById("answer-input");
        const svgIcon = document.getElementById("eye-icon");
        
        if (passwordInput && svgIcon) {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";

            if (isPassword) {
                // SVG de l'œil OUVERT (quand on affiche le texte)
                svgIcon.innerHTML = `
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0-2.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                `;
                toggleBtn.setAttribute("aria-label", "Masquer le mot de passe");
            } else {
                // SVG de l'œil BARRÉ (quand on masque le mot de passe - retour à l'initial)
                svgIcon.innerHTML = `
                    <path id="eye-path" fill-rule="evenodd" clip-rule="evenodd" d="M20.293 2.293a1 1 0 1 1 1.414 1.414l-18 18a1 1 0 0 1-1.414-1.414l3.446-3.446c-.238-.188-.47-.387-.694-.6L1.31 12.722a.985.985 0 0 1 0-1.436l3.734-3.527c3.15-2.976 7.77-3.542 11.48-1.697l3.768-3.768zm-5.275 5.275c-2.852-1.138-6.23-.596-8.582 1.627l-2.974 2.808 2.974 2.809c.233.22.476.423.727.61l1.391-1.39a4 4 0 0 1 5.478-5.478l.986-.986zm-2.5 2.5a2.001 2.001 0 0 0-2.45 2.45l2.45-2.45z"></path>
                    <path d="M22.69 11.285 19.7 8.463l-1.414 1.414 2.251 2.126-2.973 2.809a8.099 8.099 0 0 1-6.377 2.164l-1.712 1.712c3.268.833 6.876.02 9.48-2.44l3.733-3.527a.985.985 0 0 0 0-1.436z"></path>
                    <path d="M15.997 12.167a4 4 0 0 1-3.83 3.83l3.83-3.83z"></path>
                `;
                toggleBtn.setAttribute("aria-label", "Afficher le mot de passe");
            }
        }
    }
});