import fs from 'fs'

try {
  let list1 = []
  let list2 = []

  let totalDistance = 0

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const inputLength = input.length - 1

  for (let i = 0; i < inputLength; i++) {
    const locations = input[i].split('  ')
    list1.push(parseInt(locations[0]))
    list2.push(parseInt(locations[1]))
  }

  list1.sort()
  list2.sort()

  for (let i = 0; i < inputLength; i++) {
    const distance = Math.abs(list1[i] - list2[i])
    totalDistance += distance
  }

  console.log(totalDistance)
} catch (err) {
  console.error('Error reading file: ', err)
}
