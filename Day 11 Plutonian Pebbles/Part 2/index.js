import fs from 'fs'

function blinkStone (stone, stones) {
  const matchingStone = stones.find((s) => s.number === stone.number)
  if (matchingStone) {
    matchingStone.count += stone.count
  } else {
    stones.push(stone)
  }
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.replace(/\r\n/g, '')
  let stones = input.split(' ').map(number => ({
    number: parseInt(number),
    count: 1
  }))

  for (let blink = 0; blink < 75; blink++) {
    const newStones = []

    for (const stone of stones) {
      if (stone.number === 0) {
        blinkStone({
          number: 1,
          count: stone.count
        }, newStones)
      } else {
        const stoneNumberString = stone.number.toString()
        const stoneNumberLength = stoneNumberString.length

        if (stoneNumberLength % 2 === 0) {
          const stoneNumberMiddle = stoneNumberLength / 2
          blinkStone({
            number: parseInt(stoneNumberString.slice(0, stoneNumberMiddle)),
            count: stone.count
          }, newStones)
          blinkStone({
            number: parseInt(stoneNumberString.slice(stoneNumberMiddle)),
            count: stone.count
          }, newStones)
        } else {
          blinkStone({
            number: stone.number * 2024,
            count: stone.count
          }, newStones)
        }
      }
    }

    stones = newStones
  }

  let totalCount = 0
  for (const stone of stones) {
    totalCount += stone.count
  }

  console.log(totalCount)
} catch (err) {
  console.error('Error reading file: ', err)
}
