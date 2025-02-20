// Seleccionar todos los paneles
const panels = document.querySelectorAll('.menu-panel');

// Función para determinar si estamos en móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para calcular la escala basada en el ancho de la pantalla
function getResponsiveScale() {
    const width = window.innerWidth;
    if (width < 768) return 1;        // Móvil
    if (width < 1024) return 0.85;    // Tablet
    if (width < 1366) return 0.9;     // Laptop pequeña
    if (width < 1600) return 0.95;    // Laptop grande
    return 1;                         // Pantallas más grandes
}

// Función para centrar el panel activo
function centerPanel(panel) {
    if (isMobile()) {
        // Comportamiento móvil simplificado
        panel.style.position = 'relative';
        panel.style.top = '0';
        panel.style.left = '0';
        panel.style.transform = 'none';
        
        // Scroll suave hacia el panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Comportamiento original para desktop
        const rect = panel.getBoundingClientRect();
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const panelCenterX = rect.left + rect.width / 2;
        const panelCenterY = rect.top + rect.height / 2;
        const verticalOffset = 1.5 * 37.8;

        panel.style.position = 'fixed';
        panel.style.top = `calc(50% - ${verticalOffset}px)`;
        panel.style.left = '50%';
        panel.style.transform = `
            translate(-50%, -50%)
            translateZ(50px)
            scale(0.9)
        `;
    }
}

// Manejar el clic en cada panel
panels.forEach(panel => {
    panel.addEventListener('click', (e) => {
        e.stopPropagation();

        // Si el panel ya está activo, no hacer nada
        if (panel.classList.contains('active')) return;

        // Desactivar y mostrar todos los paneles primero
        panels.forEach(p => {
            p.classList.remove('active');
            p.classList.remove('hidden');
            if (isMobile()) {
                p.style.position = 'relative';
                p.style.transform = 'none';
            } else {
                // Restaurar posición original en desktop
                p.style.position = '';
                p.style.top = '';
                p.style.left = '';
                p.style.transform = p.dataset.originalTransform || '';
            }
        });

        // En desktop, ocultar los otros paneles
        if (!isMobile()) {
            panels.forEach(p => {
                if (p !== panel) {
                    p.classList.add('hidden');
                }
            });
        }

        // Activar el panel seleccionado y centrarlo
        panel.classList.add('active');
        centerPanel(panel);
    });
});

// Guardar las transformaciones originales al cargar
panels.forEach(panel => {
    const style = window.getComputedStyle(panel);
    panel.dataset.originalTransform = style.transform;
});

// Restaurar todos los paneles al hacer clic fuera
document.addEventListener('click', () => {
    panels.forEach(panel => {
        panel.classList.remove('active');
        panel.classList.remove('hidden');
        
        if (isMobile()) {
            panel.style.position = 'relative';
            panel.style.transform = 'none';
        } else {
            // Restaurar estado original en desktop
            panel.style.position = '';
            panel.style.top = '';
            panel.style.left = '';
            panel.style.transform = panel.dataset.originalTransform || '';
        }
    });
});

// Manejar cambios de tamaño de ventana
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const activePanel = document.querySelector('.menu-panel.active');
        if (activePanel) {
            centerPanel(activePanel);
        }
    }, 250);
});

const spaceData = [
  { name: "Andromeda", coordinates: "RA 00h 42m 44s | Dec +41° 16′ 9″" },
  { name: "Orion Nebula", coordinates: "RA 05h 35m 17s | Dec -05° 23′ 28″" },
  { name: "Milky Way", coordinates: "RA 17h 45m 40s | Dec -29° 00′ 28″" },
  { name: "Sirius", coordinates: "RA 06h 45m 9s | Dec -16° 42′ 58″" },
  { name: "Betelgeuse", coordinates: "RA 05h 55m 10s | Dec +07° 24′ 25″" },
  { name: "Alpha Centauri", coordinates: "RA 14h 39m 36s | Dec -60° 50′ 02″" },
  { name: "Vega", coordinates: "RA 18h 36m 56s | Dec +38° 47′ 01″" },
  { name: "Polaris", coordinates: "RA 02h 31m 49s | Dec +89° 15′ 51″" },
  { name: "Aldebaran", coordinates: "RA 04h 35m 55s | Dec +16° 30′ 33″" },
  { name: "Spica", coordinates: "RA 13h 25m 11s | Dec -11° 09′ 41″" }
];


// Crear puntos de datos flotantes
function createDataPoints() {
    if (isMobile()) return;
    const container = document.querySelector('.container');
    spaceData.forEach(data => {
        const dataPoint = document.createElement('div');
        dataPoint.classList.add('data-point');
        dataPoint.style.left = `${Math.random() * 100}vw`;
        dataPoint.style.top = `${Math.random() * 100}vh`;
        dataPoint.innerHTML = `<strong>${data.name}</strong><br>${data.coordinates}`;
        container.appendChild(dataPoint);
    });
}

// Crear partículas estelares
function createStarParticles() {
    if (isMobile()) return;
    const container = document.querySelector('.container');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('star-particle');
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        container.appendChild(particle);
        animateParticle(particle);
    }
}

// Animar partículas estelares
function animateParticle(particle) {
    if (isMobile()) return;
    const duration = Math.random() * 5 + 5;
    particle.style.transition = `transform ${duration}s linear`;
    particle.style.transform = `translateX(${Math.random() * 10 - 5}vw) translateY(${Math.random() * 10 - 5}vh) scale(${Math.random() * 0.5 + 0.5})`;

    particle.addEventListener('transitionend', () => {
        particle.style.transition = 'none';
        particle.style.transform = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                animateParticle(particle);
            });
        });
    });
}

// Inicializar efectos
createDataPoints();
createStarParticles();