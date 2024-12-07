import fs from 'fs'

try {
  let distinctPositions = 0

  const map = []

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const mapLength = input.length - 1

  // Convert input into two dimensional array.
  for (let i = 0; i < mapLength; i++) {
    map.push(input[i].split(''))
  }

  const mapWidth = map[0].length

  let guardX = -1
  let guardY = -1
  let guardXVelocity = 0
  let guardYVelocity = -1

  // Find guard starting location.
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === '^') {
        guardX = x
        guardY = y
      }
    }
  }

  // Track guard movement until guard exits map.
  while (guardX >= 0 && guardX < mapWidth && guardY >= 0 && guardY < mapLength) {
    switch (map[guardY][guardX]) {
      case '^':
      case '.':
        map[guardY][guardX] = 'X'
        distinctPositions++
        break
      case '#':
        // Go back a step.
        guardX -= guardXVelocity
        guardY -= guardYVelocity

        // Change direction.
        // N -> E
        if (guardXVelocity === 0 && guardYVelocity === -1) {
          guardXVelocity = 1
          guardYVelocity = 0
          // E -> S
        } else if (guardXVelocity === 1 && guardYVelocity === 0) {
          guardXVelocity = 0
          guardYVelocity = 1
          // S -> W
        } else if (guardXVelocity === 0 && guardYVelocity === 1) {
          guardXVelocity = -1
          guardYVelocity = 0
          // W -> N
        } else if (guardXVelocity === -1 && guardYVelocity === 0) {
          guardXVelocity = 0
          guardYVelocity = -1
        }
        break
    }

    guardX += guardXVelocity
    guardY += guardYVelocity
  }

  console.log(distinctPositions)
} catch (err) {
  console.error('Error reading file: ', err)
}
