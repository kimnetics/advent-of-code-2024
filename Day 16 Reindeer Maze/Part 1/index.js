import fs from 'fs'

class PriorityQueue {
  constructor () {
    this.queue = []
  }

  enqueue (node) {
    this.queue.push(node)
    this.queue.sort((a, b) => a.points - b.points)
  }

  dequeue () {
    if (this.isEmpty()) {
      return null
    }
    return this.queue.shift()
  }

  isEmpty () {
    return this.queue.length === 0
  }
}

function getOptions (node) {
  return [
    {
      x: node.x + node.xOffset,
      y: node.y + node.yOffset,
      xOffset: node.xOffset,
      yOffset: node.yOffset,
      points: node.points + 1
    },
    {
      x: node.x,
      y: node.y,
      xOffset: node.yOffset,
      yOffset: -node.xOffset,
      points: node.points + 1000
    },
    {
      x: node.x,
      y: node.y,
      xOffset: -node.yOffset,
      yOffset: node.xOffset,
      points: node.points + 1000
    }
  ]
}

try {
  const map = []

  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  const mapLength = input.length - 1

  // Convert input into two dimensional map.
  for (let y = 0; y < mapLength; y++) {
    map.push(input[y].split(''))
  }

  const mapWidth = map[0].length

  // Find starting position.
  let startX = -1
  let startY = -1
  for (let y = 0; y < mapLength; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === 'S') {
        startX = x
        startY = y
        break
      }
    }
    if (startX !== -1) {
      break
    }
  }

  // Use Dijkstra's algorithm to find the path with the lowest cost.
  // Credit to AndreasDotNet for the algorithm tips. https://www.youtube.com/watch?v=qThcrjlid4M&t

  const pq = new PriorityQueue()
  const visited = new Set()

  const startNode = {
    x: startX,
    y: startY,
    xOffset: 1,
    yOffset: 0,
    points: 0
  }
  pq.enqueue(startNode)
  visited.add(`${startNode.x}, ${startNode.y}, 1, 0`)

  let totalPoints = 0

  while (!pq.isEmpty()) {
    const node = pq.dequeue()

    if (map[node.y][node.x] === 'E') {
      totalPoints = node.points
      break
    }

    visited.add(`${node.x}, ${node.y}, ${node.xOffset}, ${node.yOffset}`)

    for (const optionNode of getOptions(node)) {
      if (map[optionNode.y][optionNode.x] === '#') {
        continue
      }

      if (visited.has(`${optionNode.x}, ${optionNode.y}, ${optionNode.xOffset}, ${optionNode.yOffset}`)) {
        continue
      }

      pq.enqueue(optionNode)
    }
  }

  console.log(totalPoints)
} catch (err) {
  console.error('Error reading file: ', err)
}
