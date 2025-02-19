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

  // Ajustar el tamaño del panel para que sea un poco más pequeño al centrarse
  const panelScale = scale * 0.9;

  // Ajustar el desplazamiento vertical para mover hacia arriba (1.5 cm ~ 56.7 px)
  const verticalOffset = 1.5 * 37.8; // 1.5 cm en px

  // Aplicar la transformación con límites para centrar el panel
  panel.style.position = 'fixed'; // Fijar el panel para evitar el desbordamiento
  panel.style.top = `calc(50% - ${verticalOffset}px)`;
  panel.style.left = '50%';
  panel.style.transform = `
    translate(-50%, -50%)
    translateZ(50px)
    scale(${panelScale})
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

// Lista de datos espaciales para mostrar
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
  // Puedes añadir más datos aquí
];

// Crear puntos de datos flotantes
function createDataPoints() {
  const container = document.querySelector('.container'); // o el contenedor que desees usar
  spaceData.forEach(data => {
    const dataPoint = document.createElement('div');
    dataPoint.classList.add('data-point');
    dataPoint.style.left = `${Math.random() * 100}vw`;
    dataPoint.style.top = `${Math.random() * 100}vh`;
    dataPoint.innerHTML = `<strong>${data.name}</strong><br>${data.coordinates}`;
    container.appendChild(dataPoint);
  });
}

// Llamar a la función para crear puntos de datos
createDataPoints();
