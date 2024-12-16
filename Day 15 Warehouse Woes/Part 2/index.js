import fs from 'fs'

const map = []
let mapWidth = 0
let mapLength = 0

const movements = []

let clearList = []
let setList = []

function buildChangeList (entity, oldX, oldY, xVelocity, yVelocity) {
  const newX = oldX + xVelocity
  const newY = oldY + yVelocity

  setList.push({
    entity,
    x: newX,
    y: newY
  })

  const newPositionEntity = map[newY][newX]

  // Is position open?
  if (newPositionEntity === '.') {
    return true
  }

  // Is position a wall?
  if (newPositionEntity === '#') {
    return false
  }

  // Is position the left side of a box?
  if (newPositionEntity === '[') {
    clearList.push({
      x: newX,
      y: newY
    })
    clearList.push({
      x: newX + 1,
      y: newY
    })
    // N or S
    if (yVelocity !== 0) {
      return buildChangeList('[', newX, newY, xVelocity, yVelocity) &&
        buildChangeList(']', newX + 1, newY, xVelocity, yVelocity)
      // E
    } else if (xVelocity > 0) {
      setList.push({
        entity: '[',
        x: newX + xVelocity,
        y: newY
      })
      return buildChangeList(']', newX + xVelocity, newY, xVelocity, yVelocity)
    }
  }

  // Is position the right side of a box?
  if (newPositionEntity === ']') {
    clearList.push({
      x: newX - 1,
      y: newY
    })
    clearList.push({
      x: newX,
      y: newY
    })
    // N or S
    if (yVelocity !== 0) {
      return buildChangeList('[', newX - 1, newY, xVelocity, yVelocity) &&
        buildChangeList(']', newX, newY, xVelocity, yVelocity)
      // W
    } else if (xVelocity < 0) {
      setList.push({
        entity: ']',
        x: newX + xVelocity,
        y: newY
      })
      return buildChangeList('[', newX + xVelocity, newY, xVelocity, yVelocity)
    }
  }
}

function doChanges () {
  for (const clearItem of clearList) {
    map[clearItem.y][clearItem.x] = '.'
  }
  for (const setItem of setList) {
    map[setItem.y][setItem.x] = setItem.entity
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
        map.push(input[i].split('')
          .flatMap((entity) => {
            switch (entity) {
              case '#':
                return ['#', '#']
              case 'O':
                return ['[', ']']
              case '.':
                return ['.', '.']
              case '@':
                return ['@', '.']
              default:
                console.error(`Unexpected map entity: ${entity}.`)
            }
          })
        )
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
    clearList = [{
      x: robotX,
      y: robotY
    }]
    setList = []
    switch (movement) {
      case '^':
        if (buildChangeList('@', robotX, robotY, 0, -1)) {
          doChanges()
          robotY -= 1
        }
        break
      case '>':
        if (buildChangeList('@', robotX, robotY, 1, 0)) {
          doChanges()
          robotX += 1
        }
        break
      case 'v':
        if (buildChangeList('@', robotX, robotY, 0, 1)) {
          doChanges()
          robotY += 1
        }
        break
      case '<':
        if (buildChangeList('@', robotX, robotY, -1, 0)) {
          doChanges()
          robotX -= 1
        }
        break
      default:
        console.error(`Unexpected movement: ${movement}.`)
    }
  }

  let gpsCoordinatesSum = 0

  // Calculate sum of GPS coordinates.
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === '[') {
        const gpsCoordinates = 100 * y + x
        gpsCoordinatesSum += gpsCoordinates
      }
    }
  }

  console.log(gpsCoordinatesSum)
} catch (err) {
  console.error('Error reading file: ', err)
}
