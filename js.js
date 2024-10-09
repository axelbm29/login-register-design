document.addEventListener("DOMContentLoaded", function () {
  const categoryList = document.getElementById("category-list");
  const leftArrow = document.getElementById("left-arrow");
  const rightArrow = document.getElementById("right-arrow");

  const categoryButtons = document.querySelectorAll(".btn-lista-tipoComida");
  const productCards = document.querySelectorAll(".col-6");

  const orderSummary = document.querySelector(".order-details tbody");
  const subtotalElement = document.getElementById("subtotal");

  let subtotal = 0;

  function filterProducts(category) {
    productCards.forEach((card) => {
      const productCategory = card.getAttribute("data-category");
      if (category === "todos" || productCategory === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    categoryButtons.forEach((button) => {
      if (button.innerText.toLowerCase() === category) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    });
  }

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

  updateArrows();
  categoryList.addEventListener("scroll", updateArrows);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedCategory = this.innerText.toLowerCase();
      filterProducts(selectedCategory);
    });
  });

  filterProducts("hamburguesas");

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

      const quantitySpan = quantityCell.querySelector(".quantity");
      if (!quantitySpan) {
        console.error("No se encontró el span de cantidad.");
        return;
      }

      let quantity = parseInt(quantitySpan.innerText) + quantityChange;

      if (quantity <= 0) {
        const rowIndex = existingRow.rowIndex - 1;
        console.log(`Eliminando fila en índice: ${rowIndex}`);

        if (rowIndex >= 0 && rowIndex < orderSummary.rows.length) {
          const total = parseFloat(totalCell.innerText.replace("s/", ""));
          subtotal -= total;
          orderSummary.deleteRow(rowIndex);
        } else {
          console.error("Índice de fila no válido para eliminar:", rowIndex);
        }

        if (subtotalElement) {
          subtotalElement.innerText = `Subtotal: s/${subtotal.toFixed(2)}`;
        }
        updateTotal();
        return;
      }

      quantitySpan.innerText = quantity;
      const total = (quantity * price).toFixed(2);
      totalCell.innerText = `s/${total}`;

      subtotal += quantityChange * price;
    } else {
      const newRow = orderSummary.insertRow();
      newRow.insertCell(0).innerText = productName;
      newRow.insertCell(1).innerHTML = `
      <button class="btn-add">+</button>
      <span class="quantity">1</span>
      <button class="btn-remove">-</button>`;
      newRow.insertCell(2).innerText = `s/${price.toFixed(2)}`;
      newRow.insertCell(3).innerText = `s/${price.toFixed(2)}`;

      subtotal += price;
    }

    if (subtotalElement) {
      subtotalElement.innerText = `Subtotal: s/${subtotal.toFixed(2)}`;
    } else {
      console.error("El elemento subtotal no se encontró en el DOM.");
    }

    updateTotal();
  }

  function updateTotal() {
    const totalElement = document.querySelector("h4");
    totalElement.innerText = `TOTAL: s/${subtotal.toFixed(2)}`;
  }

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
