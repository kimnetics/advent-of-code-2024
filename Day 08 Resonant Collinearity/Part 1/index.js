import fs from 'fs'

try {
  let uniqueAntinodeCount = 0

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
    for (let i = 0; i < combinations.length; i++) {
      const xDelta = Math.abs(combinations[i][0][0] - combinations[i][1][0])
      const yDelta = Math.abs(combinations[i][0][1] - combinations[i][1][1])

      // Upward slope?
      // (smaller x, bigger y or bigger x, smaller y)
      if (((combinations[i][0][0] < combinations[i][1][0]) && (combinations[i][0][1] > combinations[i][1][1]))
        || ((combinations[i][0][0] > combinations[i][1][0]) && (combinations[i][0][1] < combinations[i][1][1]))) {
        antinodes[[combinations[i][0][0] + xDelta, combinations[i][0][1] - yDelta]] = [combinations[i][0][0] + xDelta, combinations[i][0][1] - yDelta]
        antinodes[[combinations[i][1][0] - xDelta, combinations[i][1][1] + yDelta]] = [combinations[i][1][0] - xDelta, combinations[i][1][1] + yDelta]
      } else {
        antinodes[[combinations[i][0][0] - xDelta, combinations[i][0][1] - yDelta]] = [combinations[i][0][0] - xDelta, combinations[i][0][1] - yDelta]
        antinodes[[combinations[i][1][0] + xDelta, combinations[i][1][1] + yDelta]] = [combinations[i][1][0] + xDelta, combinations[i][1][1] + yDelta]
      }
    }
  }

  // Count valid antinodes.
  for (const key of Object.keys(antinodes)) {
    const location = antinodes[key]

    // Is antinode valid?
    if (location[0] >= 0 && location[0] < mapWidth && location[1] >= 0 && location[1] < mapLength) {
      uniqueAntinodeCount++
    }
  }

  console.log(uniqueAntinodeCount)
} catch (err) {
  console.error('Error reading file: ', err)
}
