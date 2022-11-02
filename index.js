const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MOD = ALPHABET.length;
const dt = 500;

function vigenere(str, key, mode = 'encrypt') {
  /* generate key */
  key = generateKey(key, str);
  let txt = '';

  /* encryption / decryption */
  for (let i = 0; i < str.length; i++) {
    let txtIndex;
    if (mode == 'encrypt') {
      txtIndex = (ALPHABET.indexOf(str[i]) + ALPHABET.indexOf(key[i])) % MOD;
    } else if (mode == 'decrypt') {
      txtIndex = (ALPHABET.indexOf(str[i]) - ALPHABET.indexOf(key[i]) + MOD) % MOD;
    }
    
    findCipherLetter(ALPHABET.indexOf(str[i]) + 1, ALPHABET.indexOf(key[i]) + 1);

    txt += ALPHABET[txtIndex];
  }

  return txt;
}

function generateKey(key, str) {
  return key.repeat(str.length / key.length) + key.slice(0, str.length % key.length);
}


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
  tableContent[i].unshift(tableContent[i][0])
}
tableContent.unshift((' ' + ALPHABET).split(''));
// == // == // == // == // == // == // == // == // == // ==


// == // == // == DISPLAY TABLE == // == // == // ==
const table = document.querySelector('table');

for (let i = 0; i <= MOD; i++) {
  const tr = document.createElement('tr');
  tr.innerHTML = tableContent[i].map(x => `<td>${x}</td>`).join('');
  table.appendChild(tr);
}
// == // == // == // == // == // == // == // == // == // == 


// function findCipherLetter(x, y) {
//   let tr = table.childNodes;
//   tr[y].childNodes.forEach((el, ind) => {
//     setInterval(() => {
//       ind != 0 && ind <= x && (el.style.animation = `bg-color 0s ${ind * 0.5}s ease forwards`);
//     }, dt);
//   });
//   setTimeout(() => {
//     tr.forEach((el, ind) => {
//       setInterval(() => {
//         ind != 0 && ind <= y && (el.childNodes[x].style.animation = `bg-color 0s ${ind * 0.5}s ease forwards`);
//       }, dt);
//     });
//   }, x * dt);
// }

function findCipherLetter(x, y) {
  let tr = table.childNodes;
  tr[y].childNodes.forEach((el, ind) => { ind <= x && el.classList.add('row-active') });
  tr.forEach((el, ind) => { ind <= y && el.childNodes[x].classList.add('col-active') });
}

const txt = document.getElementById('txt');
const plainTxt = document.getElementById('plain-txt');

txt.addEventListener('input', (e) => {
  plainTxt.value = e.target.value.toUpperCase();
});

const key = document.getElementById('key');
const resultKey = document.getElementById('result-key');

key.addEventListener('input', (e) => {
  resultKey.value = e.target.value.toUpperCase();
});

const btnsItem = document.querySelectorAll('.btns__item');
btnsItem.forEach(item => {
  const btns = item.querySelectorAll('button');
  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

const plainText = document.getElementById('plain-txt');
const resultText = document.getElementById('result-txt');

const playBtn = document.getElementById('play');
let encInput = document.getElementById('encrypt'),
  decInput = document.getElementById('decrypt');


playBtn.addEventListener('click', () => {
  let key = resultKey.value;
  let txt = plainText.value;
  let mode = encInput.checked ? 'encrypt' : 'decrypt';
  console.log(txt, key, mode);
  resultText.value = vigenere(txt, key, mode);
});