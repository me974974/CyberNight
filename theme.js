// ===============================
// CYBERNIGHT – THEME JS (mise à jour février 2026)
// ===============================

(function () {
    if (!Spicetify?.Player) {
        console.warn("[Cybernight] Spicetify.Player pas encore prêt");
        return;
    }

    const THEME_PATH = Spicetify.getThemePath();

    function waitForElement(selectors, callback, maxAttempts = 60) {
        let attempts = 0;
        const interval = setInterval(() => {
            const elements = selectors.map(sel => document.querySelector(sel)).filter(Boolean);
            if (elements.length === selectors.length) {
                clearInterval(interval);
                callback(elements);
            }
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.warn("[Cybernight] Éléments non trouvés après " + maxAttempts + " tentatives : " + selectors.join(", "));
            }
        }, 300);
    }

    function loadSVG(button, filename) {
        if (!filename) return;
        fetch(`${THEME_PATH}/assets/${filename}`)
            .then(res => {
                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                return res.text();
            })
            .then(svg => {
                button.innerHTML = svg;
                console.log(`[Cybernight] SVG chargé : ${filename}`);
            })
            .catch(err => console.error(`[Cybernight] Erreur chargement SVG ${filename} :`, err));
    }

    function setupButton(selector, states) {
        waitForElement([selector], ([btn]) => {
            console.log(`[Cybernight] Bouton trouvé : ${selector}`);

            function updateState() {
                const label = (btn.getAttribute("aria-label") || "").toLowerCase();
                const checked = btn.getAttribute("aria-checked") === "true";

                let applied = false;
                for (const state of states) {
                    if (
                        (state.label && label.includes(state.label.toLowerCase())) ||
                        (state.checked !== undefined && state.checked === checked)
                    ) {
                        loadSVG(btn, state.svg);
                        if (state.class) btn.classList.add(state.class);
                        else btn.classList.remove("cyber-smart");
                        applied = true;
                        break;
                    }
                }
                if (!applied) {
                    loadSVG(btn, states[states.length - 1].svg);
                    btn.classList.remove("cyber-smart");
                }
            }

            updateState();

            const observer = new MutationObserver(updateState);
            observer.observe(btn, { attributes: true, attributeFilter: ["aria-label", "aria-checked"] });

            Spicetify.Player.addEventListener("playerstatechanged", updateState);
            Spicetify.Player.addEventListener("songchange", updateState);
        });
    }

    function initButtons() {
        console.log("[Cybernight] Initialisation des boutons custom...");

        setupButton('[data-testid="control-button-shuffle"]', [
            { label: "smart shuffle", svg: "shuffle-smart.svg", class: "cyber-smart" },
            { checked: true, svg: "shuffle-active.svg" },
            { svg: "shuffle.svg" }
        ]);

        setupButton('[data-testid="control-button-repeat"]', [
            { label: "repeat one", svg: "repeat-one.svg" },
            { checked: true, svg: "repeat-active.svg" },
            { svg: "repeat.svg" }
        ]);
    }

    // Fond d'écran via GitHub raw (plus fiable que local)
    waitForElement([".Root__top-container"], ([container]) => {
        const bgUrl = "https://github.com/me974974/CyberNight/blob/main/assets/nightcity.png?raw=true";
        container.style.backgroundImage = `url(${bgUrl})`;
        container.style.backgroundSize = "cover";
        container.style.backgroundPosition = "center";
        container.style.backgroundRepeat = "no-repeat";
        container.style.backgroundAttachment = "fixed";
        console.log("[Cybernight] Fond chargé depuis GitHub : " + bgUrl);
    });

    // Lancement
    const checkInterval = setInterval(() => {
        if (Spicetify.Player) {
            clearInterval(checkInterval);
            initButtons();
        }
    }, 400);

    // Observer global pour les changements dynamiques
    new MutationObserver(() => {
        if (document.querySelector('[data-testid="control-button-shuffle"]')) {
            initButtons();
        }
    }).observe(document.body, { childList: true, subtree: true });

})();