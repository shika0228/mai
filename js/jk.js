// ==========================================
// GSAP 滚动动画逻辑 - 丝滑滚动增强版
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// 1. .about 的放大效果：当元素的中心到达视窗中心时完成 scale 1
gsap.fromTo(".about",
    { scale: 0.8 },
    {
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    }
);

// 2. .about 固定 (直到 .chatroom 的中心到达屏幕中心)
ScrollTrigger.create({
    trigger: ".about",
    start: "center center",
    endTrigger: ".chatroom",
    end: "center center",
    pin: true,
    pinSpacing: false
});

// 3. .about 渐渐透明消失
gsap.to(".about", {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
        trigger: ".chatroom",
        start: "top 55%",
        end: "center center",
        scrub: true
    }
});

// 4. .chatroom 的 3D 梯形视觉差效果
gsap.set(".chatroom", { transformPerspective: 1200, transformOrigin: "top center" });
gsap.fromTo(".chatroom",
    {
        rotationX: -25,
        scale: 0.9
    },
    {
        rotationX: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".chatroom",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    }
);

// 5. 对话气泡动画
const chatImages = ["#chat-1", "#chat-2", "#chat-3", "#chat-4"];
chatImages.forEach((id, index) => {
    // 前两个(0,1)从右进，后两个(2,3)从左进
    const direction = index < 2 ? 60 : -60;
    gsap.set(id, { opacity: 0, x: direction });
});

const chatTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: ".chatroom",
        start: "top 70%",
        end: "center center",
        scrub: 0.5
    }
});

// 通过 scrub 平分动画距离
chatTimeline.to("#chat-1", { opacity: 1, x: 0, duration: 1 })
            .to("#chat-2", { opacity: 1, x: 0, duration: 1 }, "-=0.4")
            .to("#chat-3", { opacity: 1, x: 0, duration: 1 }, "-=0.4")
            .to("#chat-4", { opacity: 1, x: 0, duration: 1 }, "-=0.4");

// ==========================================
// 6. 手机界面 (phonechat) 内对话气泡依次出现特效
// ==========================================
gsap.set(".interview-content", { transformOrigin: "bottom left" }); // 设置变换基点，使其有从左下角冒出来的感觉

gsap.fromTo(".interview-content",
    {
        opacity: 0,
        y: 40,        // 初始位置往下偏移
        scale: 0.8    // 初始缩放较小
    },
    {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.3, // 每个气泡依次弹出的间隔时间(秒)
        ease: "back.out(1.5)", // 带来像真实聊天框弹出的那种"Q弹"物理感
        scrollTrigger: {
            trigger: ".phonechat",
            start: "top 60%", // 当手机区域到达视窗 60% 高度时触发
            // 如果希望动画出现一次就不再重复，可以删掉下面这行；
            // 现在的设置是向下滚动触发，滚回到上面会重新隐去。
            toggleActions: "play none none reverse"
        }
    }
);

// ==========================================
// 原有的 Particles 粒子特效代码保留
// ==========================================
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
      "enable": false,
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
        "enable": false,
      },
      "onclick": {
        "enable": false,
      },
      "resize": true
    }
  },
  "retina_detect": true
});
