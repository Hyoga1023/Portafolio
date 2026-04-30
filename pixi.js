(function () {
        try {
          const app = new PIXI.Application({
            view: document.getElementById("pixi-canvas"),
            resizeTo: window,
            backgroundAlpha: 0,
            antialias: true,
          });
          const particles = [];
          const count = window.innerWidth < 600 ? 40 : 100;
          for (let i = 0; i < count; i++) {
            const g = new PIXI.Graphics();
            const isYellow = Math.random() > 0.7;
            g.beginFill(isYellow ? 0xffd700 : 0x333333, isYellow ? 0.9 : 0.5);
            const size = Math.random() * 2 + 0.5;
            g.drawCircle(0, 0, size);
            g.endFill();
            g.x = Math.random() * app.screen.width;
            g.y = Math.random() * app.screen.height;
            g.vx = (Math.random() - 0.5) * 0.4;
            g.vy = (Math.random() - 0.5) * 0.4;
            app.stage.addChild(g);
            particles.push(g);
          }
          app.ticker.add(() => {
            particles.forEach((p) => {
              p.x += p.vx;
              p.y += p.vy;
              if (p.x < 0) p.x = app.screen.width;
              if (p.x > app.screen.width) p.x = 0;
              if (p.y < 0) p.y = app.screen.height;
              if (p.y > app.screen.height) p.y = 0;
            });
          });
        } catch (e) {
          console.warn("PixiJS init error:", e);
        }
      })();