const defaultGridSize = 16


const etchContainer = document.querySelector(".etch-grid");

//Get user input

//create box

for (let i = 0; i < defaultGridSize * defaultGridSize; i++) {
  console.log(i);
  let square = document.createElement("div");
  square.classList.add("square")
  etchContainer.appendChild(square);
}
