const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MOD = ALPHABET.length;
const dt = 500;

function vigenere(key, str, mode = 'encrypt') {
  /* generate key */
  key = key.repeat(str.length / key.length) + key.slice(0, str.length % key.length);
  let txt = '';

  /* encryption / decryption */
  for (let i = 0; i < str.length; i++) {
    let txtIndex;
    if (mode == 'encrypt') {
      txtIndex = (ALPHABET.indexOf(str[i]) + ALPHABET.indexOf(key[i])) % MOD;
    } else if (mode == 'decrypt') {
      txtIndex = (ALPHABET.indexOf(str[i]) - ALPHABET.indexOf(key[i]) + MOD) % MOD;
    }
    txt += ALPHABET[txtIndex];
  }

  return txt;
}


/** create table **/
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
// == // == // == // == // == // == // == // == // == // == // == // == 


/** display table */
const table = document.querySelector('table');

for (let i = 0; i <= MOD; i++) {
  const tr = document.createElement('tr');
  tr.innerHTML = tableContent[i].map(x => `<td>${x}</td>`).join('');
  table.appendChild(tr);
}
// == // == // == // == // == // == // == // == // == // == // == // == 


function findCipherLetter(x, y) {
  let tr = table.childNodes;
  tr[y].childNodes.forEach((el, ind) => {
    setInterval(() => {
      ind != 0 && ind <= x && (el.style.animation = `bg-color 0s ${ind * 0.5}s ease forwards`);
    }, dt);
  });
  setTimeout(() => {
    tr.forEach((el, ind) => {
      setInterval(() => {
        ind != 0 && ind <= y && (el.childNodes[x].style.animation = `bg-color 0s ${ind * 0.5}s ease forwards`);
      }, dt);
    });
  }, x * dt);
}

// findCipherLetter(10, 5);