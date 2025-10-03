let cardsData = [];
let gameCards = []; // cards currently in play
let flippedCards = [];
let matchedCards = [];

// Load cards.json
fetch("cards.json")
  .then(res => res.json())
  .then(data => {
    cardsData = data;
    initGame();
  });

function initGame() {
  // start with 2 pairs (4 cards)
  for (let i = 0; i < 2; i++) {
    pushCardPair();
  }
  renderBoard();
}

function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  gameCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    if (card.matched) cardElement.style.visibility = "hidden";

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image: url(${card.img})"></div>
      </div>
    `;

    cardElement.addEventListener("click", () => flipCard(card, cardElement));
    board.appendChild(cardElement);
  });
}

function flipCard(card, element) {
  if (flippedCards.length === 2 || card.flipped || card.matched) return;

  card.flipped = true;
  element.classList.add("flipped");
  flippedCards.push({ card, element });

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.card.id === second.card.id) {
    first.card.matched = true;
    second.card.matched = true;
    matchedCards.push(first.card.id);
  } else {
    setTimeout(() => {
      first.card.flipped = false;
      second.card.flipped = false;
      first.element.classList.remove("flipped");
      second.element.classList.remove("flipped");
    }, 1000);
  }
  flippedCards = [];
}

// Push → add new pair
document.getElementById("pushBtn").addEventListener("click", () => {
  pushCardPair();
  shuffle(gameCards);
  renderBoard();
});

function pushCardPair() {
  if (gameCards.length / 2 >= cardsData.length) return; // no more pairs available
  const randomIndex = Math.floor(Math.random() * cardsData.length);
  const chosenCard = cardsData[randomIndex];
  gameCards.push({ ...chosenCard, flipped: false, matched: false });
  gameCards.push({ ...chosenCard, flipped: false, matched: false });
  shuffle(gameCards);
}

// Pop → remove matched first, else last 2
document.getElementById("popBtn").addEventListener("click", () => {
  if (matchedCards.length > 0) {
    const idToRemove = matchedCards.shift();
    gameCards = gameCards.filter(c => c.id !== idToRemove);
  } else {
    gameCards.splice(-2, 2);
  }
  renderBoard();
});

// Shuffle helper
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
