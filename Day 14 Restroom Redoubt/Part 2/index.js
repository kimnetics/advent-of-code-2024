import fs from 'fs'

const mapLength = 103
const mapWidth = 101

const robots = []
let finalMap = []

function calculateASecond (second) {
  // Create empty map.
  finalMap = []
  const blankArray = ' '.repeat(mapWidth).split('')
  for (let i = 0; i < mapLength; i++) {
    finalMap.push([...blankArray])
  }

  // Add robot final positions to map.
  for (const robot of robots) {
    // Calculate final map location.
    let finalX = robot.posX + (robot.velocityX * second) % mapWidth
    if (finalX < 0) {
      finalX += mapWidth
    } else if (finalX >= mapWidth) {
      finalX -= mapWidth
    }
    let finalY = robot.posY + (robot.velocityY * second) % mapLength
    if (finalY < 0) {
      finalY += mapLength
    } else if (finalY >= mapLength) {
      finalY -= mapLength
    }
    finalMap[finalY][finalX] = '*'
  }
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const inputLength = input.length - 1

  const robotParser = /p=(\d+),(\d+) v=([\-\d]+),([\-\d]+)/

  // Parse robot information.
  for (let i = 0; i < inputLength; i++) {
    const match = input[i].match(robotParser)
    const posX = parseInt(match[1])
    const posY = parseInt(match[2])
    const velocityX = parseInt(match[3])
    const velocityY = parseInt(match[4])

    const robot = {
      posX,
      posY,
      velocityX,
      velocityY
    }
    robots.push(robot)
  }

  // Loop until we get a Christmas tree.
  let second = 0
  while (true) {
    second++
    calculateASecond(second)

    // Look for a line of robots.
    let gotALine = false
    for (const row of finalMap) {
      let robotsInLineCount = 0
      for (let x = 0; x < mapWidth; x++) {
        if ((row[x] === '*') && (row[x - 1] === '*')) {
          robotsInLineCount++
          if (robotsInLineCount > 10) {
            gotALine = true
            break
          }
        } else {
          robotsInLineCount = 0
        }
      }
      if (gotALine) {
        break
      }
    }

    // Display robot final positions.
    if (gotALine) {
      console.log()
      console.log('-'.repeat(mapWidth))
      console.log(`Seconds: ${second}`)
      for (const row of finalMap) {
        console.log(row.join(''))
      }
      console.log('-'.repeat(mapWidth))

      break
    }
  }
} catch (err) {
  console.error('Error reading file: ', err)
}
