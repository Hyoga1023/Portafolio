// Seleccionar todas las opciones del menú
const menuOptions = document.querySelectorAll('.menu-options li');

menuOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Agregar la clase que activa la animación
    option.classList.add('flash-green');

    // Esperar a que termine la animación y quitar la clase
    setTimeout(() => {
      option.classList.remove('flash-green');

      // Redirigir a la URL especificada en el atributo data-url
      const url = option.getAttribute('data-url');
      if (url) {
        window.location.href = url;
      }
    }, 600); // Duración igual a la animación en CSS (0.6s)
  });
});
// Crear el puntero futurista
const futuristicCursor = document.createElement("div");
futuristicCursor.classList.add("futuristic-cursor");
document.body.appendChild(futuristicCursor);

// Mover el puntero según la posición del mouse
document.addEventListener("mousemove", (e) => {
  futuristicCursor.style.top = `${e.clientY}px`; // Actualiza posición Y
  futuristicCursor.style.left = `${e.clientX}px`; // Actualiza posición X
});

// Agregar efecto al hacer clic
document.addEventListener("mousedown", () => {
  futuristicCursor.style.transform = "scale(1.3) translate(-50%, -50%) rotate(45deg)"; // Agranda la flecha
  futuristicCursor.style.boxShadow = "0 0 30px 10px #00ffff, 0 0 50px 20px #0066ff"; // Más brillo
});

document.addEventListener("mouseup", () => {
  futuristicCursor.style.transform = "scale(1) translate(-50%, -50%) rotate(45deg)"; // Vuelve al tamaño normal
  futuristicCursor.style.boxShadow = "0 0 15px 3px #00ffff, 0 0 30px 10px #0066ff"; // Menos brillo
});
