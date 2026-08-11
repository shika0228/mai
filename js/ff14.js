document.addEventListener('DOMContentLoaded', () => {
    // 1. Header 滚动交互
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. 通用滚动观察器
    const observerOptions = {
        threshold: 0.15 // 元素出现15%时触发
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 添加激活类名
                entry.target.classList.add('is-visible');
                // 触发后停止观察（只播放一次）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 绑定 About 图片
    const aboutInfo = document.querySelector('.about-info');
    if (aboutInfo) observer.observe(aboutInfo);

    // 绑定所有采访内容
    const interviewItems = document.querySelectorAll('.interview-content');
    interviewItems.forEach(item => observer.observe(item));
});