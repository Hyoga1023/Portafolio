// Seleccionar todos los paneles
const panels = document.querySelectorAll('.menu-panel');

// Función para calcular la escala basada en el ancho de la pantalla
function getResponsiveScale() {
  const width = window.innerWidth;
  if (width < 768) return 0.8;        // Móvil
  if (width < 1024) return 0.85;      // Tablet
  if (width < 1366) return 0.9;       // Laptop pequeña
  if (width < 1600) return 0.95;      // Laptop grande
  return 1;                           // Pantallas más grandes
}

// Función para centrar el panel activo
function centerPanel(panel) {
  const scale = getResponsiveScale();
  const rect = panel.getBoundingClientRect();

  // Calcular el centro de la pantalla
  const screenCenterX = window.innerWidth / 2;
  const screenCenterY = window.innerHeight / 2;

  // Calcular el centro del panel
  const panelCenterX = rect.left + rect.width / 2;
  const panelCenterY = rect.top + rect.height / 2;

  // Calcular el desplazamiento necesario
  let offsetX = screenCenterX - panelCenterX;
  let offsetY = screenCenterY - panelCenterY;

  // Aplicar la transformación con límites para centrar el panel
  panel.style.position = 'fixed'; // Fijar el panel para evitar el desbordamiento
  panel.style.top = '50%';
  panel.style.left = '50%';
  panel.style.transform = `
    translate(-50%, -50%)
    translateZ(50px)
    scale(${scale})
  `;
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
      p.style.position = '';
      p.style.top = '';
      p.style.left = '';
      p.style.transform = '';
    });

    // Ocultar los paneles no seleccionados
    panels.forEach(p => {
      if (p !== panel) {
        p.classList.add('hidden');
      }
    });

    // Activar el panel seleccionado y centrarlo
    panel.classList.add('active');
    centerPanel(panel);
  });
});

// Restaurar todos los paneles al hacer clic fuera
document.addEventListener('click', () => {
  panels.forEach(panel => {
    panel.classList.remove('active');
    panel.classList.remove('hidden');
    panel.style.position = '';
    panel.style.top = '';
    panel.style.left = '';
    panel.style.transform = '';
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
  }, 250); // Esperar 250ms después del último evento de resize
});
