import fs from 'fs'

function getLeastTokens (machine) {
  let leastTokens = Number.MAX_SAFE_INTEGER

  const maxAPushesForX = Math.floor(machine['prize']['x'] / machine['buttonA']['x'])
  const maxAPushesForY = Math.floor(machine['prize']['y'] / machine['buttonA']['y'])
  let maxAPushes = (maxAPushesForX < maxAPushesForY) ? maxAPushesForX : maxAPushesForY
  if (maxAPushes > 100) {
    maxAPushes = 100
  }

  for (let aPushes = maxAPushes; aPushes >= 0; aPushes--) {
    const bPushesForX = (machine['prize']['x'] - aPushes * machine['buttonA']['x']) / machine['buttonB']['x']
    const bPushesForY = (machine['prize']['y'] - aPushes * machine['buttonA']['y']) / machine['buttonB']['y']

    // Is this a valid combination of button presses?
    if ((bPushesForX === bPushesForY) && (Math.floor(bPushesForX) === bPushesForX)) {
      const tokens = 3 * aPushes + bPushesForX
      if (tokens < leastTokens) {
        leastTokens = tokens
      }
    }
  }

  return leastTokens
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const inputLength = input.length - 1

  let totalTokens = 0

  const xYParser = /X[+=](\d+), Y[+=](\d+)/

  let i = -1
  while (i < inputLength) {
    let match = []
    const machine = {}

    // Parse claw machine characteristics
    i++
    match = input[i].match(xYParser)
    machine['buttonA'] = {
      x: parseInt(match[1]),
      y: parseInt(match[2])
    }
    i++
    match = input[i].match(xYParser)
    machine['buttonB'] = {
      x: parseInt(match[1]),
      y: parseInt(match[2])
    }
    i++
    match = input[i].match(xYParser)
    machine['prize'] = {
      x: parseInt(match[1]),
      y: parseInt(match[2])
    }
    i++

    const tokens = getLeastTokens(machine)
    if (tokens !== Number.MAX_SAFE_INTEGER) {
      totalTokens += tokens
    }
  }

  console.log(totalTokens)
} catch (err) {
  console.error('Error reading file: ', err)
}
