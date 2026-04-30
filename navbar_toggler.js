      document
        .getElementById("navToggle")
        .addEventListener("click", function () {
          document.getElementById("navLinks").classList.toggle("open");
        });
      document.querySelectorAll(".nav-links a").forEach((a) => {
        a.addEventListener("click", () =>
          document.getElementById("navLinks").classList.remove("open"),
        );
      });