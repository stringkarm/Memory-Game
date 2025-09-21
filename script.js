
let initialCardsData = []; 
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

// DOM elements
const gameBoard = document.getElementById('game-board');
const pushButton = document.getElementById('pushBtn');
const popButton = document.getElementById('popBtn');

// --- Game Functions ---
// Load card data from JSON and start the game
async function loadCards() {
  try {
    const response = await fetch('cards.json');
    const data = await response.json();
    initialCardsData = data;
    initializeGame();
  } catch (error) {
    console.error('Error loading cards.json:', error);
  }
}

// Set up the initial game board with 4 cards
function initializeGame() {
  const initialPairs = initialCardsData.slice(0, 2);
  cards = [...initialPairs, ...initialPairs];
  shuffleCards();
  createBoard();
  resetState();
}

// Create and display the cards on the board
function createBoard() {
  gameBoard.innerHTML = '';
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id;

    const cardFront = document.createElement('img');
    cardFront.classList.add('front-face');
    cardFront.src = card.img;

    const cardBack = document.createElement('img');
    cardBack.classList.add('back-face');
    cardBack.src = 'images/card-back.png'; // Make sure you have this image

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    cardElement.addEventListener('click', flipCard);
    
    gameBoard.appendChild(cardElement);
  });
}

// Shuffle the cards using Fisher-Yates algorithm
function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

// Handle the card-flipping logic
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  checkForMatch();
}

// Check if the two flipped cards are a match
function checkForMatch() {
  const isMatch = firstCard.dataset.id === secondCard.dataset.id;
  if (isMatch) {
    matchedPairs++;
    disableCards();
    if (matchedPairs === cards.length / 2) {
      setTimeout(() => alert('You won!'), 500);
    }
  } else {
    unflipCards();
  }
}

// Disable a pair of matched cards from being clicked again
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetState();
}

// Flip back two non-matching cards
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetState();
  }, 1000);
}

// Reset the state for the next turn
function resetState() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// --- Push/Pop Functions ---
// Adds a new pair of cards to the game
function pushCard() {
  if (lockBoard) return;
  
  const availableCards = initialCardsData.filter(card => !cards.some(c => c.id === card.id));
  if (availableCards.length === 0) {
    alert("No more unique cards to add!");
    return;
  }
  
  const newCard = availableCards[Math.floor(Math.random() * availableCards.length)];
  cards.push(newCard, newCard);
  
  matchedPairs = 0;
  shuffleCards();
  createBoard();
}

// Removes a random pair of cards from the game
function popCard() {
  if (lockBoard || cards.length <= 4) return;
  
  const uniqueCardIds = [...new Set(cards.map(card => card.id))];
  const idToRemove = uniqueCardIds[Math.floor(Math.random() * uniqueCardIds.length)];
  
  cards = cards.filter(card => card.id !== idToRemove);
  
  matchedPairs = 0;
  shuffleCards();
  createBoard();
}

// --- Event Listeners and Initial Load ---
pushButton.addEventListener('click', pushCard);
popButton.addEventListener('click', popCard);

window.onload = loadCards;