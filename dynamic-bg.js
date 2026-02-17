// pdynamic-bg.js
// Fond CYBERPUNK personnalisé par chanson – coexiste avec le fond Night City par défaut

(function () {
    if (!Spicetify?.Player?.addEventListener) {
        setTimeout(arguments.callee, 500);
        return;
    }

    const TRACK_BACKGROUNDS = {
        "spotify:track:7mykoq6R3BArsSpNDjFQTm": "url('')",
    };

    let defaultBg = getComputedStyle(document.documentElement).getPropertyValue("--image_url").trim();

    const ROOT = document.documentElement;

    function setBackground(value) {
        ROOT.style.setProperty("--image_url", value);
    }

    function updateTrackBackground() {
        const currentUri = Spicetify.Player.data?.item?.uri;

        if (!currentUri) {
            setBackground(defaultBg);
            return;
        }

        const customImage = TRACK_BACKGROUNDS[currentUri];

        if (customImage) {
            setBackground(customImage);
        } else {
            setBackground(defaultBg);
        }
    }

    Spicetify.Player.addEventListener("songchange", updateTrackBackground);

    let lastUri = "";
    setInterval(() => {
        const nowUri = Spicetify.Player.data?.item?.uri || "";
        if (nowUri !== lastUri) {
            lastUri = nowUri;
            updateTrackBackground();
        }
    }, 1500);

    // Premier déclenchement (quand le player est prêt)
    setTimeout(updateTrackBackground, 800);

})();