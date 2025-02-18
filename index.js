const etchContainer = document.querySelector(".etch-grid");

//user inputs
const userColorSelection = document.getElementById("grid-color");
const userSizeSelection = document.getElementById("grid-dimension");

//buttons
const reset = document.getElementById("reset");
const clear = document.getElementById("clear");

const pen = document.getElementById("pen");
const eraser = document.getElementById("eraser");
const darken = document.getElementById("darken");
const lighten = document.getElementById("lighten");
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

const buttons = [pen, eraser, darken, lighten, rainbow, clear, reset]; // All buttons
let colorChoice = userColorSelection.value;

//set initial mode to pen
let currentMode = "pen";

// Function to set the active button
const setActiveButton = (activeButton) => {
  buttons.forEach((button) => button.classList.remove("active")); // Remove active class from all buttons
  activeButton.classList.add("active"); // Add active class to the clicked button
};
setActiveButton(pen);

//create box

const setGridSize = (gridSize) => {
  etchContainer.innerHTML = "";
  for (let i = 0; i < gridSize * gridSize; i++) {
    //creates squares element and styles it
    let square = document.createElement("div");
    let squareSize = `1 1 calc(100%/${gridSize})`;
    square.classList.add("square");
    square.style.flex = squareSize;
    square.style.backgroundColor = "white"; // Initial color
    square.dataset.toneCount = 0; // Track the light level

    //hover set
    square.style.setProperty(`--square-color`, `${colorChoice}`);
    //change color event
    square.addEventListener("mouseenter", (event) => {
        //gets darkened or ligthened color for hover
      if (currentMode === "darken") {
        let nextShade = toneColor(event.target.style.backgroundColor, 0.1);
        colorChoice = nextShade;
        setHoverColor();
      }
      if (currentMode === "lighten") {
        let nextShade = toneColor(event.target.style.backgroundColor, -0.1);
        colorChoice = nextShade;
        setHoverColor();
      }
      //only colors if mouse is detected as down and mouse enter for smooth drag effect
      if (mouseDown) {
        draw(event);
      }
    });
    //for when user wants to do single click coloring and not drag
    square.addEventListener("mousedown", (event) => {
      draw(event);
    });
    //Append square
    etchContainer.appendChild(square);
  }
};

setGridSize(userSizeSelection.value);

//gets grid size when changed and sets grid size
userSizeSelection.addEventListener("input", (event) => {
  let value = event.target.value;
  if (isNaN(value) || value < 8 || value > 64) {
    return;
  }
  setGridSize(value);
});
//draw function for each mode
const draw = (event) => {
  if (currentMode === "pen") {
    event.target.style.backgroundColor = colorChoice;
  } else if (currentMode === "eraser") {
    event.target.style.backgroundColor = colorChoice;
  } else if (currentMode === "rainbow") {
    event.target.style.backgroundColor = rainbowColors[rainbowIndex];
    rainbowIndex++; //iterates counter for rainbow colors to make sure to return to the first color after last
    if (rainbowIndex === 7) rainbowIndex = 0;
    colorChoice = rainbowColors[rainbowIndex];
    //console.log(colorChoice);
    setHoverColor();
  } else if (currentMode === "darken") {
    let currentColor = event.target.style.backgroundColor;
    let toneCount = parseFloat(event.target.dataset.toneCount); //custom data attribute, datasets are saved as string
    //console.log(event.target.dataset);
    if (toneCount < 10 && toneCount > 0) { //only tones when needed 
    //   //console.log(toneCount);
      event.target.style.backgroundColor = toneColor(currentColor, 0.1);
      event.target.dataset.toneCount = toneCount + 1;
    }
  } else if (currentMode === "lighten") {
    let currentColor = event.target.style.backgroundColor;
    let toneCount = parseFloat(event.target.dataset.toneCount); //custom data attribute, datasets are saved as string
    //console.log(event.target.dataset);
    if (toneCount < 10 && toneCount >= 0) {
      //console.log(toneCount);
      event.target.style.backgroundColor = toneColor(currentColor, -0.1); //same thing as darken just opposite direction
      event.target.dataset.toneCount = toneCount + 1;
    }
  }
  let lightValue = getLightness(event);
  event.target.dataset.toneCount = lightValue;
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
  currentMode = "pen";
  setActiveButton(pen);
  setHoverColor();
});

//function to setHover color using color choice
const setHoverColor = () => {
  let squares = document.querySelectorAll(".square");
  squares.forEach((square) => {
    square.style.setProperty(`--square-color`, `${colorChoice}`);
  });
};
// RGB to HSL conversion
const rgbToHsl = (r, g, b) => {
  (r /= 255), (g /= 255), (b /= 255);
  let v = Math.max(r, g, b),
    c = v - Math.min(r, g, b),
    f = 1 - Math.abs(v + v - c - 1);
  let h =
    c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
  return [60 * (h < 0 ? h + 6 : h), f ? c / f : 0, (v + v - c) / 2];
};

// HSL to RGB conversion
const hslToRgb = (h, s, l) => {
  let a = s * Math.min(l, 1 - l);
  let f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)];
};

//function to get the current lightness level, used for toning and hover for tone mdoes
const getLightness = (event) => {
  let rgb = getComputedColor(event.target.style.backgroundColor);
  // Convert RGB to HSL
  let [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  return l;
};

//if color isnt rgb this will compute it to rgb
const getComputedColor = (color) => {
  // Create a temporary element to get the computed color in RGB format
  let tempElement = document.createElement("div");
  tempElement.style.color = color;
  document.body.appendChild(tempElement); // Add to the DOM to compute the color
  let computedColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement); // Clean up
  // Extract RGB values from the computed color
  let rgb = computedColor.match(/\d+/g).map(Number);
  return rgb;
};

// Function to darken/lighten a color
const toneColor = (color, amount) => {
  let rgb = getComputedColor(color);

  // Convert RGB to HSL
  let [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  // Reduce lightness
  l = Math.max(0, l - amount);

  // Convert HSL back to RGB
  let [r, g, b] = hslToRgb(h, s, l);

  // Return the new color as an RGB string
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255
  )})`;
};

// Reset the grid
reset.addEventListener("click", () => {
  userSizeSelection.value = 16;
  userColorSelection.value = "black";
  colorChoice = "black";
  currentMode = "pen";
  setGridSize(userSizeSelection.value);
  setActiveButton(pen); // Set pen as active button
});

// Clear the grid
clear.addEventListener("click", () => {
  setGridSize(userSizeSelection.value);
  setActiveButton(pen); // Set clear as active button
  currentMode = "pen"
});

// Event listeners for mode buttons
pen.addEventListener("click", () => {
  currentMode = "pen";
  colorChoice = userColorSelection.value;
  setHoverColor();
  setActiveButton(pen);
});

eraser.addEventListener("click", () => {
  currentMode = "eraser";
  colorChoice = "white";
  setHoverColor();
  setActiveButton(eraser);
});

darken.addEventListener("click", () => {
  currentMode = "darken";
  setActiveButton(darken);
});

lighten.addEventListener("click", () => {
  currentMode = "lighten";
  setActiveButton(lighten);
});

rainbow.addEventListener("click", () => {
  currentMode = "rainbow";
  colorChoice = rainbowColors[rainbowIndex];
  setHoverColor();
  setActiveButton(rainbow);
});

//notes:
//can add color picker n save image

function saveGridAsImage() {
  const grid = document.querySelector(".etch-grid");
  const gridSize = parseInt(userSizeSelection.value); // Get grid size
  const squareSize = grid.clientWidth / gridSize; // Calculate square size

  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = grid.clientWidth;
  canvas.height = grid.clientHeight;
  const ctx = canvas.getContext("2d");

  // Loop through each square and draw it on the canvas
  const squares = document.querySelectorAll(".square");
  squares.forEach((square, index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const x = col * squareSize;
    const y = row * squareSize;

    // Get the background color of the square
    const color = square.style.backgroundColor;;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, squareSize, squareSize);
  });

  // Convert the canvas to an image
  const image = canvas.toDataURL("image/png");

  // Create a download link
  const link = document.createElement("a");
  link.href = image;
  link.download = "etch-a-sketch.png"; // Default file name
  link.click();
}

const saveButton = document.getElementById("save-image");
saveButton.addEventListener("click", saveGridAsImage);

//check SO for this usibng toDataUrl