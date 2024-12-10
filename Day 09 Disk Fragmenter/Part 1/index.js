import fs from 'fs'

function buildBlocks (diskMap) {
  const blocks = []

  let fileOrSpace = 'F'
  let fileId = -1

  for (let i = 0; i < diskMap.length; i++) {
    const length = parseInt(diskMap[i])

    let blockContents
    if (fileOrSpace === 'F') {
      fileId++
      blockContents = fileId
      fileOrSpace = 'S'
    } else {
      blockContents = 'S'
      fileOrSpace = 'F'
    }

    for (let j = 0; j < length; j++) {
      blocks.push(blockContents)
    }
  }

  return blocks
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const blocks = buildBlocks(fileInput.replace(/\r\n/g, ''))

  let leftIndex = 0
  let rightIndex = blocks.length - 1

  // Remove all free space between files.
  while (leftIndex < rightIndex) {
    // Find leftmost space block.
    while (leftIndex < blocks.length && blocks[leftIndex] !== 'S') {
      leftIndex++
    }
    // Find rightmost file block.
    while (rightIndex >= 0 && blocks[rightIndex] === 'S') {
      rightIndex--
    }
    // Move file to space.
    if (leftIndex < rightIndex) {
      blocks[leftIndex] = blocks[rightIndex]
      leftIndex++
      blocks[rightIndex] = 'S'
      rightIndex--
    }
  }

  let checksum = 0

  // Calculate checksum.
  let index = 0
  while (blocks[index] !== 'S') {
    checksum += blocks[index] * index
    index++
  }

  console.log(checksum)
} catch (err) {
  console.error('Error reading file: ', err)
}
