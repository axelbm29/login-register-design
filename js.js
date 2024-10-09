document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar los elementos para el scroll de categorías y flechas
  const categoryList = document.getElementById("category-list");
  const leftArrow = document.getElementById("left-arrow");
  const rightArrow = document.getElementById("right-arrow");

  // Seleccionar los botones de categorías y las tarjetas de productos
  const categoryButtons = document.querySelectorAll(".btn-lista-tipoComida");
  const productCards = document.querySelectorAll(".col-6");

  // Crear un array con las categorías en orden
  const categories = ["hamburguesas", "adicionales", "alitas", "otros"];
  let currentCategoryIndex = 0;

  // Función para filtrar productos por categoría
  function filterProducts(category) {
    productCards.forEach((card) => {
      const productCategory = card.getAttribute("data-category");
      if (category === "todos" || productCategory === category) {
        card.style.display = "block"; // Mostrar tarjeta
      } else {
        card.style.display = "none"; // Ocultar tarjeta
      }
    });

    // Actualizar el estado visual del botón seleccionado
    categoryButtons.forEach((button) => {
      if (button.innerText.toLowerCase() === category) {
        button.classList.add("selected"); // Agregar clase al botón seleccionado
      } else {
        button.classList.remove("selected"); // Remover clase del resto
      }
    });
  }

  // Evento para las flechas - Mover el scroll del listado de categorías
  function updateArrows() {
    leftArrow.disabled = categoryList.scrollLeft === 0;
    rightArrow.disabled =
      categoryList.scrollLeft + categoryList.clientWidth >=
      categoryList.scrollWidth;
  }

  rightArrow.addEventListener("click", () => {
    categoryList.scrollBy({ left: 300, behavior: "smooth" });
  });

  leftArrow.addEventListener("click", () => {
    categoryList.scrollBy({ left: -300, behavior: "smooth" });
  });

  // Actualizar las flechas cuando se hace scroll
  updateArrows();
  categoryList.addEventListener("scroll", updateArrows);

  // Asignar evento click a cada botón de categoría
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Obtener la categoría del botón presionado
      const selectedCategory = this.innerText.toLowerCase();
      // Filtrar productos según la categoría seleccionada
      filterProducts(selectedCategory);
    });
  });

  // Mostrar "Hamburguesas" por defecto al cargar la página
  filterProducts("hamburguesas");
});
