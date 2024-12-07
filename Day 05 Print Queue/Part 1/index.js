import fs from 'fs'

function isPageValid (rulesMap, page, remainingPages) {
  for (const remainingPage of remainingPages) {
    if ((Object.hasOwn(rulesMap, page)) &&
      (Object.hasOwn(rulesMap[page], remainingPage))) {
      return false
    }
  }

  return true
}

function arePagesValid (rulesMap, pages) {
  const pagesLength = pages.length - 1
  for (let i = 0; i < pagesLength; i++) {
    if (!isPageValid(rulesMap, pages[i], pages.slice(0 - (pagesLength - i)))) {
      return false
    }
  }

  return true
}

try {
  let middlePageSum = 0

  const fileInputRules = fs.readFileSync('../input-rules.txt', 'utf-8')
  const inputRules = fileInputRules.split('\r\n')
  const inputRulesLength = inputRules.length - 1

  const rulesMap = {}

  // Build map of page numbers before a page number.
  for (let i = 0; i < inputRulesLength; i++) {
    const left = inputRules[i].slice(0, 2)
    const right = inputRules[i].slice(3)

    if (!Object.hasOwn(rulesMap, right)) {
      rulesMap[right] = {}
    }
    rulesMap[right][left] = ''
  }

  const fileInputPages = fs.readFileSync('../input-pages.txt', 'utf-8')
  const inputPages = fileInputPages.split('\r\n')
  const inputPagesLength = inputPages.length - 1

  // Loop through pages.
  for (let i = 0; i < inputPagesLength; i++) {
    const pages = inputPages[i].split(',')

    // If pages are valid, add middle page to sum.
    if (arePagesValid(rulesMap, pages)) {
      middlePageSum += parseInt(pages[Math.floor(pages.length / 2)])
    }
  }

  console.log(middlePageSum)
} catch (err) {
  console.error('Error reading file: ', err)
}
