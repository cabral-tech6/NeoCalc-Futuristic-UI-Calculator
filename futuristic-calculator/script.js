// =========================
// ELEMENTOS
// =========================
const historyDisplay = document.getElementById("history");
const currentDisplay = document.getElementById("current");
const buttonsContainer = document.querySelector(".buttons");

// =========================
// SONS
// =========================
const hoverSound = new Audio("sounds/hover.mp3");
const resultSound = new Audio("sounds/result.mp3");
hoverSound.preload = "auto";
resultSound.preload = "auto";

function playHoverSound() {
  hoverSound.currentTime = 0;
  hoverSound.play().catch(() => {});
}
function playResultSound() {
  resultSound.currentTime = 0;
  resultSound.play().catch(() => {});
}


// =========================
// ESTADO
// =========================
let currentValue = "0";
let previousValue = "";
let currentOperator = null;
let shouldResetCurrent = false;

// =========================
// DISPLAY
// =========================
function updateDisplay() {
  currentDisplay.textContent = currentValue;

  if (previousValue && currentOperator) {
    historyDisplay.textContent = `${previousValue} ${getOperatorSymbol(currentOperator)}`;
  } else {
    historyDisplay.textContent = "";
  }
}

function getOperatorSymbol(op) {
  return op === "/" ? "÷" : op === "*" ? "×" : op;
}


// =========================
// FUNÇÕES PRINCIPAIS
// =========================
function handleNumber(num) {
  if (shouldResetCurrent || currentValue === "0") {
    currentValue = num;
    shouldResetCurrent = false;
  } else {
    currentValue += num;
  }
  updateDisplay();
}

function handleDecimal() {
  if (shouldResetCurrent) {
    currentValue = "0.";
    shouldResetCurrent = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateDisplay();
}

function clearAll() {
  currentValue = "0";
  previousValue = "";
  currentOperator = null;
  shouldResetCurrent = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetCurrent) {
    currentValue = "0";
    shouldResetCurrent = false;
  } else {
    currentValue = currentValue.length > 1
      ? currentValue.slice(0, -1)
      : "0";
  }
  updateDisplay();
}

function handleOperator(operator) {
  if (currentOperator && !shouldResetCurrent) {
    calculate();
  }
  previousValue = currentValue;
  currentOperator = operator;
  shouldResetCurrent = true;
  updateDisplay();
}

function handlePercent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
  updateDisplay();
}

function calculate() {
  if (!currentOperator || previousValue === "") return;

  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);

  if (currentOperator === "/" && curr === 0) {
    currentValue = "Erro";
    previousValue = "";
    currentOperator = null;
    updateDisplay();
    return;
  }

  const operations = {
    "+": prev + curr,
    "-": prev - curr,
    "*": prev * curr,
    "/": prev / curr
  };

  currentValue = operations[currentOperator].toString();
  previousValue = "";
  currentOperator = null;
  shouldResetCurrent = true;
  updateDisplay();

  playResultSound();
}


// =========================
// EVENTOS
// =========================
buttonsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case "number": handleNumber(value); break;
    case "decimal": handleDecimal(); break;
    case "clear": clearAll(); break;
    case "delete": deleteLast(); break;
    case "operator": handleOperator(value); break;
    case "percent": handlePercent(); break;
    case "equal": calculate(); break;
  }
});

// hover com som
document.querySelectorAll(".buttons button").forEach((btn) => {
  btn.addEventListener("mouseenter", playHoverSound);
});

updateDisplay();
