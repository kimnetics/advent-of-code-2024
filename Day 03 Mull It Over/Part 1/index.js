import fs from 'fs'

try {
  let mulTotal = 0

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')

  const mulPattern = /mul\(\d+,\d+\)/g
  const numberParser = /mul\((\d+),(\d+)\)/

  fileInput.match(mulPattern).forEach((mulInstruction) => {
    const numbers = mulInstruction.match(numberParser)
    mulTotal += numbers[1] * numbers[2]
  })

  console.log(mulTotal)
} catch (err) {
  console.error('Error reading file: ', err)
}
