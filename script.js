const cardValues = [
    'apaixonado', 'apaixonado', 'bigode', 'bigode', 'diabinho', 'diabinho', 'feliz', 'feliz',
    'legal', 'legal', 'morto', 'morto', 'nerd', 'nerd', 'triste', 'triste'
]

let cards = []
let card1 = null
let card2 = null
let card1Index = null
let card2Index = null
let attempts = 0
let matchedPairs = 0
let lock = false
let startTime = null

const board = document.getElementById('game-board')
const messageDiv = document.getElementById('message')
const restartBtn = document.getElementById('restart-btn')
const attemptsCount = document.getElementById('attempts-count')
const timer = document.getElementById('timer')

function initializeGame() {
    board.innerHTML = ''
    messageDiv.textContent = ''
    restartBtn.style.display = 'none'
    attempts = 0
    matchedPairs = 0
    lock = false
    startTime = new Date()  // Start the timer
    attemptsCount.textContent = attempts
    updateTimer()

    cards = cardValues.sort(() => 0.5 - Math.random())

    cards.forEach((value, index) => {
        const card = document.createElement('div')
        card.className = 'card'
        card.dataset.value = value
        card.dataset.index = index

        card.innerHTML = getSVG(value)

        card.addEventListener('click', handleCardClick)
        board.appendChild(card)
    })
}

function getSVG(name) {
    return `<img src="img/${name}.svg" alt="${name}" class="card-image" />`
}

function handleCardClick(event) {
    if (lock) return

    const clickedCard = event.target.closest('.card')
    if (!clickedCard) return

    const cardIndex = clickedCard.dataset.index

    if (clickedCard.classList.contains('flipped') || card1Index === cardIndex) {
        return
    }

    clickedCard.classList.add('flipped')

    if (!card1) {
        card1 = clickedCard
        card1Index = cardIndex
        return
    }

    card2 = clickedCard
    card2Index = cardIndex
    attempts++
    attemptsCount.textContent = attempts
    lock = true

    setTimeout(() => {
        if (card1.dataset.value === card2.dataset.value) {
            matchedPairs++
            card1 = card2 = null
            card1Index = card2Index = null
            lock = false
            if (matchedPairs === cardValues.length / 2) {
                setTimeout(() => {
                    const endTime = new Date()
                    const gameDuration = Math.round((endTime - startTime) / 1000)
                    alert(`Você venceu! Total de tentativas: ${attempts}\nTempo de jogo: ${formatTime(gameDuration)}`)
                    restartBtn.style.display = 'block'
                }, 500)
            }
        } else {
            card1.classList.remove('flipped')
            card2.classList.remove('flipped')
            card1 = card2 = null
            card1Index = card2Index = null
            lock = false
        }
    }, 1000)
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    return `${minutes}m ${seconds}s`
}

function updateTimer() {
    if (startTime) {
        const now = new Date()
        const elapsed = Math.round((now - startTime) / 1000)
        timer.textContent = formatTime(elapsed)
        setTimeout(updateTimer, 1000)
    }
}

restartBtn.addEventListener('click', initializeGame)

initializeGame()
