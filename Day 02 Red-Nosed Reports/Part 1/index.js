import fs from 'fs'

try {
  let safeTotal = 0

  const inputFile = fs.readFileSync('../input.txt', 'utf-8')
  const input = inputFile.split('\r\n')
  const inputLength = input.length - 1

  for (let i = 0; i < inputLength; i++) {
    const reports = input[i].split(' ').map(r => parseInt(r))
    let last = reports[0]
    let iOrD = 0
    let safe = true

    for (let j = 1; j < reports.length; j++) {
      const diff = reports[j] - last
      const absDiff = Math.abs(diff)
      if (absDiff < 1 || absDiff > 3) {
        safe = false
        break
      } else {
        if (iOrD === 0) {
          iOrD = diff
        } else {
          if (((iOrD > 0) && (diff < 0)) || ((iOrD < 0) && (diff > 0))) {
            safe = false
            break
          }
        }
      }
      last = reports[j]
    }

    if (safe) safeTotal++
  }

  console.log(safeTotal)
} catch (err) {
  console.error('Error reading file: ', err)
}
