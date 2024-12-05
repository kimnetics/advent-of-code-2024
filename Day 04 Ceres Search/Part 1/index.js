import fs from 'fs'

const targetSequence = 'XMAS'
const targetStart = targetSequence.charAt(0)

const letterGrid = []
let gridLength = 0
let gridWidth = 0

function checkLetters (row, column, rowIncrement, columnIncrement) {
  if (rowIncrement > 0) {
    if (row > gridLength - targetSequence.length) {
      return false
    }
  }
  if (rowIncrement < 0) {
    if (row < targetSequence.length - 1) {
      return false
    }
  }
  if (columnIncrement > 0) {
    if (column > gridWidth - targetSequence.length) {
      return false
    }
  }
  if (columnIncrement < 0) {
    if (column < targetSequence.length - 1) {
      return false
    }
  }

  for (let i = 1; i < targetSequence.length; i++) {
    row += rowIncrement
    column += columnIncrement
    if (letterGrid[row][column] !== targetSequence.charAt(i)) {
      return false
    }
  }

  return true
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
      if (letterGrid[row][column] === targetStart) {
        // Check N.
        if (checkLetters(row, column, -1, 0)) { targetCount++ }
        // Check NE.
        if (checkLetters(row, column, -1, 1)) { targetCount++ }
        // Check E.
        if (checkLetters(row, column, 0, 1)) { targetCount++ }
        // Check SE.
        if (checkLetters(row, column, 1, 1)) { targetCount++ }
        // Check S.
        if (checkLetters(row, column, 1, 0)) { targetCount++ }
        // Check SW.
        if (checkLetters(row, column, 1, -1)) { targetCount++ }
        // Check W.
        if (checkLetters(row, column, 0, -1)) { targetCount++ }
        // Check NW.
        if (checkLetters(row, column, -1, -1)) { targetCount++ }
      }
    }
  }

  console.log(targetCount)
} catch (err) {
  console.error('Error reading file: ', err)
}
