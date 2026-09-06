document.addEventListener("DOMContentLoaded", () => {
    const tracks = [
        {
            id: "bakamitai",
            title: "バカみたい",
            audio: "muisc_content/bakamitai.m4a",
            cover: "muisc_content/bakamitai.webp",
            lyrics: "muisc_content/bakamitai.lrc"
        },
        {
            id: "honnon",
            title: "本能",
            audio: "muisc_content/honnon.m4a",
            cover: "muisc_content/honnon.webp",
            lyrics: "muisc_content/honnon.lrc"
        }
    ];

    const audio = document.getElementById("audioPlayer");
    const recordImg = document.querySelector(".record_img");
    const recordToggle = document.querySelector(".record_toggle");
    const title = document.getElementById("trackTitle");
    const lyricsContainer = document.getElementById("lyrics");
    const progressBar = document.getElementById("progressBar");
    const currentTime = document.getElementById("currentTime");
    const durationTime = document.getElementById("durationTime");
    const playBtn = document.getElementById("playBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const playlistButtons = document.querySelectorAll(".music_btn[data-track]");
    const hamburger = document.getElementById("hamburger");
    const menu = document.querySelector(".menu");
    const embeddedLyrics = window.MUSIC_LYRICS || {};

    let currentTrackIndex = 0;
    let lyrics = [];
    let activeLyricIndex = -1;
    let lyricsRequestId = 0;

    const formatTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds < 0) {
            return "00:00";
        }

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const escapeHtml = (value) => {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const parseLrc = (text) => {
        return text
            .replace(/^\uFEFF/, "")
            .split(/\r?\n/)
            .flatMap((line) => {
                const timeMatches = [...line.matchAll(/\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/g)];
                const lyricText = line.replace(/\[[^\]]+\]/g, "").trim();

                if (!timeMatches.length || !lyricText) {
                    return [];
                }

                return timeMatches.map((match) => {
                    const minutes = Number(match[1]);
                    const seconds = Number(match[2]);
                    const fraction = Number((match[3] || "0").padEnd(3, "0"));

                    return {
                        time: minutes * 60 + seconds + fraction / 1000,
                        text: lyricText
                    };
                });
            })
            .sort((a, b) => a.time - b.time);
    };

    const renderLyrics = () => {
        activeLyricIndex = -1;

        if (!lyrics.length) {
            lyricsContainer.innerHTML = '<p class="lyrics_status">No lyrics</p>';
            return;
        }

        lyricsContainer.innerHTML = lyrics
            .map((line, index) => `<p class="lyric_line" data-index="${index}">${escapeHtml(line.text)}</p>`)
            .join("");
    };

    const loadLyrics = async (track) => {
        const requestId = ++lyricsRequestId;
        lyricsContainer.innerHTML = '<p class="lyrics_status">Loading lyrics...</p>';
        const fallbackText = embeddedLyrics[track.id] || embeddedLyrics[track.lyrics] || "";

        try {
            let text = fallbackText;

            if (window.location.protocol !== "file:") {
                const response = await fetch(track.lyrics, { cache: "no-cache" });
                if (!response.ok) {
                    throw new Error(`Unable to load ${track.lyrics}`);
                }

                text = await response.text();
            }

            if (!text) {
                throw new Error(`No lyrics available for ${track.id}`);
            }

            if (requestId !== lyricsRequestId) {
                return;
            }

            lyrics = parseLrc(text);
            renderLyrics();
            syncLyrics(audio.currentTime);
        } catch (error) {
            if (requestId !== lyricsRequestId) {
                return;
            }

            if (fallbackText) {
                lyrics = parseLrc(fallbackText);
                renderLyrics();
                syncLyrics(audio.currentTime);
                return;
            }

            lyrics = [];
            activeLyricIndex = -1;
            lyricsContainer.innerHTML = '<p class="lyrics_status">Lyrics failed to load</p>';
        }
    };

    const setProgressVisual = (percent) => {
        const safePercent = Math.min(Math.max(percent, 0), 100);
        progressBar.style.setProperty("--progress", `${safePercent}%`);
    };

    const updateTime = () => {
        const duration = audio.duration || 0;
        const current = audio.currentTime || 0;
        const percent = duration ? (current / duration) * 100 : 0;

        progressBar.value = percent;
        setProgressVisual(percent);
        currentTime.textContent = formatTime(current);
        durationTime.textContent = `-${formatTime(Math.max(duration - current, 0))}`;
        syncLyrics(current);
    };

    const updatePlayState = () => {
        const isPlaying = !audio.paused && !audio.ended;

        recordImg.classList.toggle("is-playing", isPlaying);
        playBtn.classList.toggle("is-playing", isPlaying);
        playBtn.setAttribute("aria-label", isPlaying ? "pause" : "play");
    };

    const playAudio = async () => {
        try {
            await audio.play();
        } catch (error) {
            updatePlayState();
        }
    };

    const togglePlay = () => {
        if (audio.paused || audio.ended) {
            playAudio();
            return;
        }

        audio.pause();
    };

    const syncPlaylistButtons = (trackId) => {
        playlistButtons.forEach((button) => {
            button.classList.toggle("active", button.dataset.track === trackId);
        });
    };

    const resetPlayerTime = () => {
        progressBar.value = 0;
        setProgressVisual(0);
        currentTime.textContent = "00:00";
        durationTime.textContent = "-00:00";
    };

    const selectTrack = async (index, shouldPlay = !audio.paused) => {
        const track = tracks[index];
        if (!track) {
            return;
        }

        currentTrackIndex = index;
        audio.pause();
        audio.src = track.audio;
        audio.load();
        recordImg.src = track.cover;
        title.textContent = track.title;
        syncPlaylistButtons(track.id);
        resetPlayerTime();
        await loadLyrics(track);

        if (shouldPlay) {
            playAudio();
        } else {
            updatePlayState();
        }
    };

    const selectTrackById = (trackId) => {
        const nextIndex = tracks.findIndex((track) => track.id === trackId);

        if (nextIndex === -1 || nextIndex === currentTrackIndex) {
            return;
        }

        selectTrack(nextIndex);
    };

    const selectRelativeTrack = (direction) => {
        const nextIndex = (currentTrackIndex + direction + tracks.length) % tracks.length;
        selectTrack(nextIndex);
    };

    const syncLyrics = (time) => {
        if (!lyrics.length) {
            return;
        }

        let nextIndex = -1;
        for (let i = lyrics.length - 1; i >= 0; i -= 1) {
            if (time >= lyrics[i].time) {
                nextIndex = i;
                break;
            }
        }

        if (nextIndex === activeLyricIndex) {
            return;
        }

        const previousActive = lyricsContainer.querySelector(".lyric_line.active");
        const nextActive = lyricsContainer.querySelector(`.lyric_line[data-index="${nextIndex}"]`);

        if (previousActive) {
            previousActive.classList.remove("active");
        }

        if (nextActive) {
            nextActive.classList.add("active");
            nextActive.scrollIntoView({ block: "center", behavior: "smooth" });
        }

        activeLyricIndex = nextIndex;
    };

    if (hamburger && menu) {
        const closeMenu = () => {
            menu.classList.remove("active");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        };

        hamburger.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("active");
            hamburger.classList.toggle("active", isOpen);
            hamburger.setAttribute("aria-expanded", String(isOpen));
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (!menu.classList.contains("active")) {
                return;
            }

            if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
                closeMenu();
            }
        });
    }

    playlistButtons.forEach((button) => {
        button.addEventListener("click", () => selectTrackById(button.dataset.track));
    });

    playBtn.addEventListener("click", togglePlay);
    recordToggle.addEventListener("click", togglePlay);
    prevBtn.addEventListener("click", () => selectRelativeTrack(-1));
    nextBtn.addEventListener("click", () => selectRelativeTrack(1));

    progressBar.addEventListener("input", () => {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
            return;
        }

        const percent = Number(progressBar.value);
        audio.currentTime = (percent / 100) * audio.duration;
        setProgressVisual(percent);
        updateTime();
    });

    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("durationchange", updateTime);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("play", updatePlayState);
    audio.addEventListener("pause", updatePlayState);
    audio.addEventListener("ended", updatePlayState);

    selectTrack(0, false);

    if (typeof particlesJS === "function") {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 100,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "image",
                    "stroke": {
                        "width": 4,
                        "color": "#fff"
                    },
                    "image": {
                        "src": "img-jk/snow.webp",
                        "width": 130,
                        "height": 130
                    }
                },
                "opacity": {
                    "value": 0.8,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 20,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "enable": true,
                    "speed": 3,
                    "direction": "bottom",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 300,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false
                    },
                    "onclick": {
                        "enable": false
                    },
                    "resize": true
                }
            },
            "retina_detect": true
        });
    }
});
