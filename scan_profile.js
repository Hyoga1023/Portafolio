(function () {
  const fragmentShader = `
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform sampler2D uDepthMap;
    uniform float uTime;
    uniform float uScanProgress;

    float edgeDetection(vec2 uv) {
      vec2 texel = 1.0 / vec2(512.0);
      float tl = length(texture2D(uSampler, uv + vec2(-texel.x, -texel.y)).rgb);
      float tr = length(texture2D(uSampler, uv + vec2( texel.x, -texel.y)).rgb);
      float bl = length(texture2D(uSampler, uv + vec2(-texel.x,  texel.y)).rgb);
      float br = length(texture2D(uSampler, uv + vec2( texel.x,  texel.y)).rgb);
      return smoothstep(0.15, 0.85, abs(tl - br) + abs(tr - bl));
    }

    float scanPattern(vec2 uv, float intensity) {
      float grid = sin(uv.x * 50.0 + uTime * 0.5) * cos(uv.y * 40.0);
      float wave = sin(uv.y * 25.0 + uTime * 1.5) * 0.5 + 0.5;
      return (grid * 0.4 + wave * 0.6) * intensity;
    }

    void main() {
      vec2 uv = vTextureCoord;
      vec4 color = texture2D(uSampler, uv);
      float depth = texture2D(uDepthMap, uv).r;
      float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      float edges = edgeDetection(uv);
      vec3 finalColor = color.rgb;
      vec3 scanColor = vec3(0.933, 0.718, 0.012);

      float scanPos = uScanProgress - depth * 0.25;
      float distToScan = abs(uv.y - scanPos);
      float scanVisibility = smoothstep(1.0, 0.9, uScanProgress);

      if (brightness > 0.05 && max(max(color.r, color.g), color.b) > 0.05) {
        if (distToScan < 0.12 && scanVisibility > 0.0) {
          float scanIntensity = (1.0 - distToScan / 0.12) * scanVisibility;
          float pattern = scanPattern(uv, scanIntensity);
          vec2 distortion = vec2(
            sin(uv.y * 60.0 + uTime) * 0.003,
            cos(uv.x * 40.0 + uTime) * 0.002
          ) * scanIntensity;
          finalColor = mix(finalColor, texture2D(uSampler, uv + distortion).rgb, 0.25);
          finalColor += scanColor * pattern * (edges * 0.8 + 0.2) * scanVisibility;
        }

        if (distToScan < 0.006 && scanVisibility > 0.0) {
          float lineIntensity = (0.006 - distToScan) / 0.006;
          finalColor += scanColor * lineIntensity * (brightness + 0.3) * scanVisibility;
        }

        for (float i = 1.0; i <= 2.0; i++) {
          float offset = i * 0.015;
          float secDist = abs(distToScan - offset);
          if (secDist < 0.004 && scanVisibility > 0.0) {
            float secIntensity = (0.004 - secDist) / 0.004;
            finalColor += scanColor * secIntensity * (0.3 / i) * scanVisibility;
          }
        }

        if (scanVisibility > 0.0) {
          float glow = exp(-distToScan * 12.0) * 0.12 * (brightness + 0.3);
          finalColor += scanColor * glow * scanVisibility;
        }
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function makeDepth() {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#000000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    return PIXI.Texture.from(c);
  }

  function isMobile() {
    return window.innerWidth <= 900;
  }

  function setup(app, W, H, shader, colorTex, depthTex) {
    const imgW = colorTex.width;
    const imgH = colorTex.height;

    const sprite = new PIXI.Sprite(colorTex);
    sprite.anchor.set(0.5);

    const container = new PIXI.Container();
    container.addChild(sprite);

    let renderTex = PIXI.RenderTexture.create({ width: W, height: H });
    const quad = new PIXI.Sprite(renderTex);
    quad.width  = W;
    quad.height = H;

    function applyContain(w, h) {
      const scale = Math.min(w / imgW, h / imgH);
      sprite.width  = imgW * scale;
      sprite.height = imgH * scale;
      sprite.position.set(w / 2, h / 2);
      renderTex = PIXI.RenderTexture.create({ width: w, height: h });
      app.renderer.render(container, { renderTexture: renderTex });
      quad.texture = renderTex;
      quad.width   = w;
      quad.height  = h;
    }

    const filter = new PIXI.Filter(null, shader, {
      uTime: 0,
      uScanProgress: 0,
      uDepthMap: depthTex,
    });
    quad.filters = [filter];
    app.stage.addChild(quad);

    applyContain(W, H);

    let progress = 0;
    let scanning = true;
    let speed = 0.015;

    function startScan() {
      progress = 0;
      speed = 0.015;
      scanning = true;
    }

    app.ticker.add((delta) => {
      app.renderer.render(container, { renderTexture: renderTex, clear: true });
      filter.uniforms.uTime += delta * 0.015;
      if (scanning) {
        progress += delta * speed;
        filter.uniforms.uScanProgress = progress;
        if (progress >= 1) {
          scanning = false;
          const pausa = 1000 + Math.random() * 7000;
          setTimeout(startScan, pausa);
        }
      }
    });

    const ro = new ResizeObserver(() => {
      const f = app.view.parentElement;
      const nW = f.offsetWidth;
      const nH = f.offsetHeight;
      if (!nW || !nH) return; // evitar resize con dimensiones 0 en móvil
      app.renderer.resize(nW, nH);
      renderTex.resize(nW, nH);
      quad.width  = nW;
      quad.height = nH;
      applyContain(nW, nH);
    });
    ro.observe(app.view.parentElement);
  }

  function initScan() {
    const canvas = document.getElementById("scan-canvas");
    if (!canvas) return;

    // En móvil 
    if (isMobile()) {
  canvas.style.display = "none";
  const frame = canvas.parentElement;

  // Wrapper
  const wrap = document.createElement("div");
  wrap.className = "scan-mobile-wrap";

  // Pausa aleatoria entre escaneos via CSS custom property
  const delay = (Math.random() * 2).toFixed(2);
  wrap.style.setProperty("--scan-delay", `${delay}s`);

  // Foto base
  const img = document.createElement("img");
  img.src = "img/foto_perfil.jpg";
  img.alt = "Foto Cesar Martinez";
  img.className = "sobre-img-mobile";

  // Capas glitch amarillo y naranja
  const glitchA = document.createElement("img");
  glitchA.src = "img/foto_perfil.jpg";
  glitchA.className = "sobre-img-mobile-glitch amarillo";

  const glitchB = document.createElement("img");
  glitchB.src = "img/foto_perfil.jpg";
  glitchB.className = "sobre-img-mobile-glitch naranja";

  wrap.appendChild(img);
  wrap.appendChild(glitchA);
  wrap.appendChild(glitchB);
  frame.appendChild(wrap);
  return;
}

    // Desktop: efecto completo
    const frame = canvas.parentElement;
    const W = frame.offsetWidth  || 400;
    const H = frame.offsetHeight || 533;

    const app = new PIXI.Application({
      view: canvas,
      width: W,
      height: H,
      backgroundAlpha: 0,
      antialias: true,
    });

    PIXI.Assets.load([
      "img/foto_perfil.jpg",
      "img/foto_perfil_blanco_y_negro.png",
    ])
    .then((assets) => {
      setup(
        app, W, H, fragmentShader,
        assets["img/foto_perfil.jpg"],
        assets["img/foto_perfil_blanco_y_negro.png"]
      );
    })
    .catch(() => {
      PIXI.Assets.load("img/foto_perfil.jpg")
        .then((tex) => setup(app, W, H, fragmentShader, tex, makeDepth()))
        .catch(() => console.warn("Scan: no se pudo cargar foto_perfil.jpg"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScan);
  } else {
    initScan();
  }
})();