//variables
const gridGameContainer = document.querySelector("#gridGame");
const backgroundColor = document.querySelector("#background-select");
const button = document.querySelectorAll("button");
const fillColor = document.querySelector("#color-fill");
const pixelColor = document.querySelector("#color-select");
const colorPicker = document.querySelector("#color-grabber");
const eraser = document.querySelector("#eraser-btn");
const rgbColors = document.querySelector("#rgb-btn");
const shades = document.querySelector("#shades-btn");
const lightenShades = document.querySelector("#lighten-btn");
const onOffLines = document.querySelector("#grid-btn");
const clearAll = document.querySelector("#clear-btn");
let paintColor = "#000000";
let grab = false;
let bgColor = "#ffffff";
gridGameContainer.style.backgroundColor = bgColor;
let rgb = false;
let shading = false;
let lighten = false;
let erase = false;
let fill = false;
let progressBar = document.querySelector("#progress-bar");
let size = 16;

//grid setup

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", () => {
    button[i].classList.toggle("btn-on");
  });
}

const setSize = (size) => {
  gridGameContainer.style.gridTemplateColumns = `repeat(${size},1fr)`;
};

const createElements = (size) => {
  for (let i = 0; i < size * size; i++) {
    const gridElements = document.createElement("div");
    gridElements.classList.add("selection");
    gridElements.classList.add("gridElement");
    gridElements.setAttribute("draggable", "false");
    gridGameContainer.appendChild(gridElements);
  }
};

//buttons functionality

////toggling grid lines

pixelColor.addEventListener("input", (e) => {
  paintColor = e.target.value;
});

colorPicker.addEventListener("click", () => {
  if (grab) {
    grab = false;
    colorPicker.classList.remove("btn-on");
  } else {
    grab = true;
  }

  if (fill) {
    fill = false;
    fillColor.classList.remove("btn-on");
  }
});

fillColor.addEventListener("click", () => {
  if (grab) {
    grab = false;
    colorPicker.classList.remove("btn-on");
  }
  if (fill) {
    fill = false;
  } else {
    fill = true;
  }
});

eraser.addEventListener("click", () => {
  if (erase) {
    erase = false;
  } else {
    erase = true;
    shading = false;
    shades.classList.remove("btn-on");
    rgb = false;
    rgbColors.classList.remove("btn-on");
    lighten = false;
    lightenShades.classList.remove("btn-on");
  }

  if (grab) {
    grab = false;
    colorPicker.classList.remove("btn-on");
  }
});

rgbColors.addEventListener("click", () => {
  if (rgb) {
    rgb = false;
  } else {
    rgb = true;
    shading = false;
    shades.classList.remove("btn-on");
    erase = false;
    eraser.classList.remove("btn-on");
    lighten = false;
    lightenShades.classList.remove("btn-on");
  }

  if (grab) {
    grab = false;
    colorPicker.classList.remove("btn-on");
  }
});

shades.addEventListener("click", () => {
  if (shading) {
    shading = false;
  } else {
    shading = true;
    rgb = false;
    rgbColors.classList.remove("btn-on");
    lighten = false;
    lightenShades.classList.remove("btn-on");
    erase = false;
    eraser.classList.remove("btn-on");
  }
  if (grab) {
    grab = false;
    colorPicker.classList.remove("btn-on");
  }
});

lightenShades.addEventListener("click", () => {
  if (lighten) {
    lighten = false;
  } else {
    lighten = true;
    shading = false;
    shades.classList.remove("btn-on");
    rgb = false;
    rgbColors.classList.remove("btn-on");
    erase = false;
    eraser.classList.remove("btn-on");
  }
  if (grab) {
    grab = false;
    colorPicker.classList.remove("btn-on");
  }
});

onOffLines.addEventListener("click", () => {
  for (let i = 0; i < gridElements.length; i++) {
    gridElements[i].classList.toggle("gridElement");
  }
  // console.log(gridElements[2].classList);
});

//functions

const clearGrid = () => {
  // console.log(gridElements[2].classList);
  document.documentElement.style.setProperty("--bg-color", bgColor); //background stays the same color when cleared
  gridElements = document.querySelectorAll(".selection");
  // console.log(gridElements[2].classList);
  for (let i = 0; i < gridElements.length; i++) {
    fadeGrid(gridElements[i]);
  }

  setTimeout(() => {
    for (let i = 0; i < gridElements.length; i++) {
      gridElements[i].style.backgroundColor = "";
      gridElements[i].removeAttribute("data-inked");
      gridElements[i].removeAttribute("data-shade");
      gridElements[i].classList.remove("clear-fade");
      gridElements[i].classList.remove("clear-fade-2");
      gridElements[i].classList.remove("clear-fade-3");
      gridElements[i].classList.remove("clear-fade-4");
      gridElements[i].classList.remove("clear-fade-5");
    }
  }, 1500);

  gridGameContainer.style.backgroundColor = bgColor;
  setTimeout(() => {
    clearAll.classList.remove("btn-on");
  }, 850);
};

const RGBToHex = (rgb) => {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  b = (+rgb[2]).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  return "#" + r + g + b;
};

const adjust = (RGBToHex, rgb, amount) => {
  let color = RGBToHex(rgb);
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
};

const rangeSlider = (value) => {
  let gridValues = document.querySelectorAll("#range-value");
  progressBar.style.width = (value / 64) * 100 + "%";
  for (let i = 0; i < gridValues.length; i++) {
    gridValues[i].textContent = value;
  }
  size = parseInt(value);
  deleteGrid();
  setSize(value);
  createElements(value);
  listeningClick();

  if (!onOffLines.classList.contains("btn-on")) {
    onOffLines.classList.toggle("btn-on");
  }
};

const deleteGrid = () => {
  while (gridGameContainer.firstChild) {
    gridGameContainer.removeEventListener("mousedown", clickDrawing);
    gridGameContainer.removeEventListener("mouseenter", drawWhileClick);
    gridGameContainer.lastChild = null;
    gridGameContainer.removeChild(gridGameContainer.lastChild);
  }
};

const rangeSliderValue = (value) => {
  let gridValues = document.querySelectorAll("#range-value");
  for (let i = 0; i < gridValues.length; i++) {
    gridValues[i].textContent = value;
  }
  progressBar.style.width = (value / 64) * 100 + "%";
};

const rgbPainting = (e) => {
  let colorR = Math.floor(Math.random() * 256);
  let colorG = Math.floor(Math.random() * 256);
  let colorB = Math.floor(Math.random() * 256);

  e.target.style.backgroundColor = `rgb(${colorR},${colorG},${colorB})`;
};

const fadeGrid = (item) => {
  // if the cell hasnt been coloured, set it to the background color (un marked cells are transperent)
  if (
    item.style.backgroundColor == "" ||
    item.style.backgroundColor == "transparent"
  ) {
    item.style.backgroundColor == bgColor;
  }

  let fadeSpeed = Math.random() * 10;
  if (fadeSpeed > 8) {
    item.classList.add("clear-fade");
  } else if (fadeSpeed > 6) {
    item.classList.add("clear-fade-2");
  } else if (fadeSpeed > 4) {
    item.classList.add("clear-fade-3");
  } else if (fadeSpeed > 2) {
    item.classList.add("clear-fade-4");
  } else {
    item.classList.add("clear-fade-5");
  }
};

const clickDrawing = (e) => {
  if (!grab && !fill) {
    if (erase) {
      e.target.style.backgroundColor = "";
      e.target.removeAttribute("data-inked");
      e.target.removeAttribute("data-shade");
    } else if (rgb) {
      e.target.style.backgroundColor = rgbPainting(e);
      e.target.setAttribute("data-inked", true);
      e.target.removeAttribute("data-shade");
    } else if (shading) {
      if (!e.target.dataset.shade) {
        e.target.setAttribute("data-shade", "1");
      } else {
        let shadeAmount = parseInt(e.target.getAttribute("data-shade"));
        shadeAmount++;
        e.target.setAttribute("data-shade", `${shadeAmount}`);
        // console.log(e.target.dataset.shade);
      }
      if (
        e.target.style.backgroundColor == "" ||
        e.target.style.backgroundColor == "transparent"
      ) {
        e.target.style.backgroundColor = bgColor;
      }

      e.target.style.backgroundColor = adjust(
        RGBToHex,
        e.target.style.backgroundColor,
        -15
      );
    } else if (lighten) {
      if (!e.target.dataset.shade) {
        e.target.setAttribute("data-shade", "-1");
      } else {
        let shadeAmount = parseInt(e.target.getAttribute("data-shade"));
        shadeAmount--;
        e.target.setAttribute("data-shade", `${shadeAmount}`);
      }
      if (
        e.target.style.backgroundColor == "" ||
        e.target.style.backgroundColor == "transparent"
      ) {
        e.target.style.backgroundColor = bgColor;
      }
      e.target.style.backgroundColor = adjust(
        RGBToHex,
        e.target.style.backgroundColor,
        +15
      );
    } else {
      e.target.style.backgroundColor = paintColor;
      e.target.setAttribute("data-inked", "true");
      e.target.removeAttribute("data-shade");
    }
  }
};

const drawWhileClick = (e) => {
  if (e.buttons > 0) {
    if (!grab && !fill) {
      if (erase) {
        e.target.style.backgroundColor = "";
        e.target.removeAttribute("data-inked");
        e.target.removeAttribute("data-shade");
      } else if (rgb) {
        e.target.style.backgroundColor = rgbPainting(e);
        e.target.setAttribute("data-inked", "true");
        e.target.removeAttribute("data-shade");
      } else if (shading) {
        if (!e.target.dataset.shade) {
          e.target.setAttribute("data-shade", "1");
        } else {
          let shadeAmount = parseInt(e.target.getAttribute("data-shade"));
          shadeAmount++;
          e.target.setAttribute("data-shade", `${shadeAmount}`);
        }
        // a transperent item cant be shadded. if item is transperent first set the cell color to bg color
        if (
          e.target.style.backgroundColor == "" ||
          e.target.style.backgroundColor == "transparent"
        ) {
          e.target.style.backgroundColor = bgColor;
        }

        e.target.style.backgroundColor = adjust(
          RGBToHex,
          e.target.style.backgroundColor,
          -15
        );
      } else if (lighten) {
        if (!e.target.dataset.shade) {
          e.target.setAttribute("data-shade", "-1");
        } else {
          let shadeAmount = parseInt(e.target.getAttribute("data-shade"));
          shadeAmount--;
          e.target.setAttribute("data-shade", `${shadeAmount}`);
        }
        if (
          e.target.style.backgroundColor == "" ||
          e.target.style.backgroundColor == "transparent"
        ) {
          e.target.style.backgroundColor = bgColor;
        }
        e.target.style.backgroundColor = adjust(
          RGBToHex,
          e.target.style.backgroundColor,
          +15
        );
      } else {
        e.target.style.backgroundColor = paintColor;
        e.target.setAttribute("data-inked", "true");
        e.target.removeAttribute("data-shade");
      }
    }
  }
};

////paint onClik and while clicking and hovering

const listeningClick = () => {
  gridElements = document.querySelectorAll(".gridElement");
  // console.log(gridElements);

  for (let i = 0; i < gridElements.length; i++) {
    gridElements[i].addEventListener("mousedown", clickDrawing);
    gridElements[i].addEventListener("mouseenter", drawWhileClick);
  }

  //when colorPicker is active
  for (let i = 0; i < gridElements.length; i++) {
    gridElements[i].addEventListener("click", (e) => {
      if (grab) {
        paintColor = e.target.style.backgroundColor;
        if (paintColor == "") {
          pixelColor.value = bgColor;
        } else {
          pixelColor.value = RGBToHex(paintColor);
        }
        colorPicker.classList.remove("btn-on");
        grab = false;

        // remove classes for the other buttons
        rgb = false;
        rgbColors.classList.remove("btn-on");
        shading = false;
        shades.classList.remove("btn-on");
        lighten = false;
        lightenShades.classList.remove("btn-on");
        erase = false;
        eraser.classList.remove("btn-on");
      }
    });
  }
  //when fill is active

  for (let i = 0; i < gridElements.length; i++) {
    gridElements[i].addEventListener("click", colorFill);
  }

  backgroundColor.addEventListener("input", (e) => {
    gridElements = document.querySelectorAll(".selection");
    bgColor = e.target.value;
    for (let i = 0; i < gridElements.length; i++) {
      if (!gridElements[i].dataset.inked) {
        gridGameContainer.style.backgroundColor = bgColor;
      }

      if (!gridElements[i].dataset.inked) {
        if (gridElements[i].dataset.shade) {
          gridElements[i].style.backgroundColor = bgColor;
          let shadeAmount = parseInt(
            gridElements[i].getAttribute("data-shade")
          );
          let reshadeValue = shadeAmount * -15;
          gridElements[i].style.backgroundColor = adjust(
            RGBToHex,
            gridElements[i].style.backgroundColor,
            reshadeValue
          );
        }
      }
    }
  });
};

const toMatrix = (arr, width) => {
  return arr.reduce(function (rows, key, index) {
    return (
      (index % width == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows
    );
  }, []);
};
//helper function to grab adjacent cells of a 2d grid stored as a 1d array
// only return cells that do not cross over the edge of the grid
const getAdjacent1D = (x, gridX, gridY) => {
  let xAbove = null;
  let xBellow = null;
  let xLeft = null;
  let xRight = null;

  // make sure x is not in the top row before returning the cell above
  if (gridX != 0) {
    xAbove = [x - size];
  }
  // make sure x is not in the bottom row before returning the cell bellow
  if (gridX != size - 1) {
    xBellow = [x + size];
  }
  // make sure x is not in the left column before returning the cell to its left
  if (gridY != 0) {
    xLeft = [x - 1];
  }
  // make sure x is not in the right column before returning the cell to its right
  if (gridY != size - 1) {
    xRight = [x + 1];
  }

  // console.log(xAbove, xBellow, xLeft, xRight);
  return [xAbove, xBellow, xLeft, xRight];
};

const colorFill = (e) => {
  if (fill) {
    //get index of the clicked grid cell
    let ogIndex = Array.from(e.target.parentElement.children).indexOf(e.target);
    // create a list of items to color
    let toFill = [ogIndex];
    let addedToFill = 1;

    gridElements = document.querySelectorAll(".gridElement");
    let gridItemsArray = Array.from(gridElements);

    // create grid-like representation of grid items
    let gridItemsArray2D = toMatrix(gridItemsArray, size);

    // get index of clicked item in 2d array
    let gridX = Math.floor(ogIndex / size);
    let gridY = ogIndex % size;
    // console.log(gridX);
    // console.log(gridY);
    // console.log(getAdjacent2D(gridX, gridY));
    // console.log(getAdjacent1D(ogIndex, gridX, gridY));

    while (addedToFill != 0) {
      let toCheck = toFill.slice(-addedToFill);
      let addedItems = [];
      // console.log(toCheck);
      addedToFill = 0;
      for (let j = 0; j < toCheck.length; j++) {
        // console.log(toCheck[j]);
        let toAdd = getAdjacent1D(toCheck[j], gridX, gridY);
        // console.log(toAdd);
        for (let i = 0; i < toAdd.length; i++) {
          if (toAdd[i] != null) {
            if (!toFill.includes(toAdd[i][0])) {
              // for some reason it was adding items above the top line
              // and bellow the bottom line, i couldnt work it out so
              // added this if. It would also add string numbers if i changed
              // the grid size with the slider
              if (
                toAdd[i][0] >= 0 &&
                toAdd[i][0] < size ** 2 &&
                typeof toAdd[i][0] == "number"
              ) {
                // only color in the surounding items if they are the same color as the selected item
                if (
                  e.target.parentElement.children[toAdd[i][0]].style
                    .backgroundColor == e.target.style.backgroundColor
                ) {
                  toFill.push(toAdd[i][0]);
                  addedItems.push(toAdd[i][0]);
                }
              }
            }
          }
        }
      }
      addedToFill = addedItems.length;
      // console.log(addedItems.length);
      // console.log(addedItems);
    }

    // console.log(toFill);

    for (let i = 0; i < toFill.length; i++) {
      if (rgb) {
        e.target.parentElement.children[
          toFill[i]
        ].style.backgroundColor = rgbPainting();
      } else {
        e.target.parentElement.children[
          toFill[i]
        ].style.backgroundColor = paintColor;
      }

      e.target.parentElement.children[toFill[i]].setAttribute(
        "data-inked",
        "true"
      );
    }

    fillColor.classList.remove("btn-on");
    fill = false;
  }
};

//declarations

setSize(size);
createElements(size);
listeningClick();
clearAll.addEventListener("click", clearGrid);
