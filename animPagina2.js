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

// Función para obtener el desplazamiento vertical basado en el tamaño de la pantalla
function getVerticalOffset() {
  const height = window.innerHeight;
  if (height < 768) return 5;         // Pantallas bajas
  if (height < 900) return 6;         // Pantallas medianas
  return 7;                           // Pantallas altas
}

// Función mejorada para centrar el panel activo
function centerPanel(panel) {
  if (window.innerWidth > 768) {
    const rect = panel.getBoundingClientRect();
    const scale = getResponsiveScale();
    
    // Calcular el centro de la pantalla
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / getVerticalOffset();
    
    // Calcular el centro del panel
    const panelCenterX = rect.left + rect.width / 2;
    const panelCenterY = rect.top + rect.height / 2;
    
    // Calcular el desplazamiento necesario
    const offsetX = screenCenterX - panelCenterX;
    const offsetY = screenCenterY - panelCenterY;
    
    // Limitar el desplazamiento vertical para evitar desbordamiento
    const maxOffsetY = window.innerHeight * 0.2; // 20% de la altura de la ventana
    const clampedOffsetY = Math.max(Math.min(offsetY, maxOffsetY), -maxOffsetY);
    
    // Aplicar la transformación con límites
    panel.style.transform = `
      translate(${offsetX}px, ${clampedOffsetY}px) 
      translateZ(50px) 
      scale(${scale})
    `;
  } else {
    // En dispositivos móviles, usar una transformación más simple
    panel.style.transform = `
      translateZ(50px) 
      scale(${getResponsiveScale()})
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