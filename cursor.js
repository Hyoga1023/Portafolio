const cursor = document.getElementById("cursor");
      const ring = document.getElementById("cursor-ring");
      let mx = 0,
        my = 0,
        rx = 0,
        ry = 0;
      document.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + "px";
        cursor.style.top = my + "px";
      });
      function animRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        requestAnimationFrame(animRing);
      }
      animRing();
      document.querySelectorAll("a,button,.proyecto-card").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.style.width = "20px";
          cursor.style.height = "20px";
          ring.style.width = "56px";
          ring.style.height = "56px";
          ring.style.opacity = ".5";
        });
        el.addEventListener("mouseleave", () => {
          cursor.style.width = "12px";
          cursor.style.height = "12px";
          ring.style.width = "36px";
          ring.style.height = "36px";
          ring.style.opacity = "1";
        });
      });
      // Cursor negro sobre fondos amarillos
      document
        .querySelectorAll(
          ".break-section, #btnTop, .hero-cta:hover, .btn-enviar:hover",
        )
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            cursor.style.background = "#000";
            cursor.style.mixBlendMode = "normal";
            ring.style.borderColor = "#000";
          });
          el.addEventListener("mouseleave", () => {
            cursor.style.background = "var(--amarillo)";
            cursor.style.mixBlendMode = "normal";
            ring.style.borderColor = "var(--amarillo)";
          });
        });