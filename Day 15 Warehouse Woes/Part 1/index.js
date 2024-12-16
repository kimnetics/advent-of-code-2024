import fs from 'fs'

const map = []
let mapWidth = 0
let mapLength = 0

const movements = []

function moveEntity (x, y, xVelocity, yVelocity) {
  const newX = x + xVelocity
  const newY = y + yVelocity

  const newPositionEntity = map[newY][newX]

  // Is position open?
  if (newPositionEntity === '.') {
    // Move entity.
    map[newY][newX] = map[y][x]
    map[y][x] = '.'
    return [newX, newY]
  }

  // Is position a wall?
  if (newPositionEntity === '#') {
    return [x, y]
  }

  // Is position a box?
  if (newPositionEntity === 'O') {
    const [oX, oY] = moveEntity(newX, newY, xVelocity, yVelocity)
    if ((newX !== oX) || (newY !== oY)) {
      // Move entity.
      map[newY][newX] = map[y][x]
      map[y][x] = '.'
      return [newX, newY]
    } else {
      return [x, y]
    }
  }
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const inputLength = input.length - 1

  // Convert first part of input into two dimensional map.
  // Convert second part of input into movement list.
  let parseMovements = false
  for (let i = 0; i < inputLength; i++) {
    if (input[i] === '') {
      mapLength = i
      parseMovements = true
    } else {
      if (!parseMovements) {
        map.push(input[i].split(''))
      } else {
        movements.push(...input[i].split(''))
      }
    }
  }

  mapWidth = map[0].length

  // Find robot starting position.
  let robotX = -1
  let robotY = -1
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === '@') {
        robotX = x
        robotY = y
        break
      }
    }
    if (robotX !== -1) {
      break
    }
  }

  // Loop through movements.
  for (const movement of movements) {
    switch (movement) {
      case '^':
        [robotX, robotY] = moveEntity(robotX, robotY, 0, -1)
        break
      case '>':
        [robotX, robotY] = moveEntity(robotX, robotY, 1, 0)
        break
      case 'v':
        [robotX, robotY] = moveEntity(robotX, robotY, 0, 1)
        break
      case '<':
        [robotX, robotY] = moveEntity(robotX, robotY, -1, 0)
        break
      default:
        console.error(`Unexpected movement: ${movement}.`)
    }
  }

  let gpsCoordinatesSum = 0

  // Calculate sum of GPS coordinates.
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === 'O') {
        const gpsCoordinates = 100 * y + x
        gpsCoordinatesSum += gpsCoordinates
      }
    }
  }

  console.log(gpsCoordinatesSum)
} catch (err) {
  console.error('Error reading file: ', err)
}
