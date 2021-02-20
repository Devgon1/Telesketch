const container__table = document.querySelector("#container__table");

const createInitalTable = () => {
  setSize(64);
  createDivs(64);
};
window.addEventListener("load", createInitalTable);
//set the number of columns of the grid
const setSize = (size) => {
  container__table.style.gridTemplateColumns = `repeat(${size},1fr)`;
};

//create the number of divs needed

const createDivs = (size) => {
  for (let i = 0; i < size * size; i++) {
    const container__table__element = document.createElement("div");
    container__table__element.classList = "element";
    container__table__element.addEventListener("mouseover", changeColor);
    container__table.appendChild(container__table__element);
  }
};

const changeColor = (e) => {
  //   let randomR = Math.floor(Math.random() * 256);
  //   let randomG = Math.floor(Math.random() * 256);
  //   let randomB = Math.floor(Math.random() * 256);
  //   e.target.style.backgroundColor = `rgb(${randomR},${randomG},${randomB})`;
  e.target.style.backgroundColor = `gray`;
};
