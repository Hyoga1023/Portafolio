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
