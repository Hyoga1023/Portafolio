(function () {
        const btn = document.getElementById("btnTop");
        const threshold = window.innerHeight * 1.8;
        let visible = false;
        ScrollTrigger.create({
          start: threshold + " top",
          onEnter: () => {
            if (visible) return;
            visible = true;
            btn.classList.add("visible");
            gsap.fromTo(
              btn,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
            );
          },
          onLeaveBack: () => {
            if (!visible) return;
            visible = false;
            gsap.to(btn, {
              y: 20,
              opacity: 0,
              duration: 0.35,
              ease: "power2.in",
              onComplete: () => btn.classList.remove("visible"),
            });
          },
        });
        // pulso idle
        gsap.to(btn, {
          scale: 1.08,
          repeat: -1,
          yoyo: true,
          duration: 1.2,
          ease: "sine.inOut",
          paused: false,
          delay: 2,
        });
      })();