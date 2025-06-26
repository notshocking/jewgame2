
let data, score = 0, total = 0, currentPair;

async function load() {
  data = await (await fetch('data.json')).json();
  nextRound();
}
function shuffle(a) { return a.sort(() => Math.random() - 0.5); }

function nextRound() {
  document.getElementById('feedback').innerText = '';
  document.getElementById('nextBtn').style.display = 'none';

  const [a, b] = shuffle(data).slice(0, 2);
  currentPair = [a, b];
  const ord = shuffle([0, 1]);
  document.querySelectorAll('.choice').forEach((div, i) => {
    const person = currentPair[ord[i]];
    div.innerHTML = `
      <img src="${person.imageUrl}" alt="${person.name}">
      <div>${person.name}</div>`;
    div.onclick = () => handleGuess(person, div);
    div.className = 'choice';
  });
}

function handleGuess(person, div) {
  total++;
  if (person.isJewish) {
    score++;
    div.classList.add('correct');
    feedbackText(`✅ Correct! ${person.name} is Jewish.`, person);
  } else {
    div.classList.add('wrong');
    feedbackText(`❌ Nope — ${person.name} is not Jewish.`, person);
    const correctDiv = [...document.querySelectorAll('.choice')].find(d => {
      const img = d.querySelector('img').src;
      return currentPair.find(p => p.imageUrl === img).isJewish;
    });
    correctDiv.classList.add('correct');
  }
  updateScore();
  disableChoices();
  document.getElementById('nextBtn').style.display = 'inline-block';
}

function feedbackText(text, person) {
  const fb = document.getElementById('feedback');
  fb.innerHTML = `
    <p>${text}</p>
    <p><strong>${person.name}:</strong> ${person.bio}</p>`;
}

function updateScore() {
  document.getElementById('score').innerText = `Score: ${score} / ${total}`;
}

function disableChoices() {
  document.querySelectorAll('.choice').forEach(div => div.onclick = null);
}

document.getElementById('nextBtn').onclick = nextRound;

load();
