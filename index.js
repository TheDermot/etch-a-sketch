//Set default grid size
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

    //set color
    square.addEventListener("mouseenter", (e) => {
      if (mouseDown) draw(e);
    });
    //Append square
    etchContainer.appendChild(square);
  }
};

setGridSize(gridSize);

//get user input
const userSizeSelection = document.getElementById("grid-dimension");
userSizeSelection.addEventListener("input", (event) => {
  setGridSize(event.target.value); //references element event was triggered by
});

//draw
const draw = (e) => {
  e.target.style.backgroundColor = "black";
};

//track if mouse is down
let mouseDown = false;
document.addEventListener("mousedown", () => {
  mouseDown = true;
});
document.addEventListener("mouseup", () => {
  mouseDown = false;
});
// Prevent the grid from being dragged like an image/file
etchContainer.addEventListener("dragstart", (event) => {
  event.preventDefault();
});

