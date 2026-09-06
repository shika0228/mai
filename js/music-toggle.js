(function () {
    const activeClass = "is-playing";

    const initMusicToggle = (button) => {
        if (button.dataset.musicReady === "true") return;

        const audioSrc = button.dataset.audioSrc;
        if (!audioSrc) return;

        const audio = new Audio(audioSrc);
        audio.preload = "none";

        const setStopped = () => {
            button.classList.remove(activeClass);
            button.setAttribute("aria-label", "播放音乐");
            button.setAttribute("aria-pressed", "false");
        };

        const setPlaying = () => {
            button.classList.add(activeClass);
            button.setAttribute("aria-label", "停止音乐");
            button.setAttribute("aria-pressed", "true");
        };

        button.addEventListener("click", async () => {
            if (audio.paused || audio.ended) {
                try {
                    await audio.play();
                    setPlaying();
                } catch (error) {
                    setStopped();
                    console.warn("Audio playback failed:", error);
                }
                return;
            }

            audio.pause();
            audio.currentTime = 0;
            setStopped();
        });

        audio.addEventListener("ended", setStopped);
        window.addEventListener("pagehide", () => audio.pause());

        button.dataset.musicReady = "true";
    };

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".page-music-toggle").forEach(initMusicToggle);
    });
}());
