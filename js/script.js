document.addEventListener("DOMContentLoaded", () => {
    const aboutSection = document.getElementById("about");
    const hamburger = document.getElementById("hamburger");
    const menuNav = document.querySelector(".menu");

    window.addEventListener("scroll", () => {
        const aboutTop = aboutSection.getBoundingClientRect().top;
        if (aboutTop <= 0) {
            hamburger.classList.add("show");
        } else {
            hamburger.classList.remove("show");
            // 滚回顶部时，同时收回菜单和重置按钮图标
            menuNav.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });

    // 监听点击事件
    hamburger.addEventListener("click", () => {
        // 1. 展开/收起菜单面板
        menuNav.classList.toggle("active");
        // 2. 触发按钮本身的图片旋转变身
        hamburger.classList.toggle("active");
    });

    // IntersectionObserver - 触发内部图片的序列进场动画
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    // IntersectionObserver - 触发 world-title 和 world-box 的 fadeUp 效果
    const fadeUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-up-active");
                fadeUpObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const worldElements = document.querySelectorAll(".world-title, .world-box");
    worldElements.forEach(el => {
        fadeUpObserver.observe(el);
    });

    const sortButtons = document.querySelectorAll(".sort-btn li");
    const galleryItems = document.querySelectorAll(".grid .item");
    const getSortClass = (element) => {
        return Array.from(element.classList).find(className => /^sort\d+$/.test(className));
    };
    const activateGallery = (sortClass) => {
        sortButtons.forEach(button => {
            button.classList.toggle("active", getSortClass(button) === sortClass);
        });
        galleryItems.forEach(item => {
            const isActive = item.classList.contains(sortClass);
            item.classList.toggle("active", isActive);
            item.hidden = !isActive;
        });
    };

    if (sortButtons.length && galleryItems.length) {
        const activeButton = document.querySelector(".sort-btn li.active") || sortButtons[0];
        activateGallery(getSortClass(activeButton));
        sortButtons.forEach(button => {
            button.addEventListener("click", () => {
                activateGallery(getSortClass(button));
            });
        });
    }

    const galleryLinks = document.querySelectorAll(".grid a[href]");
    if (galleryLinks.length) {
        const lightbox = document.createElement("div");
        const lightboxImage = document.createElement("img");
        const closeButton = document.createElement("button");
        lightbox.className = "gallery-lightbox";
        lightbox.setAttribute("aria-hidden", "true");
        closeButton.className = "gallery-lightbox-close";
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "close");
        closeButton.textContent = "×";
        lightbox.append(closeButton, lightboxImage);
        document.body.appendChild(lightbox);

        const closeLightbox = () => {
            lightbox.classList.remove("open");
            lightbox.setAttribute("aria-hidden", "true");
            lightboxImage.removeAttribute("src");
        };

        galleryLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                lightboxImage.src = link.href;
                lightbox.classList.add("open");
                lightbox.setAttribute("aria-hidden", "false");
            });
        });
        closeButton.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeLightbox();
            }
        });
    }

});
