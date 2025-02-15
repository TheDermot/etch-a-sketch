const etchContainer = document.querySelector(".etch-grid");

const userColorSelection = document.getElementById("grid-color");
const userSizeSelection = document.getElementById("grid-dimension");

const reset = document.getElementById("reset");
const clear = document.getElementById("clear");

const pen = document.getElementById("pen");
const eraser = document.getElementById("eraser");
const rainbow = document.getElementById("rainbow");

const rainbowColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
];
let rainbowIndex = 0;
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
    if (currentMode === "rainbow") {
      colorChoice = rainbow[rainbowIndex];
    }
    square.style.setProperty(`--square-color`, `${colorChoice}`);
    //set color
    square.addEventListener("mouseenter", (event) => {
      if (mouseDown) {
        draw(event);
      }
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
  } else if (currentMode === "rainbow") {
    e.target.style.backgroundColor = rainbowColors[rainbowIndex];
    rainbowIndex++;
    if (rainbowIndex === 7) rainbowIndex = 0;
    colorChoice = rainbowColors[rainbowIndex];
    console.log(colorChoice);
    setHoverColor();
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
  currentMode = "pen";
  setGridSize(userSizeSelection.value);
});
clear.addEventListener("click", () => {
  userColorSelection.value = "black";
  colorChoice = "black";
  currentMode = "pen";
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
rainbow.addEventListener("click", () => {
  currentMode = "rainbow";
  colorChoice = rainbowColors[rainbowIndex];
  setHoverColor();
});
