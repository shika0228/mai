document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-animation-ready");

    const sectionTitles = document.querySelectorAll(".story-title, .about-title, .gallery-title");
    sectionTitles.forEach(title => title.classList.add("section-title-fade"));

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                titleObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "0px 0px -8% 0px"
    });

    sectionTitles.forEach(title => titleObserver.observe(title));

    const aboutSection = document.querySelector(".about");
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("about-in-view");
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.25,
            rootMargin: "0px 0px -10% 0px"
        });

        aboutObserver.observe(aboutSection);
    }
});
