import fs from 'fs'

const map = []
let mapWidth = 0
let mapLength = 0

const trailheadAndPeak = {}

function takeAStep (trailheadX, trailheadY, x, y, nextStep) {
  // N
  if (y - 1 >= 0) {
    if (map[y - 1][x] === nextStep) {
      if (nextStep === 9) {
        trailheadAndPeak[`${trailheadX}-${trailheadY}-${x}-${y - 1}`] = ''
      } else {
        takeAStep(trailheadX, trailheadY, x, y - 1, nextStep + 1)
      }
    }
  }
  // E
  if (x + 1 < mapWidth) {
    if (map[y][x + 1] === nextStep) {
      if (nextStep === 9) {
        trailheadAndPeak[`${trailheadX}-${trailheadY}-${x + 1}-${y}`] = ''
      } else {
        takeAStep(trailheadX, trailheadY, x + 1, y, nextStep + 1)
      }
    }
  }
  // S
  if (y + 1 < mapLength) {
    if (map[y + 1][x] === nextStep) {
      if (nextStep === 9) {
        trailheadAndPeak[`${trailheadX}-${trailheadY}-${x}-${y + 1}`] = ''
      } else {
        takeAStep(trailheadX, trailheadY, x, y + 1, nextStep + 1)
      }
    }
  }
  // W
  if (x - 1 >= 0) {
    if (map[y][x - 1] === nextStep) {
      if (nextStep === 9) {
        trailheadAndPeak[`${trailheadX}-${trailheadY}-${x - 1}-${y}`] = ''
      } else {
        takeAStep(trailheadX, trailheadY, x - 1, y, nextStep + 1)
      }
    }
  }
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  mapLength = input.length - 1

  // Convert input into two dimensional array.
  for (let i = 0; i < mapLength; i++) {
    map.push(input[i].split('').map(position => parseInt(position)))
  }

  mapWidth = map[0].length

  // Find trailheads and take first step.
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === 0) {
        takeAStep(x, y, x, y, 1)
      }
    }
  }

  console.log(Object.keys(trailheadAndPeak).length)
} catch (err) {
  console.error('Error reading file: ', err)
}
