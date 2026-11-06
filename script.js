const headerTexts = {
    debut: "La plus belle histoire d'amour 💛",
    premier_date: "Notre 1er date au resto 🐓",
};

async function loadComponent(elementId, file) {
    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Erreur lors du chargement : ${file}`);
        }

        const html = await response.text();

        document.getElementById(elementId).innerHTML = html;

        // Mise en évidence de la page actuelle dans le menu
        if (elementId === "header") {

            const currentPage = window.location.pathname.split("/").pop();

            const menuLinks = document.querySelectorAll("#pages-menu a");

            menuLinks.forEach(link => {

                const linkPage = link.getAttribute("href");

                if (linkPage === currentPage) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }

            });
        }

        // Personnalisation du header
        if (elementId === "header") {

            const page = document.body.dataset.page;
            const textElement = document.getElementById("header-text");

            if (textElement) {
                textElement.textContent =
                    headerTexts[page] || "A💛A";
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
        console.error(error);
    }
}


// Chargement du header et du footer
document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("header", "header.html");

    await loadComponent("footer", "footer.html");

});


// Autres fonctionnalités
document.addEventListener("DOMContentLoaded", () => {

    // 1. LOGIQUE DE CONNEXION
    const authForm = document.getElementById("auth-form");

    if (authForm) {
        authForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
            const correctAnswer = "incomparable";
            const errorMsg = document.getElementById("error-msg");

            if (userAnswer === correctAnswer) {
                sessionStorage.setItem("accessGranted", "true");
                window.location.href = "1-debut.html";
            } else {
                errorMsg.classList.remove("hidden");
                document.getElementById("answer-input").value = "";
            }
        });
    }

});