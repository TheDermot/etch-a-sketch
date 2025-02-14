const etchContainer = document.querySelector(".etch-grid");

const userColorSelection = document.getElementById("grid-color");
const userSizeSelection = document.getElementById("grid-dimension");

let colorChoice = userColorSelection.value;

//create box

const setGridSize = (gridSize) => {
  etchContainer.innerHTML = "";
  for (let i = 0; i < gridSize * gridSize; i++) {
    let square = document.createElement("div");
    let squareSize = `1 1 calc(100%/${gridSize})`;
    square.classList.add("square");
    square.style.flex = squareSize;
    //hover color
    square.addEventListener("mouseover", (event) => {
      event.target.style.backgroundColor = colorChoice;
    });
    square.addEventListener("mouseout", (event) => {
      event.target.style.backgroundColor = "";
    });
    //set color
    square.addEventListener("mouseenter", (event) => {
      if (mouseDown) draw(event);
    });
    //Append square
    etchContainer.appendChild(square);
  }
};

setGridSize(userSizeSelection.value);

//get user input
userSizeSelection.addEventListener("input", (event) => {
  setGridSize(event.target.value); //references element event was triggered by
});

//draw
const draw = (e) => {
  e.target.style.backgroundColor = colorChoice;
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

//get color input
userColorSelection.addEventListener("input", (event) => {
  colorChoice = event.target.value;
});
