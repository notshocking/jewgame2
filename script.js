let data, score = 0, total = 0, currentPair;

async function load() {
  data = await (await fetch('data.json')).json();
  nextRound();
}

function nextRound() {
  document.getElementById('feedback').innerText = '';
  document.getElementById('nextBtn').style.display = 'none';

  // Separate Jewish and Gentile players
  const jewishPeople = data.filter(p => p.isJewish);
  const gentilePeople = data.filter(p => !p.isJewish);

  // Pick one random person from each group
  const randomJewish = jewishPeople[Math.floor(Math.random() * jewishPeople.length)];
  const randomGentile = gentilePeople[Math.floor(Math.random() * gentilePeople.length)];

  // Shuffle the order so Jewish person isn't always on the same side
  currentPair = [randomJewish, randomGentile].sort(() => Math.random() - 0.5);

  // Render the two choices
  document.querySelectorAll('.choice').forEach((div, i) => {
    const person = currentPair[i];
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
    // Highlight the correct Jewish choice
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
