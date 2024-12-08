import fs from 'fs'

function doesEquationWork (result, values, operators) {
  let calculatedValue = values[0]
  for (let i = 1; i < values.length; i++) {
    switch (operators.charAt(i - 1)) {
      case '*':
        calculatedValue *= values[i]
        break
      case '+':
        calculatedValue += values[i]
        break
      case '|':
        calculatedValue = parseInt('' + calculatedValue + values[i])
        break
    }
  }

  return (calculatedValue === result)
}

try {
  let totalCalibrationResult = 0

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const inputLength = input.length - 1

  const equationParser = /(\d+):\s+(\d.+)/

  // Loop through equations.
  for (let i = 0; i < inputLength; i++) {
    const equationParts = input[i].match(equationParser)
    const result = parseInt(equationParts[1])
    const values = equationParts[2].split(' ').map(v => parseInt(v))

    // Build list of operator permutations.
    let operators = []
    for (let j = 0; j < values.length - 1; j++) {
      const operatorsTemp = []
      if (operators.length === 0) {
        operatorsTemp.push('*')
        operatorsTemp.push('+')
        operatorsTemp.push('|')
      } else {
        for (const operator of operators) {
          operatorsTemp.push(operator + '*')
          operatorsTemp.push(operator + '+')
          operatorsTemp.push(operator + '|')
        }
      }

      operators = operatorsTemp
    }

    // Loop through operator permutations.
    for (let j = 0; j < operators.length; j++) {
      // Does equation work?
      if (doesEquationWork(result, values, operators[j])) {
        totalCalibrationResult += result
        break
      }
    }
  }

  console.log(totalCalibrationResult)
} catch (err) {
  console.error('Error reading file: ', err)
}
