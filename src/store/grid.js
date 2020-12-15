export function gridTemplateToArr(str) {
  return str.split(/(?!\(.*)\s(?![^(]*?\))/g)
}

// TODO: review if default parsed value is needed

function internalParseValue(str) {
  return str.startsWith('minmax') ? str.slice(7, -1) : parseFloat(str, 10)
}
export function parseValue(str) {
  return str ? internalParseValue(str) : 0
}

function internalParseUnit(str) {
  return str.startsWith('minmax') ? 'minmax' : str.match(/[\d.\-+]*\s*(.*)/)[1] || ''
}

export const validGridUnits = ['fr', 'px', '%', 'em', 'auto', 'min-content', 'max-content', 'minmax']

export function parseUnit(str) {
  return str ? internalParseUnit(str) : 'fr'
}

export function parseValueUnit(str) {
  return {
    value: parseValue(str),
    unit: parseUnit(str),
  }
}

export function isValidTrackSize(str) {
  const unit = internalParseUnit(str)
  return validGridUnits.includes(unit) && (unit === 'minmax' || str.replace(unit, '').match(/^[-+]?[0-9]*\.?[0-9]+$/))
}

export function isValidLineName(str) {
  return true
}

export function valueUnitToString({ value, unit }) {
  switch (unit) {
    case 'minmax':
      return `minmax(${value})`
    case 'min-content':
    case 'max-content':
    case 'auto':
    case 'initial':
      return unit
    default:
      return `${value}${unit}`
  }
}

function newLineNames(n) {
  return lineNamesToState(Array(n).fill(''))
}
export function lineNamesToState(names) {
  return names.map((name) => {
    return { active: name != '', name }
  })
}

function typeIndex(type) {
  return type === 'row' ? 0 : 1
}

/*
{
  col {
    sizes,
    lineNames,
    gap
  },
  row {
    sizes,
    lineNames
    gap
  }
}
*/

export function createGridDimension(n) {
  return {
    sizes: new Array(n).fill('1fr'),
    auto: [],
    lineNames: newLineNames(n + 1),
    gap: '0px',
  }
}

export function createGridState(r = 3, c = 2) {
  return {
    row: createGridDimension(r),
    col: createGridDimension(c),
    autoFlow: 'row',
    justifyContent: 'initial',
    alignContent: 'initial',
    justifyItems: 'initial',
    alignItems: 'initial',
  }
}

// TODO: abstract these helpers to work with the dimmension passed as param 'col', 'row'

export function getRowValue(grid, n) {
  return parseValue(grid.row.sizes[n])
}

export function getRowUnit(grid, n) {
  return parseUnit(grid.row.sizes[n])
}

export function getColValue(grid, n) {
  return parseValue(grid.col.sizes[n])
}

export function getColUnit(grid, n) {
  return parseUnit(grid.col.sizes[n])
}

export function setRowValueUnit(grid, n, x) {
  grid.row.sizes[n] = valueUnitToString(x)
}

export function setRowValue(grid, n, value) {
  setRowValueUnit(grid, n, { value, unit: getRowUnit(grid, n) })
}

export function setColValueUnit(grid, n, x) {
  grid.col.sizes[n] = valueUnitToString(x)
}

export function setColValue(grid, n, value) {
  setColValueUnit(grid, n, { value, unit: getColUnit(grid, n) })
}

export function addImplicitCol(grid, val) {
  grid.col.auto.push(val)
}

export function addImplicitRow(grid, val) {
  grid.row.auto.push(val)
}

export function getImplicitRowValue(grid, n) {
  return parseValue(grid.row.auto[n])
}

export function getImplicitRowUnit(grid, n) {
  return parseUnit(grid.row.auto[n])
}

export function getImplicitColValue(grid, n) {
  return parseValue(grid.col.auto[n])
}

export function getImplicitColUnit(grid, n) {
  return parseUnit(grid.col.auto[n])
}

export function setImplicitRowValueUnit(grid, n, x) {
  grid.row.auto[n] = valueUnitToString(x)
}

export function setImplicitRowValue(grid, n, value) {
  setImplicitRowValueUnit(grid, n, { value, unit: getImplicitRowUnit(grid, n) })
}

export function setImplicitColValueUnit(grid, n, x) {
  grid.col.auto[n] = valueUnitToString(x)
}

export function setImplicitColValue(grid, n, value) {
  setImplicitColValueUnit(grid, n, { value, unit: getImplicitColUnit(grid, n) })
}

export function removeImplicitRow(grid, n) {
  grid.row.auto.splice(n, 1)
}
export function removeImplicitCol(grid, n) {
  grid.col.auto.splice(n, 1)
}

export function withChangedValue(current, newValue) {
  return valueUnitToString({ value: newValue, unit: parseUnit(current) })
}

export const unitMeasureMap = {
  px: 300,
  fr: 1,
  em: 4,
  '%': 10,
  minmax: '20px, 60px',
  auto: '',
  'min-content': '',
  'max-content': '',
}
export function withChangedUnit(current, newUnit) {
  return valueUnitToString({ value: unitMeasureMap[newUnit], unit: newUnit })
}

function parseLineName(item) {
  return item.includes('[') ? item.match(/\[(.*)\]/)[1].trim() : null
}

export function parseGridTemplate(templateStr) {
  // splits at and space that isn't between two [ ] brackets
  const parsedArr = templateStr.split(/\s(?![^[]*])/)
  const lineNames = []
  const templateArr = []
  let position = 0
  parsedArr.forEach((item) => {
    const lineName = parseLineName(item)
    if (lineName) {
      while (lineNames.length < position) {
        lineNames.push('')
      }
      lineNames.push(lineName)
    } else {
      templateArr.push(item)
      ++position
    }
  })
  while (lineNames.length <= templateArr.length) {
    lineNames.push('')
  }

  return [templateArr, lineNames]
}
