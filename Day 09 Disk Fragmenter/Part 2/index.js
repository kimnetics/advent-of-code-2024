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

  return [fileId, blocks]
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const [highestFileId, blocks] = buildBlocks(fileInput.replace(/\r\n/g, ''))

  let fileId = highestFileId
  let spaceStart = 0
  let spaceEnd = spaceStart
  let fileStart = blocks.length - 1
  let fileEnd = fileStart

  // Move files to free space.
  while (fileId > 0) {
    // Find file end block.
    while (fileEnd >= 0 && blocks[fileEnd] === 'S') {
      fileEnd--
    }

    // Find file start block.
    fileId = blocks[fileEnd]
    fileStart = fileEnd - 1
    while (fileStart >= 0 && blocks[fileStart] === blocks[fileEnd]) {
      fileStart--
    }
    fileStart++

    const fileLength = fileEnd - fileStart + 1

    spaceStart = 0
    while (true) {
      // Find space start block.
      while (spaceStart < blocks.length && blocks[spaceStart] !== 'S') {
        spaceStart++
      }

      // Is space after file?
      if (spaceStart > fileStart) {
        break
      }

      // Find space end block.
      spaceEnd = spaceStart + 1
      while (spaceEnd < blocks.length && blocks[spaceEnd] === 'S') {
        spaceEnd++
      }
      spaceEnd--

      const spaceLength = spaceEnd - spaceStart + 1

      // Will file fit in space?
      if (fileLength <= spaceLength) {
        // Move file to space.
        for (let i = 0; i < fileLength; i++) {
          blocks[spaceStart + i] = blocks[fileStart + i]
          blocks[fileStart + i] = 'S'
        }
        break
      } else {
        spaceStart = spaceEnd + 1
      }
    }

    fileEnd = fileStart - 1
  }

  let checksum = 0

  // Calculate checksum.
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== 'S') {
      checksum += blocks[i] * i
    }
  }

  console.log(checksum)
} catch (err) {
  console.error('Error reading file: ', err)
}
