const gridSize = 16;
const etchContainer = document.querySelector(".etch-grid");

//create box

const setGridSize = (gridSize) => {
  etchContainer.innerHTML = "";
  for (let i = 0; i < gridSize * gridSize; i++) {
    let square = document.createElement("div");
    let squareSize = `1 1 calc(100%/${gridSize})`;
    square.classList.add("square");
    square.style.flex = squareSize;
    etchContainer.appendChild(square);
  }
};
setGridSize(gridSize);
//get user input
const userSizeSelection = document.getElementById("grid-dimension");
userSizeSelection.addEventListener("input", (event) => {
  setGridSize(event.target.value);
});
