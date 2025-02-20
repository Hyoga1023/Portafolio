// Seleccionar todos los paneles
const panels = document.querySelectorAll('.menu-panel');

// Función para determinar si estamos en móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para calcular la escala basada en el ancho de la pantalla
function getResponsiveScale() {
    const width = window.innerWidth;
    if (width < 768) return 1;         // Móvil - sin escala
    if (width < 1024) return 0.85;     // Tablet
    if (width < 1366) return 0.9;      // Laptop pequeña
    if (width < 1600) return 0.95;     // Laptop grande
    return 1;                          // Pantallas más grandes
}

// Función para centrar el panel activo
function centerPanel(panel) {
    if (isMobile()) {
        // Comportamiento específico para móvil
        panel.style.position = 'relative';
        panel.style.top = '0';
        panel.style.left = '0';
        panel.style.transform = 'none';
        panel.style.width = 'calc(100% - 20px)';
        panel.style.margin = '10px auto';
        
        // Scroll suave hacia el panel
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Comportamiento para desktop
        const scale = getResponsiveScale();
        const rect = panel.getBoundingClientRect();
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const verticalOffset = isMobile() ? 0 : 1.5 * 37.8; // Solo aplicar offset en desktop

        panel.style.position = 'fixed';
        panel.style.top = `calc(50% - ${verticalOffset}px)`;
        panel.style.left = '50%';
        panel.style.transform = `
            translate(-50%, -50%)
            translateZ(50px)
            scale(${scale * 0.9})
        `;
    }
}

// Función para restablecer el panel
function resetPanel(panel) {
    if (isMobile()) {
        panel.style.position = 'relative';
        panel.style.width = 'calc(100% - 20px)';
        panel.style.margin = '10px auto';
        panel.style.transform = 'none';
    } else {
        panel.style.position = '';
        panel.style.top = '';
        panel.style.left = '';
        panel.style.transform = '';
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
            resetPanel(p);
        });

        // En móvil, no ocultamos los otros paneles
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

        // Expandir el contenido
        const expandedContent = panel.querySelector('.expanded-content');
        if (expandedContent) {
            expandedContent.style.display = 'block';
        }
    });
});

// Restaurar todos los paneles al hacer clic fuera
document.addEventListener('click', () => {
    if (!isMobile()) {
        panels.forEach(panel => {
            panel.classList.remove('active');
            panel.classList.remove('hidden');
            resetPanel(panel);
            
            // Ocultar contenido expandido
            const expandedContent = panel.querySelector('.expanded-content');
            if (expandedContent) {
                expandedContent.style.display = 'none';
            }
        });
    }
});

// Manejar cambios de tamaño de ventana
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const activePanel = document.querySelector('.menu-panel.active');
        if (activePanel) {
            if (isMobile()) {
                resetPanel(activePanel);
            } else {
                centerPanel(activePanel);
            }
        }
    }, 250);
});

// Función para limpiar efectos visuales en móvil
function cleanupVisualEffects() {
    if (isMobile()) {
        const elements = document.querySelectorAll('.data-point, .star-particle, .hologram-effect, .circle-indicator, .floating-element, .grid-lines');
        elements.forEach(el => el.style.display = 'none');
    }
}

// Llamar a la limpieza inicial
cleanupVisualEffects();

// También limpiar en resize
window.addEventListener('resize', cleanupVisualEffects);