import fs from 'fs'

try {
  let mulTotal = 0

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')

  const instructionPattern = /(mul\(\d+,\d+\))|(do\(\))|(don't\(\))/g
  const numberParser = /mul\((\d+),(\d+)\)/

  let enabled = true
  fileInput.match(instructionPattern).forEach((instruction) => {
    switch (instruction.slice(0, 3)) {
      case 'do(':
        enabled = true
        break
      case 'don':
        enabled = false
        break
      case 'mul':
        if (enabled) {
          const numbers = instruction.match(numberParser)
          mulTotal += numbers[1] * numbers[2]
        }
        break
    }
  })

  console.log(mulTotal)
} catch (err) {
  console.error('Error reading file: ', err)
}
