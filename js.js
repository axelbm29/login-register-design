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

  // Resumen de la orden
  const orderSummary = document.querySelector(".order-details tbody");
  const subtotalElement = document.getElementById("subtotal"); // Asegúrate de que el ID sea correcto

  let subtotal = 0;

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
    categoryList.scrollBy({ left: 720, behavior: "smooth" });
  });

  leftArrow.addEventListener("click", () => {
    categoryList.scrollBy({ left: -720, behavior: "smooth" });
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

  // Función para actualizar el resumen de la orden
  function updateOrder(productName, price, quantityChange) {
    console.log("Buscando producto:", productName);

    const existingRow = Array.from(orderSummary.rows).find(
      (row) =>
        row.cells[0].innerText.trim().toLowerCase() ===
        productName.trim().toLowerCase()
    );

    console.log("Fila existente:", existingRow);

    if (existingRow) {
      const quantityCell = existingRow.cells[1];
      const totalCell = existingRow.cells[3];

      if (!quantityCell || !totalCell) {
        console.error("Las celdas no se encontraron:", {
          quantityCell,
          totalCell,
        });
        return;
      }

      // Aquí accedemos al span con la cantidad
      const quantitySpan = quantityCell.querySelector(".quantity");
      if (!quantitySpan) {
        console.error("No se encontró el span de cantidad.");
        return;
      }

      let quantity = parseInt(quantitySpan.innerText) + quantityChange;

      // Si la cantidad es menor o igual a 0, eliminar la fila
      if (quantity <= 0) {
        const rowIndex = existingRow.rowIndex; // Obtener el índice de la fila
        console.log(`Eliminando fila en índice: ${rowIndex}`); // Log del índice a eliminar

        if (rowIndex >= 0 && rowIndex < orderSummary.rows.length) {
          const total = parseFloat(totalCell.innerText.replace("s/", ""));
          subtotal -= total; // Reducir el subtotal
          orderSummary.deleteRow(rowIndex); // Eliminar la fila
        } else {
          console.error("Índice de fila no válido para eliminar:", rowIndex);
        }

        // Actualizar el subtotal en el DOM después de eliminar
        if (subtotalElement) {
          subtotalElement.innerText = `Subtotal: s/${subtotal.toFixed(2)}`;
        }
        updateTotal(); // Actualizar el total después de eliminar el producto
        return;
      }

      // Actualizar la cantidad en el span y el total de la fila existente
      quantitySpan.innerText = quantity;
      const total = (quantity * price).toFixed(2);
      totalCell.innerText = `s/${total}`;

      subtotal += quantityChange * price; // Actualizar el subtotal
    } else {
      // Si no existe la fila, crear una nueva
      const newRow = orderSummary.insertRow();
      newRow.insertCell(0).innerText = productName;
      newRow.insertCell(1).innerHTML = `
      <button class="btn-add">+</button>
      <span class="quantity">1</span>
      <button class="btn-remove">-</button>`;
      newRow.insertCell(2).innerText = `s/${price.toFixed(2)}`;
      newRow.insertCell(3).innerText = `s/${price.toFixed(2)}`;

      subtotal += price; // Aumentar el subtotal por el precio del nuevo producto
    }

    // Actualizar el subtotal en el DOM
    if (subtotalElement) {
      subtotalElement.innerText = `Subtotal: s/${subtotal.toFixed(2)}`;
    } else {
      console.error("El elemento subtotal no se encontró en el DOM.");
    }

    updateTotal(); // Asegúrate de que esta función también esté definida correctamente
  }

  // Actualizar el total
  function updateTotal() {
    const totalElement = document.querySelector("h4");
    totalElement.innerText = `TOTAL: s/${subtotal.toFixed(2)}`;
  }

  // Evento para manejar el clic en los botones de cantidad
  orderSummary.addEventListener("click", function (event) {
    const target = event.target;
    if (target.classList.contains("btn-add")) {
      const row = target.closest("tr");
      const productName = row.cells[0].innerText;
      const price = parseFloat(row.cells[2].innerText.replace("s/", ""));
      updateOrder(productName, price, 1);
    } else if (target.classList.contains("btn-remove")) {
      const row = target.closest("tr");
      const productName = row.cells[0].innerText;
      const price = parseFloat(row.cells[2].innerText.replace("s/", ""));
      updateOrder(productName, price, -1);
    }
  });

  // Lógica para agregar productos a la orden al hacer clic en un producto
  productCards.forEach((card) => {
    card.addEventListener("click", function () {
      const productName = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      updateOrder(productName, price, 1);

      console.log(
        `Producto: ${productName}, Precio: ${price}, Cambio: ${quantityChange}`
      );
      console.log(`Subtotal: s/${subtotal.toFixed(2)}`);
    });
  });
});
