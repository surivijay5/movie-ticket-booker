const seats = document.querySelectorAll('.movie-seat')
const movieSeatContainer = document.querySelector('.movie-seats')
const movieName = document.querySelector('.movie-name-selector')
const totalSeats = document.querySelector('#seat-number')
const totalPrice = document.querySelector('#total-price')

class Theatre {
    constructor(numberOfRows, numberOfColumns, missingSeatIds = [], selectedSeats = [], occupiedSeats = []) {
        this.selectedSeats = selectedSeats;
        this.occupiedSeats = occupiedSeats;
        this.missingSeatIds = missingSeatIds
        this.numberOfColumns = numberOfColumns
        this.numberOfRows = numberOfRows
    }
}

class MovieSeat {
    constructor(id, isSelected = false, isOccupied = false) {
        this.id = id
        this.isSelected = isSelected;
        this.isOccupied = isOccupied
    }
}

function getMovieSeats(numberOfRows, numberOfColumns, missingSeatIds, selectedSeats = [], occupiedSeats = []) {
    let result = {}
    let id = 1
    for (let i = 1; i <= numberOfRows; i++) {
        result[i] = []
        for (let j = 1; j <= numberOfColumns; j++) {
            if (missingSeatIds.includes(j)) {
                result[i].push(new MovieSeat(-1))
            } else {
                result[i].push(new MovieSeat(id++, selectedSeats.includes(j), occupiedSeats.includes(j)))
            }
        }
    }
    return result
}

function render({ numberOfRows, numberOfColumns, missingSeatIds, selectedSeats, occupiedSeats }) {
    let movieSeatObj = getMovieSeats(numberOfRows, numberOfColumns, missingSeatIds, selectedSeats, occupiedSeats)
    for (let row in movieSeatObj) {
        let tempRow = document.createElement('div')
        tempRow.classList.add("row")
        let movieSeatArr = movieSeatObj[row]
        for (let seat of movieSeatArr) {
            let temp = document.createElement('div')
            if (seat.id == -1) {
                temp.classList.add('seat', 'not-available')

            } else {
                temp.dataset.id = seat.id.toString()
                temp.classList.add('seat')
                if (occupiedSeats.includes(seat.id.toString())) temp.classList.add('occupied')
                else if (selectedSeats.includes(seat.id.toString())) temp.classList.add('selected')

            }
            tempRow.appendChild(temp)
        }
        movieSeatContainer.appendChild(tempRow)
    }
    calculatePriceAndRender(selectedSeats)
}

function calculatePriceAndRender(selectedSeats) {
    localStorage.setItem('BMS-movie-name', movieName.value)
    if (!selectedSeats) {
        selectedSeats = JSON.parse(localStorage.getItem('BMS-selectedSeats')) ?? []
    }
    totalSeats.innerText = selectedSeats.length
    totalPrice.innerText = parseInt(movieName.value) * selectedSeats.length
}

movieSeatContainer.addEventListener('click', (e) => {
    const el = e.target
    const id = el.dataset.id
    if (el.classList.contains('selected')) {
        selectedSeats = selectedSeats.filter(p => p != id)
    } else {
        selectedSeats.push(id)
    }
    el.classList.toggle('selected')
    localStorage.setItem('BMS-selectedSeats', JSON.stringify(selectedSeats))
    calculatePriceAndRender(selectedSeats)
})

movieName.addEventListener('change', () => calculatePriceAndRender())

let selectedSeats = JSON.parse(localStorage.getItem('BMS-selectedSeats')) ?? []
let occupiedSeats = JSON.parse(localStorage.getItem('BMS-occupiedSeats')) ?? []
movieName.value = localStorage.getItem('BMS-movie-name') ?? "10"

const vijayTheatre = new Theatre(10, 10, [3, 8], selectedSeats, occupiedSeats)
render(vijayTheatre)