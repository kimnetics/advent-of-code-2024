import fs from 'fs'

let mapLength = 0
let mapWidth = 0

let guardX = -1
let guardY = -1
let guardDirection = '^'
let guardXVelocity = 0
let guardYVelocity = -1

function encounteredLoop (map) {
  // Track guard movement until guard exits map.
  while (guardX >= 0 && guardX < mapWidth && guardY >= 0 && guardY < mapLength) {
    switch (map[guardY][guardX]) {
      case '#':
        // Go back a step.
        guardX -= guardXVelocity
        guardY -= guardYVelocity

        // Change direction.
        // N -> E
        if (guardXVelocity === 0 && guardYVelocity === -1) {
          guardDirection = '>'
          guardXVelocity = 1
          guardYVelocity = 0
          // E -> S
        } else if (guardXVelocity === 1 && guardYVelocity === 0) {
          guardDirection = 'v'
          guardXVelocity = 0
          guardYVelocity = 1
          // S -> W
        } else if (guardXVelocity === 0 && guardYVelocity === 1) {
          guardDirection = '<'
          guardXVelocity = -1
          guardYVelocity = 0
          // W -> N
        } else if (guardXVelocity === -1 && guardYVelocity === 0) {
          guardDirection = '^'
          guardXVelocity = 0
          guardYVelocity = -1
        }
        break
      default:
        // Has guard already been here going in this direction?
        if (map[guardY][guardX].includes(guardDirection)) {
          return true
        }
        map[guardY][guardX] += guardDirection
        break
    }

    guardX += guardXVelocity
    guardY += guardYVelocity
  }

  return false
}

try {
  let loopOptions = 0

  const map = []

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  mapLength = input.length - 1

  // Convert input into two dimensional array.
  for (let i = 0; i < mapLength; i++) {
    map.push(input[i].split(''))
  }

  mapWidth = map[0].length

  let guardStartX = -1
  let guardStartY = -1

  // Find guard starting location.
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === '^') {
        guardStartX = x
        guardStartY = y
        map[y][x] = 'S'
      }
    }
  }

  // Try all obstruction options.
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const testMap = []
      for (const row of map) {
        testMap.push([...row])
      }

      if (testMap[y][x] === '.') {
        testMap[y][x] = '#'

        guardX = guardStartX
        guardY = guardStartY
        guardDirection = '^'
        guardXVelocity = 0
        guardYVelocity = -1

        if (encounteredLoop(testMap)) {
          loopOptions++
        }
      }
    }
  }

  console.log(loopOptions)
} catch (err) {
  console.error('Error reading file: ', err)
}
