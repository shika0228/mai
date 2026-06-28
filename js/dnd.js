// 原本的粒子效果配置保持不变
if (typeof particlesJS === "function") {
  particlesJS("particles-js", {
    "particles": {
      "number": { "value": 18, "density": { "enable": true, "value_area": 1000 } },
      "shape": { "type": "image", "image": { "src": "img-dnd/leaf.webp", "width":50, "height":50 } },
      "opacity": { "value": 0.6, "random": true, "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.2, "sync": false } },
      "size": { "value": 15, "random": true, "anim": { "enable": false } },
      "line_linked": { "enable": false },
      "move": { "enable": true, "speed": 2.6, "direction": "bottom-right", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": true, "rotateX": 300, "rotateY": 600 } }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": false }, "resize": true },
      "modes": { "bubble": { "distance": 200, "size": 25, "duration": 2, "opacity": 0.8, "speed": 3 } }
    },
    "retina_detect": true
  });
}

  // =============== 以下为新增的视窗滚动效果逻辑 ===============
  document.addEventListener("DOMContentLoaded", () => {
      // 注册滚动插件
      gsap.registerPlugin(ScrollTrigger);
  
      /* 1. 视窗固定与解除 */
      // 将 .top-bg-wrapper 固定在屏幕上，直到 .profile 的底部到达屏幕底部时解除固定随之滑走。
      ScrollTrigger.create({
          trigger: ".top",
          start: "top top",
          endTrigger: ".profile",
          end: "bottom bottom",
          pin: ".top-bg-wrapper",
          pinSpacing: false // 防止多余占位，允许下方元素直接覆盖上来
      });
  
      /* 2. 背景变暗及模糊效果 */
      // 当 .story 进入视窗上方 70% 位置时，激活遮罩类名
      ScrollTrigger.create({
          trigger: ".story",
          start: "top 70%",
          onEnter: () => document.querySelector('.top-bg-overlay').classList.add('active'),
          onLeaveBack: () => document.querySelector('.top-bg-overlay').classList.remove('active')
      });
  
      /* 3. Story 区块内的自然 fadeUp */
      const storyEls = document.querySelectorAll(".story .gem-wrapper, .story-title, .story-text");
      storyEls.forEach(el => {
          gsap.fromTo(el,
              { opacity: 0, y: 40 },
              {
                  opacity: 1, y: 0, duration: 1.2, ease: "power2.out",
                  scrollTrigger: {
                      trigger: el,
                      start: "top 85%", // 元素顶部到达视口85%时触发
                      toggleActions: "play none none none"
                  }
              }
          );
      });
  
      /* 4. Story 文字的滚动推进阅读效果 */
      // 改变 CSS 变量实现从 30% 到 100% 亮白色的文字高光效果
      gsap.to(".story-text", {
          "--read-progress": "100%",
          ease: "none",
          scrollTrigger: {
              trigger: ".story-text",
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.5 // 参数为数字时表示跟随会有 0.5s 平滑延迟，效果极佳
          }
      });

      const profileHeaderEls = document.querySelectorAll(".profile .gem-wrapper, .profile-title");
      profileHeaderEls.forEach(el => {
          gsap.fromTo(el,
              { opacity: 0, y: 40 },
              {
              opacity: 1, y: 0, duration: 1.2, ease: "power2.out",
                  scrollTrigger: {
                 trigger: el,
                      start: "top 85%",
                  toggleActions: "play none none none"
                  }
              }
          );
      });
  
      // Mai 和 Than 两个盒子的错位 fadeUp 动画（Mai 先出，Than 慢 0.3s）
      const profileTl = gsap.timeline({
          scrollTrigger: {
              trigger: ".profile-wrapper",
              start: "top 80%",
              toggleActions: "play none none none"
          }
      });
  
      profileTl.fromTo(".profile-mai",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
      )
      .fromTo(".profile-than",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
          "-=0.9" // 基于上一段动画提前0.9秒开始（即只延迟了 1.2 - 0.9 = 0.3秒）
      );
  });
