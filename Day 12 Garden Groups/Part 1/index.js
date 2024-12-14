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

function calculatePerimeter (region) {
  let perimeter = 0

  // Loop through plots.
  for (const i in region[1]) {
    let [x, y, letter] = region[1][i]

    // W
    if (!plotGroupMap.has(buildPlotGroupKey(x - 1, y, letter))) {
      perimeter++
    }
    // N
    if (!plotGroupMap.has(buildPlotGroupKey(x, y - 1, letter))) {
      perimeter++
    }
    // E
    if (!plotGroupMap.has(buildPlotGroupKey(x + 1, y, letter))) {
      perimeter++
    }
    // S
    if (!plotGroupMap.has(buildPlotGroupKey(x, y + 1, letter))) {
      perimeter++
    }
  }

  return perimeter
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
    const perimeter = calculatePerimeter(region)
    totalPrice += region[1].length * perimeter
  }

  console.log(totalPrice)
} catch (err) {
  console.error('Error reading file: ', err)
}
