// dynamic-bg.js
// console.log(Spicetify.Player.data.item.uri);
console.log("[DEBUG] pdynamic-bg.js chargé avec succès à " + new Date().toLocaleTimeString());

(function () {
    if (!Spicetify?.Player?.addEventListener) {
        setTimeout(arguments.callee, 500);
        return;
    }

    console.log("[DEBUG] Player détecté – écoute activée");

    const TRACK_BACKGROUNDS = {
        "spotify:track:7mykoq6R3BArsSpNDjFQTm": "url('https://github.com/me974974/CyberNight/blob/main/assets/i_really_want_to_stay_at_your_house.png?raw=true')",
        "spotify:track:1qpGMJi0ippCaMUOs7cz2q": "url('https://github.com/me974974/CyberNight/blob/main/assets/let_you_down.png?raw=true')",
    };

    const ROOT = document.documentElement;
    const CONTAINER = () => document.querySelector(".Root__top-container");

    let defaultBg = getComputedStyle(ROOT).getPropertyValue("--image_url").trim();

    function updateTrackBackground() {
        const container = CONTAINER();
        if (!container) return;

        const currentUri = Spicetify.Player.data?.item?.uri;

        if (!currentUri) {
            container.classList.remove("has-custom-track-bg");
            return;
        }

        const customImage = TRACK_BACKGROUNDS[currentUri];

        if (customImage) {
            ROOT.style.setProperty("--image_url", customImage);
            container.classList.add("has-custom-track-bg");
        } else {
            container.classList.remove("has-custom-track-bg");
        }
    }

    Spicetify.Player.addEventListener("songchange", () => {
        console.log("[DEBUG] songchange détecté");
        updateTrackBackground();
    });

    // Sécurité polling (toutes les ~1.4s)
    let lastUri = "";
    const safetyCheck = setInterval(() => {
        const nowUri = Spicetify.Player.data?.item?.uri || "";
        if (nowUri !== lastUri) {
            console.log("[DEBUG] Changement détecté par polling → URI:", nowUri);
            lastUri = nowUri;
            updateTrackBackground();
        }
    }, 1400);

    // Premier déclenchement
    setTimeout(() => {
        console.log("[DEBUG] Premier check lancé");
        updateTrackBackground();
    }, 800);

    // Nettoyage si page fermée (optionnel)
    window.addEventListener("beforeunload", () => clearInterval(safetyCheck));
})();