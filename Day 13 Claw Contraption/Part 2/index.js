import fs from 'fs'

// Credit to https://hamatti.org/adventofcode/2024/solutions/day-13 for the formula.
function getLeastTokens (machine) {
  const bPushes = (machine['buttonA']['x'] * machine['prize']['y'] - machine['buttonA']['y'] * machine['prize']['x']) /
    (machine['buttonA']['x'] * machine['buttonB']['y'] - machine['buttonA']['y'] * machine['buttonB']['x'])
  const aPushes = (machine['prize']['x'] - bPushes * machine['buttonB']['x']) / machine['buttonA']['x']

  return ((Math.floor(aPushes) === aPushes) && (Math.floor(bPushes) === bPushes)) ? 3 * aPushes + bPushes : 0
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
      x: parseInt(match[1]) + 10000000000000,
      y: parseInt(match[2]) + 10000000000000
    }
    i++

    const tokens = getLeastTokens(machine)
    if (tokens !== 0) {
      totalTokens += tokens
    }
  }

  console.log(totalTokens)
} catch (err) {
  console.error('Error reading file: ', err)
}
