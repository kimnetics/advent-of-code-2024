import fs from 'fs'

function getFirstInvalidPageIndex (rulesMap, page, remainingPages) {
  const remainingPagesLength = remainingPages.length
  for (let i = 0; i < remainingPagesLength; i++) {
    if ((Object.hasOwn(rulesMap, page)) &&
      (Object.hasOwn(rulesMap[page], remainingPages[i]))) {
      return i
    }
  }

  return null
}

function arePagesValid (rulesMap, pages) {
  const pagesLength = pages.length - 1
  for (let i = 0; i < pagesLength; i++) {
    if (getFirstInvalidPageIndex(rulesMap, pages[i], pages.slice(0 - (pagesLength - i))) !== null) {
      return false
    }
  }

  return true
}

function fixPages (rulesMap, pages) {
  const pagesLength = pages.length - 1

  let checkPages = true
  while (checkPages) {
    checkPages = false

    for (let i = 0; i < pagesLength; i++) {
      const index = getFirstInvalidPageIndex(rulesMap, pages[i], pages.slice(0 - (pagesLength - i)))
      if (index !== null) {
        // Move page in front of page to satisfy rule.
        pages.splice(i, 0, pages[i + 1 + index])
        pages.splice(i + 2 + index, 1)

        checkPages = true
      }
    }
  }
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

    // If pages are not valid, fix pages and add middle page to sum.
    if (!arePagesValid(rulesMap, pages)) {
      fixPages(rulesMap, pages)
      middlePageSum += parseInt(pages[Math.floor(pages.length / 2)])
    }
  }

  console.log(middlePageSum)
} catch (err) {
  console.error('Error reading file: ', err)
}
