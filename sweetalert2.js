      const swalCyber = {
        background: "#111111",
        color: "#ffffff",
        confirmButtonColor: "#FFD700",
        iconColor: "#FFD700",
        customClass: { popup: "swal-cyber", confirmButton: "swal-btn-cyber" },
      };
      const swalCSS = document.createElement("style");
      swalCSS.textContent = `.swal-cyber{border:1px solid #FFD700 !important;font-family:'Space Mono',monospace !important;}.swal-btn-cyber{font-family:'Space Mono',monospace !important;letter-spacing:2px;text-transform:uppercase;color:#000 !important;font-size:.75rem !important;}`;
      document.head.appendChild(swalCSS);

      function verProyecto(nombre, tech, desc) {
        Swal.fire({
          ...swalCyber,
          title: `<span style="font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#FFD700">${nombre}</span>`,
          html: `<p style="font-family:'Space Mono',monospace;font-size:.75rem;letter-spacing:2px;color:#FFD700;margin-bottom:1rem">${tech}</p><p style="color:#ccc;line-height:1.8;font-size:.9rem">${desc}</p>`,
          confirmButtonText: "Cerrar ←",
        });
      }

      function enviarForm(e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        Swal.fire({
          ...swalCyber,
          icon: "success",
          title: `<span style="font-family:'Bebas Neue',sans-serif;color:#FFD700">¡Mensaje enviado!</span>`,
          html: `<p style="color:#ccc">Gracias <strong style="color:#FFD700">${nombre}</strong>, te contactaré pronto.</p>`,
          confirmButtonText: "Perfecto →",
        });
        document.getElementById("contactForm").reset();
      }