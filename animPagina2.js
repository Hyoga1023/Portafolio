// Seleccionar todos los paneles
const panels = document.querySelectorAll('.menu-panel');

// Función para centrar el panel activo
function centerPanel(panel) {
  if (window.innerWidth > 768) { // Solo centrar en pantallas grandes
    const rect = panel.getBoundingClientRect();
    const centerX = window.innerWidth / 3 - (rect.left + rect.width /3);
    const centerY = window.innerHeight / 7 - (rect.top + rect.height / 7);
    panel.style.transform = `translate(${centerX}px, ${centerY}px) translateZ(100px) scale(0.9)`;
  } else {
    // En pantallas pequeñas, simplemente centramos el panel
    panel.style.transform = 'none';
  }
}

// Manejar el clic en cada panel
panels.forEach(panel => {
  panel.addEventListener('click', (e) => {
    e.stopPropagation();

    if (panel.classList.contains('active')) return;

    panels.forEach(p => {
      p.classList.remove('active');
      p.classList.remove('hidden');
      p.style.transform = '';
    });

    panels.forEach(p => {
      if (p !== panel) {
        p.classList.add('hidden');
      }
    });

    panel.classList.add('active');
    centerPanel(panel);
  });
});

// Al hacer clic en cualquier parte fuera de un panel, se restauran todos
document.addEventListener('click', () => {
  panels.forEach(panel => {
    panel.classList.remove('active');
    panel.classList.remove('hidden');
    panel.style.transform = '';
  });
});