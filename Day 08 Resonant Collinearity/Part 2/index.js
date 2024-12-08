import fs from 'fs'

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const mapLength = input.length - 1

  const map = []

  // Convert input into two dimensional array.
  for (let i = 0; i < mapLength; i++) {
    map.push(input[i].split(''))
  }

  const mapWidth = map[0].length

  const antennas = {}

  // Build map of all antenna types and locations.
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] !== '.') {
        if (!Object.hasOwn(antennas, map[y][x])) {
          antennas[map[y][x]] = []
        }

        antennas[map[y][x]].push([x, y])
      }
    }
  }

  const locationCombinations = []

  // Build array of combinations of locations for each antenna type.
  for (const antennaType of Object.keys(antennas)) {
    const locations = antennas[antennaType]
    const combinations = locations.flatMap((cur, i) => locations.slice(i + 1).map(itemToPair => [cur, itemToPair]))
    locationCombinations.push(combinations)
  }

  const antinodes = {}

  // Build map of antinodes.
  for (const combinations of locationCombinations) {
    for (let i = 0; i <  combinations.length; i++) {
      const xDelta = Math.abs(combinations[i][0][0] - combinations[i][1][0])
      const yDelta = Math.abs(combinations[i][0][1] - combinations[i][1][1])

      // Paired antennas are antinodes.
      antinodes[[combinations[i][0][0], combinations[i][0][1]]] = [combinations[i][0][0], combinations[i][0][1]]
      antinodes[[combinations[i][1][0], combinations[i][1][1]]] = [combinations[i][1][0], combinations[i][1][1]]

      // Upward slope?
      // (smaller x, bigger y or bigger x, smaller y)
      let x
      let y
      if (((combinations[i][0][0] < combinations[i][1][0]) && (combinations[i][0][1] > combinations[i][1][1]))
        || ((combinations[i][0][0] > combinations[i][1][0]) && (combinations[i][0][1] < combinations[i][1][1]))) {
        x = combinations[i][0][0] + xDelta
        y = combinations[i][0][1] - yDelta
        while (x < mapWidth && y >= 0) {
          antinodes[[x, y]] = [x, y]
          x += xDelta
          y -= yDelta
        }

        x = combinations[i][1][0] - xDelta
        y = combinations[i][1][1] + yDelta
        while (x >= 0 && y < mapLength) {
          antinodes[[x, y]] = [x, y]
          x -= xDelta
          y += yDelta
        }
      } else {
        x = combinations[i][0][0] - xDelta
        y = combinations[i][0][1] - yDelta
        while (x >= 0 && y >= 0) {
          antinodes[[x, y]] = [x, y]
          x -= xDelta
          y -= yDelta
        }

        x = combinations[i][1][0] + xDelta
        y = combinations[i][1][1] + yDelta
        while (x < mapWidth && y < mapLength) {
          antinodes[[x, y]] = [x, y]
          x += xDelta
          y += yDelta
        }
      }
    }
  }

  console.log(Object.keys(antinodes).length)
} catch (err) {
  console.error('Error reading file: ', err)
}
