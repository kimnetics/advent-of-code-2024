import fs from 'fs'

class PriorityQueue {
  constructor () {
    this.queue = []
  }

  enqueue (points, node, lastNode) {
    this.queue.push([points, node, lastNode])
    this.queue.sort((a, b) => a[0] - b[0])
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

class Queue {
  constructor () {
    this.queue = []
  }

  enqueue (element) {
    this.queue.push(element)
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

function getOptions (node, points) {
  return [
    {
      x: node.x + node.xOffset,
      y: node.y + node.yOffset,
      xOffset: node.xOffset,
      yOffset: node.yOffset,
      points: points + 1
    },
    {
      x: node.x,
      y: node.y,
      xOffset: node.yOffset,
      yOffset: -node.xOffset,
      points: points + 1000
    },
    {
      x: node.x,
      y: node.y,
      xOffset: -node.yOffset,
      yOffset: node.xOffset,
      points: points + 1000
    }
  ]
}

function getKey (x, y, xOffset, yOffset) {
  return `${x}, ${y}, ${xOffset}, ${yOffset}`
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

  // Use modified Dijkstra's algorithm to find all paths with the lowest cost.
  // Credit to AndreasDotNet for the algorithm tips. https://www.youtube.com/watch?v=qThcrjlid4M&t

  const pq = new PriorityQueue()
  const lowestPoints = new Map()
  const backTrack = new Map()
  const endNodeKeys = new Set()

  const startNode = {
    x: startX,
    y: startY,
    xOffset: 1,
    yOffset: 0
  }
  const fakeNode = {
    x: -1,
    y: -1,
    xOffset: -1,
    yOffset: -1
  }
  pq.enqueue(0, startNode, fakeNode)
  lowestPoints.set(getKey(startNode.x, startNode.y, startNode.xOffset, startNode.yOffset), 0)

  let currentLowestPoints = Number.MAX_SAFE_INTEGER

  while (!pq.isEmpty()) {
    const [points, node, lastNode] = pq.dequeue()

    const nodeKey = getKey(node.x, node.y, node.xOffset, node.yOffset)
    if (lowestPoints.has(nodeKey) && points > lowestPoints.get(nodeKey)) {
      continue
    }
    lowestPoints.set(nodeKey, points)

    if (map[node.y][node.x] === 'E') {
      if (points > currentLowestPoints) {
        break
      }
      currentLowestPoints = points
      endNodeKeys.add(nodeKey)
    }

    if (!backTrack.has(nodeKey)) {
      backTrack.set(nodeKey, [])
    }
    backTrack.get(nodeKey).push(lastNode)

    for (const option of getOptions(node, points)) {
      if (map[option.y][option.x] === '#') {
        continue
      }

      const optionKey = getKey(option.x, option.y, option.xOffset, option.yOffset)
      if (lowestPoints.has(optionKey) && points > lowestPoints.get(optionKey)) {
        continue
      }

      pq.enqueue(option.points, option, node)
    }
  }

  const states = new Queue()
  const seen = new Set()
  for (const endNodeKey of endNodeKeys) {
    states.enqueue(endNodeKey)
    seen.add(endNodeKey)
  }

  while (!states.isEmpty()) {
    const backTrackKey = states.dequeue()
    if (!backTrack.has(backTrackKey)) {
      continue
    }

    for (const node of backTrack.get(backTrackKey)) {
      const nodeKey = getKey(node.x, node.y, node.xOffset, node.yOffset)
      if (seen.has(nodeKey)) {
        continue
      }
      if ((node.x === -1) && (node.y === -1)) {
        continue
      }

      seen.add(nodeKey)
      states.enqueue(nodeKey)
    }
  }

  const uniqueSeen = new Set(Array.from(seen).map((nodeKey) => {
    const elements = nodeKey.split(',')
    return `${elements[0]}, ${elements[1]}`
  }))
  console.log(uniqueSeen.size)
} catch (err) {
  console.error('Error reading file: ', err)
}
