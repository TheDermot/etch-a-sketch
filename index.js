const etchContainer = document.querySelector(".etch-grid");

const userColorSelection = document.getElementById("grid-color");
const userSizeSelection = document.getElementById("grid-dimension");

const reset = document.getElementById("reset");

const pen = document.getElementById("pen");
const eraser = document.getElementById("eraser");

let colorChoice = userColorSelection.value;

let currentMode = "pen";

//create box

const setGridSize = (gridSize) => {
  etchContainer.innerHTML = "";
  for (let i = 0; i < gridSize * gridSize; i++) {
    let square = document.createElement("div");
    let squareSize = `1 1 calc(100%/${gridSize})`;
    square.classList.add("square");
    square.style.flex = squareSize;
    //hover initial
    square.style.setProperty(`--square-color`, `${colorChoice}`);
    //set color
    square.addEventListener("mouseenter", (event) => {
      if (mouseDown) draw(event);
    });
    square.addEventListener("mousedown", (event) => {
      draw(event);
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
  if (currentMode === "pen") e.target.style.backgroundColor = colorChoice;
  else if (currentMode === "eraser") {
    e.target.style.backgroundColor = colorChoice;
  }
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
  setHoverColor();
});

const setHoverColor = () => {
  let squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.style.setProperty(`--square-color`, `${colorChoice}`);
  });
};

//resets grid and editor
reset.addEventListener("click", () => {
  userSizeSelection.value = 16;
  userColorSelection.value = "black";
  colorChoice = "black";
  setGridSize(userSizeSelection.value);
});

pen.addEventListener("click", () => {
  currentMode = "pen";
  colorChoice = userColorSelection.value;
  setHoverColor();
});
eraser.addEventListener("click", () => {
  currentMode = "eraser";
  colorChoice = "white";
  setHoverColor();
});
