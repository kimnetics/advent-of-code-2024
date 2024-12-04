import fs from 'fs'

try {
  let list1 = []
  let list2 = {}

  let totalScore = 0

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const inputLength = input.length - 1

  for (let i = 0; i < inputLength; i++) {
    const characters = input[i].split('  ')
    list1.push(parseInt(characters[0]))

    const key = parseInt(characters[1])
    if (key in list2) {
      list2[key]++
    } else {
      list2[key] = 1
    }
  }

  for (let i = 0; i < inputLength; i++) {
    const score = list1[i] * ((list1[i] in list2) ? list2[list1[i]] : 0)
    totalScore += score
  }

  console.log(totalScore)
} catch (err) {
  console.error('Error reading file: ', err)
}
