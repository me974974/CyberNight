// dynamic-bg.js
// console.log(Spicetify.Player.data.item.uri);
console.log("[DEBUG] dynamic-bg.js chargé");

(function () {
    if (!Spicetify?.Player?.addEventListener) {
        setTimeout(arguments.callee, 500);
        return;
    }

    console.log("[DEBUG] Player détecté");

    const TRACK_BACKGROUNDS = {
        "spotify:track:7mykoq6R3BArsSpNDjFQTm": "https://github.com/me974974/CyberNight/blob/main/assets/i_really_want_to_stay_at_your_house.png?raw=true",
        "spotify:track:1qpGMJi0ippCaMUOs7cz2q": "https://github.com/me974974/CyberNight/blob/main/assets/let_you_down.png?raw=true",
    };

    const CONTAINER = () => document.querySelector(".Root__top-container");

    let layerA, layerB;
    let activeLayer = "a";
    let lastUri = "";

    function createLayers(container) {
        layerA = document.createElement("div");
        layerB = document.createElement("div");

        layerA.classList.add("dynamic-bg-layer");
        layerB.classList.add("dynamic-bg-layer");

        container.appendChild(layerA);
        container.appendChild(layerB);
    }

    function crossfadeTo(imageUrl) {
        const nextLayer = activeLayer === "a" ? layerB : layerA;
        const currentLayer = activeLayer === "a" ? layerA : layerB;

        nextLayer.style.backgroundImage = `url("${imageUrl}")`;

        void nextLayer.offsetWidth;

        nextLayer.style.opacity = "1";
        currentLayer.style.opacity = "0";

        activeLayer = activeLayer === "a" ? "b" : "a";
    }

    function resetToDefault(container) {
        layerA.style.opacity = "0";
        layerB.style.opacity = "0";
        container.classList.remove("has-custom-bg");
    }

    function updateBackground() {
        const container = CONTAINER();
        if (!container) return;

        if (!layerA || !layerB) {
            createLayers(container);
        }

        const currentUri = Spicetify.Player.data?.item?.uri || "";

        if (currentUri === lastUri) return;
        lastUri = currentUri;

        const customImage = TRACK_BACKGROUNDS[currentUri];

        if (customImage) {
            container.classList.add("has-custom-bg");
            crossfadeTo(customImage);
        } else {
            resetToDefault(container);
        }
    }

    Spicetify.Player.addEventListener("songchange", updateBackground);

    // Sécurité polling
    const safetyInterval = setInterval(updateBackground, 1400);

    // Premier déclenchement
    setTimeout(updateBackground, 800);

    // Nettoyage
    window.addEventListener("beforeunload", () => clearInterval(safetyInterval));
})();
