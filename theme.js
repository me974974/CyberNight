// ===============================
// CYBERNIGHT – THEME JS (refactored based on working theme)
// ===============================

(function () {
    if (!Spicetify?.Player) {
        console.warn("[Cybernight] Spicetify.Player not ready yet");
        return;
    }

    const THEME_PATH = Spicetify.getThemePath();  // Majuscule S

    function waitForElement(els, func, timeout = 100) {
        const queries = els.map((el) => document.querySelector(el));
        if (queries.every((a) => a)) {
            func(queries);
        } else if (timeout > 0) {
            setTimeout(waitForElement, 300, els, func, --timeout);
        }
    }

    function loadSVG(button, filename) {
        if (!filename) return;
        fetch(`${THEME_PATH}/assets/${filename}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(svg => {
                button.innerHTML = svg;
                console.log(`[Cybernight] Loaded SVG: ${filename}`);
            })
            .catch(err => console.error(`[Cybernight] SVG load error (${filename}):`, err));
    }

    function setupButton(buttonSelector, states) {
        waitForElement([buttonSelector], ([btn]) => {
            console.log(`[Cybernight] Found button: ${buttonSelector}`);

            function update() {
                const label = btn.getAttribute("aria-label")?.toLowerCase() || "";
                const isChecked = btn.getAttribute("aria-checked") === "true";

                let matched = false;
                for (const state of states) {
                    if (
                        (state.label && label.includes(state.label)) ||
                        (state.checked !== undefined && state.checked === isChecked)
                    ) {
                        loadSVG(btn, state.svg);
                        if (state.class) {
                            btn.classList.add(state.class);
                        } else {
                            btn.classList.remove("cyber-smart");
                        }
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    // fallback
                    loadSVG(btn, states[states.length - 1].svg);
                    btn.classList.remove("cyber-smart");
                }
            }

            // Appel initial
            update();

            // Observer sur les changements d'attributs
            const observer = new MutationObserver(update);
            observer.observe(btn, { attributes: true, attributeFilter: ["aria-label", "aria-checked"] });

            // Bonus : ré-update si le player change de track/état
            Spicetify.Player.addEventListener("playerstatechanged", update);
            Spicetify.Player.addEventListener("songchange", update);
        });
    }

    function init() {
        console.log("[Cybernight] Theme JS initializing...");

        setupButton('[data-testid="control-button-shuffle"]', [
            { label: "smart shuffle", svg: "shuffle-smart.svg", class: "cyber-smart" },
            { checked: true, svg: "shuffle-active.svg" },
            { svg: "shuffle.svg" } // fallback
        ]);

        setupButton('[data-testid="control-button-repeat"]', [
            { label: "repeat one", svg: "repeat-one.svg" },
            { checked: true, svg: "repeat-active.svg" },
            { svg: "repeat.svg" } // fallback
        ]);
    }

    // Set background via JS (adapted from working theme)
    waitForElement([".Root__top-container"], ([el]) => {
        fetch(`${THEME_PATH}/assets/nightcity.png`)
            .then(res => res.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                el.style.backgroundImage = `url(${url})`;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
                el.style.backgroundRepeat = "no-repeat";
                console.log("[Cybernight] Background loaded via JS!");
            })
            .catch(err => console.error("[Cybernight] BG load error:", err));
    });

    // Lancement principal : attendre que le player soit dispo + DOM ready-ish
    if (Spicetify.Player && document.querySelector('[data-testid="control-button-shuffle"]')) {
        init();
    } else {
        const interval = setInterval(() => {
            if (Spicetify.Player && document.body) {
                clearInterval(interval);
                init();
            }
        }, 500);
    }

    // Observer for dynamic updates (from working theme)
    const observer = new MutationObserver(() => {
        init();  // Re-run setup if needed
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();