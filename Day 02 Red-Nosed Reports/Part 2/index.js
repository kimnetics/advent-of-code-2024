import fs from 'fs'

function checkReports (reports) {
  let last = reports[0]
  let iOrD = 0

  for (let j = 1; j < reports.length; j++) {
    const diff = reports[j] - last
    const absDiff = Math.abs(diff)
    if (absDiff < 1 || absDiff > 3) {
      return false
    } else {
      if (iOrD === 0) {
        iOrD = diff
      } else {
        if (((iOrD > 0) && (diff < 0)) || ((iOrD < 0) && (diff > 0))) {
          return false
        }
      }
    }
    last = reports[j]
  }

  return true
}

function engageDampener (reports) {
  for (let i = 0; i < reports.length; i++) {
    const dampenedReports = [...reports]
    dampenedReports.splice(i, 1)
    if (checkReports(dampenedReports)) {
      return true
    }
  }
  return false
}

try {
  let safeTotal = 0

  const inputFile = fs.readFileSync('../input.txt', 'utf-8')
  const input = inputFile.split('\r\n')
  const inputLength = input.length - 1

  for (let i = 0; i < inputLength; i++) {
    const reports = input[i].split(' ').map(r => parseInt(r))

    if (checkReports(reports)) {
      safeTotal++
    } else {
      if (engageDampener(reports)) {
        safeTotal++
      }
    }
  }

  console.log(safeTotal)
} catch
  (err) {
  console.error('Error reading file: ', err)
}
