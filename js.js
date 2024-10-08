const categoryList = document.getElementById("category-list");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

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

updateArrows();
categoryList.addEventListener("scroll", updateArrows);
