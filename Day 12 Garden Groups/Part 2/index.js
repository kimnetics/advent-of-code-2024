import fs from 'fs'

let mapLength = 0
let mapWidth = 0

let lastGroupNumber = 0
const plotGroupMap = new Map()
const groupPlotMap = new Map()

function buildPlotGroupKey (x, y, letter) {
  return x + '~' + y + '~' + letter
}

function setGroupNumber (plot) {
  const x = plot.x
  const y = plot.y
  const letter = plot.letter

  let groupNumber
  if (plot.groupNumber === 0) {
    groupNumber = ++lastGroupNumber
    plot.groupNumber = groupNumber
    groupPlotMap.set(groupNumber, [[x, y, letter]])
  } else {
    groupNumber = plot.groupNumber
  }

  let key

  // W
  key = buildPlotGroupKey(x - 1, y, letter)
  if (plotGroupMap.has(key)) {
    const wPlot = plotGroupMap.get(key)
    if (wPlot.groupNumber === 0) {
      wPlot.groupNumber = groupNumber
      groupPlotMap.get(groupNumber).push([wPlot.x, wPlot.y, letter])
      setGroupNumber(wPlot)
    }
  }

  // N
  key = buildPlotGroupKey(x, y - 1, letter)
  if (plotGroupMap.has(key)) {
    const nPlot = plotGroupMap.get(key)
    if (nPlot.groupNumber === 0) {
      nPlot.groupNumber = groupNumber
      groupPlotMap.get(groupNumber).push([nPlot.x, nPlot.y, letter])
      setGroupNumber(nPlot)
    }
  }

  // E
  key = buildPlotGroupKey(x + 1, y, letter)
  if (plotGroupMap.has(key)) {
    const ePlot = plotGroupMap.get(key)
    if (ePlot.groupNumber === 0) {
      ePlot.groupNumber = groupNumber
      groupPlotMap.get(groupNumber).push([ePlot.x, ePlot.y, letter])
      setGroupNumber(ePlot)
    }
  }

  // S
  key = buildPlotGroupKey(x, y + 1, letter)
  if (plotGroupMap.has(key)) {
    const sPlot = plotGroupMap.get(key)
    if (sPlot.groupNumber === 0) {
      sPlot.groupNumber = groupNumber
      groupPlotMap.get(groupNumber).push([sPlot.x, sPlot.y, letter])
      setGroupNumber(sPlot)
    }
  }
}

function countSides (region) {
  const sortedPlots = region[1].sort((a, b) => {
    if (a[1] === b[1]) {
      if (a[0] === b[0]) {
        return 0
      } else if (a[0] < b[0]) {
        return -1
      } else {
        return 1
      }
    } else if (a[1] < b[1]) {
      return -1
    } else {
      return 1
    }
  })

  const wSides = new Map()
  const nSides = new Map()
  const eSides = new Map()
  const sSides = new Map()

  for (const i in sortedPlots) {
    let [x, y, letter] = sortedPlots[i]

    // Build map of all west sides.
    if (!plotGroupMap.has(buildPlotGroupKey(x - 1, y, letter))) {
      if (!wSides.has(x)) {
        wSides.set(x, [y])
      } else {
        wSides.get(x).push(y)
      }
    }

    // Build map of all north sides.
    if (!plotGroupMap.has(buildPlotGroupKey(x, y - 1, letter))) {
      if (!nSides.has(y)) {
        nSides.set(y, [x])
      } else {
        nSides.get(y).push(x)
      }
    }

    // Build map of all east sides.
    if (!plotGroupMap.has(buildPlotGroupKey(x + 1, y, letter))) {
      if (!eSides.has(x)) {
        eSides.set(x, [y])
      } else {
        eSides.get(x).push(y)
      }
    }

    // Build map of all south sides.
    if (!plotGroupMap.has(buildPlotGroupKey(x, y + 1, letter))) {
      if (!sSides.has(y)) {
        sSides.set(y, [x])
      } else {
        sSides.get(y).push(x)
      }
    }
  }

  let sides = 0
  let lastX
  let lastY

  // Add distinct west sides to total.
  lastX = -10
  lastY = -10
  for (const side of wSides) {
    for (const i in side[1]) {
      const y = side[1][i]
      if ((side[0] !== lastX) || (y !== lastY + 1)) {
        sides++
      }
      lastX = side[0]
      lastY = y
    }
  }

  // Add distinct north sides to total.
  lastX = -10
  lastY = -10
  for (const side of nSides) {
    for (const i in side[1]) {
      const x = side[1][i]
      if ((side[0] !== lastY) || (x !== lastX + 1)) {
        sides++
      }
      lastY = side[0]
      lastX = x
    }
  }

  // Add distinct east sides to total.
  lastX = -10
  lastY = -10
  for (const side of eSides) {
    for (const i in side[1]) {
      const y = side[1][i]
      if ((side[0] !== lastX) || (y !== lastY + 1)) {
        sides++
      }
      lastX = side[0]
      lastY = y
    }
  }

  // Add distinct south sides to total.
  lastX = -10
  lastY = -10
  for (const side of sSides) {
    for (const i in side[1]) {
      const x = side[1][i]
      if ((side[0] !== lastY) || (x !== lastX + 1)) {
        sides++
      }
      lastY = side[0]
      lastX = x
    }
  }

  return sides
}

try {
  const fileInput = fs.readFileSync('../input.txt', 'utf-8')
  const input = fileInput.split('\r\n')
  mapLength = input.length - 1
  mapWidth = input[0].split('').length

  // Add plots to plot group map.
  for (let y = 0; y < mapLength; y++) {
    const plots = input[y].split('')
    for (let x = 0; x < mapWidth; x++) {
      plotGroupMap.set(buildPlotGroupKey(x, y, plots[x]), {
        x,
        y,
        letter: plots[x],
        groupNumber: 0
      })
    }
  }

  // Add group numbers to plot group map.
  const plotGroupMapKeys = plotGroupMap.keys()
  for (const key of plotGroupMapKeys) {
    const plot = plotGroupMap.get(key)
    if (plot.groupNumber === 0) {
      // Set group number.
      setGroupNumber(plot)
    }
  }

  let totalPrice = 0

  // Calculate total price.
  for (const region of groupPlotMap) {
    const sides = countSides(region)
    totalPrice += region[1].length * sides
  }

  console.log(totalPrice)
} catch (err) {
  console.error('Error reading file: ', err)
}
