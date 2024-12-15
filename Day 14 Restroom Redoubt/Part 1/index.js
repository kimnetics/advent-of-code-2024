import fs from 'fs'

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const inputLength = input.length - 1

  const mapLength = 103
  const mapWidth = 101
  const seconds = 100

  const middleX = Math.floor(mapWidth / 2)
  const middleY = Math.floor(mapLength / 2)

  const quadrantCount = {
    nw: 0,
    ne: 0,
    sw: 0,
    se: 0
  }

  const robotParser = /p=(\d+),(\d+) v=([\-\d]+),([\-\d]+)/

  for (let i = 0; i < inputLength; i++) {
    // Parse robot information.
    const match = input[i].match(robotParser)
    const posX = parseInt(match[1])
    const posY = parseInt(match[2])
    const velocityX = parseInt(match[3])
    const velocityY = parseInt(match[4])

    // Calculate final map location.
    let finalX = posX + (velocityX * seconds) % mapWidth
    if (finalX < 0) {
      finalX += mapWidth
    } else if (finalX >= mapWidth) {
      finalX -= mapWidth
    }
    let finalY = posY + (velocityY * seconds) % mapLength
    if (finalY < 0) {
      finalY += mapLength
    } else if (finalY >= mapLength) {
      finalY -= mapLength
    }

    // Add to quadrant count.
    if (finalX < middleX) {
      if (finalY < middleY) {
        quadrantCount.nw++
      } else if (finalY > middleY) {
        quadrantCount.sw++
      }
    } else if (finalX > middleX) {
      if (finalY < middleY) {
        quadrantCount.ne++
      } else if (finalY > middleY) {
        quadrantCount.se++
      }
    }
  }

  console.log(quadrantCount.nw * quadrantCount.ne * quadrantCount.sw * quadrantCount.se)
} catch (err) {
  console.error('Error reading file: ', err)
}
