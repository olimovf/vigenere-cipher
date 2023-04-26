// == // == // == CONSTANTS == // == // == // ==
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MOD = ALPHABET.length;
let TIME = 1000;

// == // == // == CREATE TABLE == // == // == // ==
const tableContent = [];
for (let i = 0; i < MOD; i++) {
  const tableRow = [];
  for (let j = 0; j < MOD; j++) {
    const tableCell = ALPHABET[(i + j) % MOD];
    tableRow.push(tableCell);
  }
  tableContent.push(tableRow);
}
for (let i = 0; i < tableContent.length; i++) {
  tableContent[i].unshift(tableContent[i][0]);
}
tableContent.unshift((" " + ALPHABET).split(""));

// == // == // == GENERATE TABLE == // == // == // ==
const table = document.querySelector("table");
for (let i = 0; i <= MOD; i++) {
  const tr = document.createElement("tr");
  tr.innerHTML = tableContent[i].map((x) => `<td>${x}</td>`).join("");
  table.appendChild(tr);
}

// == // == // == GLOBAL VARIABLES == // == // == // ==
let txt = document.getElementById("txt");
let key = document.getElementById("key");
let message = document.getElementById("plain-txt");
let resultKey = document.getElementById("result-key");
let resultTxt = document.getElementById("result-txt");

// == // == // == SELECTORS == // == // == // ==
const encryptBtn = document.getElementById("encrypt");
const decryptBtn = document.getElementById("decrypt");
const playBtn = document.getElementById("play");
const messageCopyBtn = document.getElementById("plain-txt-copy");
const resultKeyCopyBtn = document.getElementById("result-key-copy");
const resultTxtCopyBtn = document.getElementById("result-txt-copy");
const speedBtn = document.getElementById("speed");

// == // == // == HELPER FUNCTIONS == // == // == // ==
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearHighlight() {
  for (let i = 1; i < tableContent.length; i++) {
    for (let j = 1; j < tableContent[i].length; j++) {
      const cell = table.rows[i].cells[j];
      cell.classList.remove(
        "highlight",
        "row-highlight",
        "col-highlight",
        "partial-highlight"
      );
    }
  }
}

function highlightCells(keyChar, plainChar) {
  // highlight cipher letter cell
  const cipherRow = ALPHABET.indexOf(keyChar) + 1;
  const cipherCol = ALPHABET.indexOf(plainChar) + 1;
  const cipherCell = table.rows[cipherRow].cells[cipherCol];
  cipherCell.classList.add("highlight");

  // highlight cells up to cipher letter
  for (let i = 1; i < cipherRow; i++) {
    const cell = table.rows[i].cells[cipherCol];
    cell.classList.add("row-highlight");
  }
  for (let j = 1; j < cipherCol; j++) {
    const cell = table.rows[cipherRow].cells[j];
    cell.classList.add("col-highlight");
  }
}

function highlightChar(j, keyLength, char) {
  message.innerHTML =
    message.textContent.slice(0, j) +
    "<mark>" +
    message.textContent[j] +
    "</mark>" +
    message.textContent.slice(j + 1);

  resultKey.innerHTML =
    resultKey.textContent.slice(0, j % keyLength) +
    "<mark>" +
    resultKey.textContent[j % keyLength] +
    "</mark>" +
    resultKey.textContent.slice((j % keyLength) + 1);

  resultTxt.innerHTML =
    resultTxt.textContent.slice(0, -1) + "<mark>" + char + "</mark>";
}

function getResult() {
  message.innerHTML = message.textContent;
  resultKey.innerHTML = resultKey.textContent;
  resultTxt.innerHTML = resultTxt.textContent;
}

function checkIfEmpty(el1, el2) {
  if ((el1 === resultTxt && el1.textContent === "") || el1.value === "") {
    el2.style.height = "36px";
  } else {
    el2.style.height = "auto";
  }
}

function copy(el) {
  navigator.clipboard.writeText(el.textContent);
}

function restrict(bool) {
  txt.readOnly = bool;
  key.readOnly = bool;
  playBtn.disabled = bool;
}

// == // == // == ENCRYPTION == // == // == // ==
async function encrypt() {
  const keyLength = resultKey.textContent.length;
  let ciphertext = "";
  let keyIndex = 0;

  for (let j = 0; j < message.textContent.length; j++) {
    const plainChar = message.textContent.charAt(j);

    // ignore non-alphabetic characters
    if (ALPHABET.indexOf(plainChar) === -1) {
      ciphertext += plainChar;
      continue;
    }

    const keyChar = resultKey.textContent.charAt(keyIndex % keyLength);
    const keyOffset = ALPHABET.indexOf(keyChar);
    const plainOffset = ALPHABET.indexOf(plainChar);
    const cipherOffset = (keyOffset + plainOffset) % MOD;
    const cipherChar = ALPHABET.charAt(cipherOffset);

    ciphertext += cipherChar;
    resultTxt.textContent = ciphertext;
    checkIfEmpty(resultTxt, resultTxt);
    keyIndex++;

    // highlight every processing char
    highlightChar(j, keyLength, cipherChar);

    // clear any previous highlighting
    clearHighlight();

    // highlight
    highlightCells(keyChar, plainChar);

    // wait for TIME second before continuing
    await sleep(TIME);
  }

  getResult();
  clearHighlight();
  restrict(false);
}

// == // == // == DECRYPTION == // == // == // ==
async function decrypt() {
  const keyLength = resultKey.textContent.length;
  let plaintext = "";
  let keyIndex = 0;

  for (let j = 0; j < message.textContent.length; j++) {
    const cipherChar = message.textContent.charAt(j);

    // ignore non-alphabetic characters
    if (ALPHABET.indexOf(cipherChar) === -1) {
      plaintext += cipherChar;
      continue;
    }

    const keyChar = resultKey.textContent.charAt(keyIndex % keyLength);
    const keyOffset = ALPHABET.indexOf(keyChar);
    const cipherOffset = ALPHABET.indexOf(cipherChar);
    const plainOffset = (cipherOffset - keyOffset + MOD) % MOD;
    const plainChar = ALPHABET.charAt(plainOffset);

    plaintext += plainChar;
    resultTxt.textContent = plaintext;
    checkIfEmpty(resultTxt, resultTxt);
    keyIndex++;

    // highlight every processing char
    highlightChar(j, keyLength, plainChar);

    // clear any previous highlighting
    clearHighlight();

    // highlight
    highlightCells(keyChar, plainChar);

    // wait for TIME second before continuing
    await sleep(TIME);
  }

  getResult();
  clearHighlight();
  restrict(false);
}

// == // == // == EVENT LISTENERS == // == // == // ==
document.addEventListener("DOMContentLoaded", function () {
  checkIfEmpty(txt, message);
  checkIfEmpty(key, resultKey);
  checkIfEmpty(resultTxt, resultTxt);
});

speedBtn.addEventListener("input", function (e) {
  TIME = speedBtn.max - e.target.value;
});

txt.addEventListener("input", function (e) {
  message.textContent = e.target.value.toUpperCase().replace(/[^a-zA-Z]+/g, "");
  checkIfEmpty(txt, message);
});

key.addEventListener("input", function (e) {
  resultKey.textContent = e.target.value
    .toUpperCase()
    .replace(/[^a-zA-Z]+/g, "");
  checkIfEmpty(key, resultKey);
});

playBtn.addEventListener("click", function () {
  if (message.textContent === "" || resultKey.textContent === "") return;
  restrict(true);
  let isEncrypt = encryptBtn.classList.contains("active");
  if (isEncrypt) encrypt(2000);
  else decrypt();
});

encryptBtn.addEventListener("click", function () {
  this.classList.add("active");
  this.nextElementSibling.classList.remove("active");
  message.previousElementSibling.textContent = "Plain text";
  resultTxt.previousElementSibling.textContent = "Cipher text";
});

decryptBtn.addEventListener("click", function () {
  this.classList.add("active");
  this.previousElementSibling.classList.remove("active");
  message.previousElementSibling.textContent = "Cipher text";
  resultTxt.previousElementSibling.textContent = "Plain text";
});

messageCopyBtn.addEventListener("click", function () {
  copy(message);
});

resultKeyCopyBtn.addEventListener("click", function () {
  copy(resultKey);
});

resultTxtCopyBtn.addEventListener("click", function () {
  copy(resultTxt);
});

// ----------------------------------------------------
// function stepEncryption() {
//   const keyLength = resultKey.textContent.length;
//   let ciphertext = "";
//   let j = stepEncryption.currentLetterIndex || 0;

//   if (j >= message.textContent.length) {
//     // reset for next run
//     stepEncryption.currentLetterIndex = 0;
//     return;
//   }

//   const plainChar = message.textContent.charAt(j);
//   if (ALPHABET.indexOf(plainChar) === -1) {
//     // ignore non-alphabetic characters
//     ciphertext += plainChar;
//   } else {
//     const keyChar = resultKey.textContent.charAt(j % keyLength);
//     const keyOffset = ALPHABET.indexOf(keyChar);
//     const plainOffset = ALPHABET.indexOf(plainChar);
//     const cipherOffset = (keyOffset + plainOffset) % MOD;
//     const cipherChar = ALPHABET.charAt(cipherOffset);
//     ciphertext += cipherChar;
//     resultTxt.textContent += ciphertext;

//     // highlight every processing char
//     highlightChar(j, keyLength, cipherChar);

//     // clear any previous highlighting
//     clearHighlight();

//     // highlight
//     highlightCells(keyChar, plainChar);
//   }

//   stepEncryption.currentLetterIndex = j + 1;
// }
