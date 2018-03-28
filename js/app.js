/**
 * Define variables
 */
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
let timer = document.getElementsByClassName('timer')[0];
let stars = document.getElementsByClassName('stars')[0];
let star3 = document.getElementById('star3');
let star2 = document.getElementById('star2');
let symbolsSelected = 0;
let hideTimer;
let openCards = [];
let cards = [];
let howManyMatch = 0;
let movesCounter = 0;
let startTime;
let timerInterval;
let howManyStars = 3;
const CLOSE_AFTER = 1300;

/**
 *  main function to  assign the cards to each div
 */
const assignCards = () => {
    cardList()
}

/**
 * function to shuffle randomly the cards
 */
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

/**
 * function represent the timer
 */
const startTimerInterval = () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const TIME = convertTime(new Date() - startTime);
        timer.innerHTML = `${TIME.h}hr ${TIME.m}min ${TIME.s}sec</p>`;
    }, 1000);
}

/**
 * function represent start timer and shuffle the cards and then assigned them to each div
 */
const cardList = () => {
    startTime = new Date();
    startTimerInterval();
    shuffle(SYMBOLS);
    assignCardsToDiv()
}

/**
 * function represent assign each random card to an li element from the ul list
 */
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

/**
 * function to add open and show class once the card is clicked and then check
 * the if we have we do have any match of the cards.
 * @param {HTMLElement} li - element of the  ul list
 */
const openCard = (li) => {
    li.classList.add('open');
    li.classList.add('show');
    if (symbolsSelected !== 2) return;
    setTimeout(checkMatch, 500);
    hideTimer = setTimeout(hideSymbols, CLOSE_AFTER);
}

/**
 * represent converting time to hours and minute and seconds
 * @param {number} diff - number converted to hours and minutes and seconds
 * @return {object}  it return object wish contains hours, minute, seconds.
 */
const convertTime = (diff) => {
    let msec = diff;
    let hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    let mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    let ss = Math.floor(msec / 1000);
    return {h: hh, m: mm, s: ss};
}

/**
 * function check if the clicked two cards match.
 * if the match is found then we add the shake class for 500 ms
 * and we remove the shake class after that.
 * if the match  we also add the match class to the both matched cards.
 * if we matched all the cards then we get the message that we won the game.
 */
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
    if (howManyMatch !== SYMBOLS.length) return;
    showResult();
}

/**
 * represent showing  the play button and the message of winning the game
 * which includes stating how many moves and the time spent
 * to win the game and also how many stars.
 */
const showResult = () => {
    clearInterval(timerInterval);
    const TIME = convertTime(new Date() - startTime);
    container.style.display = 'none';
    movesMessage.innerHTML = `<p> With ${movesCounter} Moves and ${howManyStars} stars in ${TIME.h}hr ${TIME.m}min ${TIME.s}sec</p>`;
    winMessageContainer.style.display = 'block';
    restartButton();
}

/**
 * represent checking if my container is hidden or not.
 * @return {boolean}  it return false if the container is hidden.
 */
const isWinContainerHidden = () => {
    if (winMessageContainer.offsetParent === null) {
        return false;
    }
}

/**
 * represent checking if the container is displayed and add click event
 * to the play button.
 * once the button clicked the game is restart.
 */
const restartButton = () => {
    if (!isWinContainerHidden) return;
    playButton.addEventListener('click', () => {
        winMessageContainer.style.display = 'none';
        container.style.display = 'flex';
        restartGame();
    })
}

/**
 * represent counting moves  for each 2 clicked cards.
 * @param {HTMLElement} li - element of the  ul list.
 * updating number of the moves in the html dom.
 * call the rating stars function;
 */
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
    starsRate();
}

/**
 * represent rating stars depend on counting moves.
 */
const starsRate = () => {
    if (movesCounter === 5) {
        howManyStars = 2;
        star3.classList.remove('fa-star');
        star3.classList.add('fa-star-o')
    } else if (movesCounter === 10) {
        howManyStars = 1;
        star2.classList.remove('fa-star');
        star2.classList.add('fa-star-o')
    }
}

/**
 * represent hiding the symbols in case of no match.
 */
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

/**
 * represent restarting game and set all the variable to be equal to 0.
 * calling cardList function again to start the game.
 *
 */
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
    howManyMatch = 0;
    howManyStars = 0;
    star3.classList.remove('fa-star-o');
    star3.classList.add('fa-star');
    star2.classList.remove('fa-star-o');
    star2.classList.add('fa-star');

    moves.innerHTML = movesCounter.toString();
    cardList();
}
restart.addEventListener('click', restartGame);
assignCards();
