import fs from 'fs'

const maxBlinks = 25
let stoneCount = 0

function blink (stoneNumber, blinkNumber) {
  if (blinkNumber > maxBlinks) {
    return
  }

  if (stoneNumber === 0) {
    blink(1, blinkNumber + 1)
  } else {
    const stoneNumberString = stoneNumber.toString()
    const stoneNumberLength = stoneNumberString.length

    if (stoneNumberLength % 2 === 0) {
      blink(parseInt(stoneNumberString.slice(0, stoneNumberLength / 2)), blinkNumber + 1)
      blink(parseInt(stoneNumberString.slice(stoneNumberLength / 2)), blinkNumber + 1)
      stoneCount++
    } else {
      blink(stoneNumber * 2024, blinkNumber + 1)
    }
  }
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.replace(/\r\n/g, '')
  const numbers = input.split(' ').map(number => parseInt(number))

  stoneCount = numbers.length
  for (const number of numbers) {
    blink(number, 1)
  }

  console.log(stoneCount)
} catch (err) {
  console.error('Error reading file: ', err)
}
