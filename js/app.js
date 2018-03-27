const SYMBOLS = [
    'diamond',
    'diamond',
    'paper-plane-o',
    'paper-plane-o',
    'anchor',
    'anchor',
    'bolt',
    'bolt',
    'cube',
    'cube',
    'leaf',
    'leaf',
    'bicycle',
    'bicycle',
    'bomb',
    'bomb'
];
let moves = document.getElementsByClassName('moves')[0];
let deckCards = document.getElementsByClassName('deck')[0];
let restart = document.getElementsByClassName('restart')[0];
let container = document.getElementsByClassName('container')[0];
let movesMessage = document.getElementsByClassName('movesCounterMessage')[0];
let winMessageContainer = document.getElementsByClassName('container2')[0]
let playButton = document.getElementsByClassName('startMessage')[0];
let symbolsSelected = 0;
let hideTimer;
let openCards = [];
let cards = [];
let howManyMatch = 0;
let movesCounter = 0;
const CLOSE_AFTER = 1300;

const assignCards = () => {
    cardList()
}

const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const cardList = () => {
    shuffle(SYMBOLS);
    assignCardsToDiv()
}

const assignCardsToDiv = () => {
    deckCards.innerHTML = '';
    SYMBOLS.forEach((symbol) => {
        let li = document.createElement('li')
        li.className = 'card';
        li.symbol = symbol;
        li.index = cards.length;
        li.addEventListener('click', cardClick.bind(this, li));
        let i = document.createElement('i')
        i.className = `fa fa-${symbol}`;
        li.appendChild(i)
        deckCards.appendChild(li)
        cards.push(li);
    })
}

const openCard = (li) => {
    li.classList.add('open');
    li.classList.add('show');
    if (symbolsSelected !== 2) return;
    setTimeout(checkMatch, 500);
    hideTimer = setTimeout(hideSymbols, CLOSE_AFTER);
}

const checkMatch = () => {
    if (symbolsSelected !== 2) return;
    const THE_SAME = openCards[0].symbol === openCards[1].symbol;
    if (!THE_SAME) {
        openCards[0].classList.add('shake');
        openCards[1].classList.add('shake');
        setTimeout(() => {
            openCards[0].classList.remove('shake');
            openCards[1].classList.remove('shake');
        }, 500)
        return;
    }
    clearTimeout(hideTimer);
    openCards[0].classList.add('match');
    openCards[1].classList.add('match');
    symbolsSelected = 0;
    openCards = [];
    howManyMatch += 2;
    if (howManyMatch === SYMBOLS.length) {
        container.style.display = 'none';
        movesMessage.innerHTML = `<p> With ${movesCounter} Moves and 3 stars</p>`;
        winMessageContainer.style.display = 'block';
        restartButton();
    }
}

const isWinContainerHidden = () => {
    if (winMessageContainer.offsetParent === null) {
        return false;
    }
}

const restartButton = () => {
    if (!isWinContainerHidden) return;
    playButton.addEventListener('click', () => {
        winMessageContainer.style.display = 'none';
        container.style.display = 'flex';
        restartGame();
    })
}

const cardClick = (li) => {
    if (li.classList.contains('half')) return;
    if (symbolsSelected === 2) return;
    li.classList.add('half');
    symbolsSelected++;
    if (symbolsSelected === 2) {
        movesCounter++;
        moves.innerHTML = movesCounter.toString();
    }
    openCards.push(li);
    setTimeout(openCard.bind(this, li), 300)
}

const hideSymbols = () => {
    clearTimeout(hideTimer)
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('open');
        cards[i].classList.remove('show');
        setTimeout(() => {
            cards[i].classList.remove('half');
            symbolsSelected = 0;
            openCards = [];
        }, 300);
    }
}

const restartGame = () => {
    clearTimeout(hideTimer)
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove('open');
        cards[i].classList.remove('show');
        cards[i].classList.remove('half');
        symbolsSelected = 0;
        openCards = [];
    }
    movesCounter = 0;
    moves.innerHTML = movesCounter.toString();
    cardList();
}

restart.addEventListener('click', restartGame);

assignCards();
