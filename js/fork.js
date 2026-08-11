document.addEventListener("DOMContentLoaded", function() {
    const loader = document.getElementById('fork-loader');
    if (loader) {
        const startedAt = performance.now();
        let loaderHidden = false;
        const announceLoaderHidden = () => {
            document.dispatchEvent(new Event('forkLoaderHidden'));
        };
        const hideLoader = () => {
            if (loaderHidden) return;
            loaderHidden = true;
            const remaining = Math.max(0, 1650 - (performance.now() - startedAt));
            window.setTimeout(() => {
                loader.classList.add('is-ending');
                window.setTimeout(() => {
                    loader.classList.add('is-hidden');
                    window.setTimeout(() => {
                        loader.remove();
                        announceLoaderHidden();
                    }, 1050);
                }, 520);
            }, remaining);
        };

        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader, { once: true });
        }
        window.setTimeout(hideLoader, 3200);
    } else {
        window.setTimeout(() => document.dispatchEvent(new Event('forkLoaderHidden')), 0);
    }

    // ==========================================
    // 1. 血迹特效逻辑 (IntersectionObserver)
    // ==========================================
    const startBloodAnimation = () => {
        const bloodLeft = document.querySelector('.blood-left');
        const bloodRight = document.querySelector('.blood-right');
        const topSection = document.querySelector('.top');
        if (!topSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    if (bloodLeft) bloodLeft.classList.add('animate');
                    if (bloodRight) bloodRight.classList.add('animate');
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(topSection);
    };

    document.addEventListener('forkLoaderHidden', startBloodAnimation, { once: true });

    // ==========================================
    // 2. Story 区域蛋糕负片与离开中心闪烁逻辑
    // ==========================================
    const cake = document.querySelector('.story-cake');
    let lastDistance = null;
    let isTicking = false;

    window.addEventListener('scroll', () => {
        if (!cake) return;
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const rect = cake.getBoundingClientRect();
                const cakeCenterY = rect.top + rect.height / 2;
                const viewportCenterY = window.innerHeight / 2;
                const distance = Math.abs(viewportCenterY - cakeCenterY);
                const maxDistance = window.innerHeight / 2;

                let invertValue = 0;
                if (distance < maxDistance) {
                    invertValue = ((1 - (distance / maxDistance)) * 100).toFixed(2);
                }
                cake.style.setProperty('--invert-val', `${invertValue}%`);

                if (lastDistance !== null) {
                    const isLeaving = distance > lastDistance;
                    // 当离开中心线时触发短促闪烁
                    if (isLeaving && distance > 20 && distance < 200) {
                        cake.classList.add('flicker');
                    } else {
                        cake.classList.remove('flicker');
                    }
                }
                lastDistance = distance;
                isTicking = false;
            });
            isTicking = true;
        }
    });

    // ==========================================
    // 3. Profile 区域 PC 端人物鬼气出现逻辑
    // ==========================================
    const wrapper = document.querySelector('.profile-content-wrapper');
    const profileThan = document.getElementById('profile-than');
    const profileMai = document.getElementById('profile-mai');

    const profileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                if(profileThan) profileThan.classList.add('animate-ghost');
                if(profileMai) profileMai.classList.add('animate-ghost');
                profileObserver.disconnect();
            }
        });
    }, {
        rootMargin: '0px 0px -50% 0px',
        threshold: 0
    });

    if(wrapper) profileObserver.observe(wrapper);

    // ==========================================
    // 4. [新增] 移动端 Profile 区域单个图片的自然 FadeUp 逻辑
    // ==========================================
    const spBoxes = document.querySelectorAll('.profile-box-sp');
    // 设置触发线为视口底部往上 15% 处，让元素露头一点点才自然浮现
    const spBoxObserver = new IntersectionObserver((entries, spObs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up');
                spObs.unobserve(entry.target); // 触发后即停止监听
            }
        });
    }, {
        rootMargin: '0px 0px -15% 0px',
        threshold: 0
    });

    spBoxes.forEach(box => {
        if(box) spBoxObserver.observe(box);
    });

});
