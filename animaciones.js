// Crear el puntero futurista
const futuristicCursor = document.createElement("div");
futuristicCursor.classList.add("futuristic-cursor");
document.body.appendChild(futuristicCursor);

// Mover el puntero según la posición del mouse
document.addEventListener("mousemove", (e) => {
  futuristicCursor.style.top = `${e.clientY}px`;
  futuristicCursor.style.left = `${e.clientX}px`;
});

// Agregar efecto al hacer clic
document.addEventListener("mousedown", () => {
  futuristicCursor.style.transform = "scale(1.3) translate(-50%, -50%) rotate(45deg)";
  futuristicCursor.style.boxShadow = "0 0 30px 10px #00ffff, 0 0 50px 20px #0066ff";
});

document.addEventListener("mouseup", () => {
  futuristicCursor.style.transform = "scale(1) translate(-50%, -50%) rotate(45deg)";
  futuristicCursor.style.boxShadow = "0 0 15px 3px #00ffff, 0 0 30px 10px #0066ff";
});

// Cargar sonidos
const sonidoLista = new Audio('audio/Sonidos_Lista.wav');
const sonidoAmbiente = new Audio('audio/Sonido_ambiente_Laboratorio.wav');

// Ajustar volumen del sonido de la lista
sonidoLista.volume = 0.2; // Cambia 0.3 por el nivel de volumen que prefieras (de 0.0 a 1.0)

// Reproducir sonido ambiente en loop
sonidoAmbiente.loop = true;
sonidoAmbiente.volume = 0.5;
sonidoAmbiente.play().catch(err => {
  console.log("El sonido de ambiente no se puede reproducir automáticamente:", err);
});

// Seleccionar todas las opciones del menú
const menuOptions = document.querySelectorAll('.menu-options li');

menuOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Reproducir sonido al hacer clic
    sonidoLista.currentTime = 0; // Reinicia el sonido
    sonidoLista.play();

    // Agregar la clase que activa la animación
    option.classList.add('flash-green');

    // Esperar a que termine el sonido
    sonidoLista.addEventListener('ended', () => {
      // Quitar la clase de animación
      option.classList.remove('flash-green');

      // Redirigir a la URL especificada en el atributo data-url
      const url = option.getAttribute('data-url');
      if (url) {
        window.location.href = url;
      }
    }, { once: true }); // Asegura que el evento solo se dispare una vez
  });
});
