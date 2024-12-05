import fs from 'fs'

const letterGrid = []
let gridLength = 0
let gridWidth = 0

function checkLetters (row, column) {
  if (row > gridLength - 2) {
    return false
  }
  if (row < 1) {
    return false
  }
  if (column > gridWidth - 2) {
    return false
  }
  if (column < 1) {
    return false
  }

  if (((letterGrid[row - 1][column - 1] === 'M' && letterGrid[row + 1][column + 1] === 'S')) ||
    ((letterGrid[row - 1][column - 1] === 'S' && letterGrid[row + 1][column + 1] === 'M'))) {
    if (((letterGrid[row + 1][column - 1] === 'M' && letterGrid[row - 1][column + 1] === 'S')) ||
      ((letterGrid[row + 1][column - 1] === 'S' && letterGrid[row - 1][column + 1] === 'M'))) {
      return true
    }
  }

  return false
}

try {
  let targetCount = 0

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  gridLength = input.length - 1

  for (let row = 0; row < gridLength; row++) {
    letterGrid.push(input[row].split(''))
  }

  gridWidth = letterGrid[0].length
  for (let row = 0; row < gridLength; row++) {
    for (let column = 0; column < gridWidth; column++) {
      if (letterGrid[row][column] === 'A') {
        if (checkLetters(row, column)) { targetCount++ }
      }
    }
  }

  console.log(targetCount)
} catch (err) {
  console.error('Error reading file: ', err)
}
