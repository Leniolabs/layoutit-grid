// @ts-ignore
import { parseValue, parseUnit } from '../utils/grid.js'
export { parseValue, parseUnit }
// @ts-ignore
export { validGridUnits, parseValueUnit, isValidTrackSize } from '../utils/grid.js'
import { GridDimension, GridState, LineName, ValueUnit, GridUnit } from '../types'

export function gridTemplateToArr(str: string): string[] {
  return str.split(/(?!\(.*)\s(?![^(]*?\))/g)
}

export function isValidLineName(str: string): boolean {
  return true
}

export function valueUnitToString({ value, unit }: ValueUnit): string {
  switch (unit) {
    case 'minmax':
      return `minmax(${value})`
    case 'min-content':
    case 'max-content':
    case 'auto':
      return unit
    default:
      return `${value}${unit}`
  }
}

function newLineNames(n: number): LineName[] {
  return lineNamesToState(Array(n).fill(''))
}

export function lineNamesToState(names: string[]): LineName[] {
  return names.map((name) => {
    return { active: name != '', name }
  })
}

/*
{
  col {
    sizes,
    auto,
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

export function createGridDimension(n: number): GridDimension {
  return {
    sizes: new Array(n).fill('1fr'),
    auto: [],
    lineNames: newLineNames(n + 1),
    gap: '0px',
  }
}

export function createGridState({
  row = createGridDimension(3),
  col = createGridDimension(3),
  autoFlow = 'row',
  justifyContent = 'initial',
  alignContent = 'initial',
  justifyItems = 'initial',
  alignItems = 'initial'
} = {}): GridState {
  return {
    row,
    col,
    autoFlow,
    justifyContent,
    alignContent,
    justifyItems,
    alignItems,
  } as GridState
}

// TODO: abstract these helpers to work with the dimmension passed as param 'col', 'row'

export function getRowValue(grid: GridState, n: number) {
  return parseValue(grid.row.sizes[n])
}

export function getRowUnit(grid: GridState, n: number) {
  return parseUnit(grid.row.sizes[n])
}

export function getColValue(grid: GridState, n: number) {
  return parseValue(grid.col.sizes[n])
}

export function getColUnit(grid: GridState, n: number) {
  return parseUnit(grid.col.sizes[n])
}

export function setRowValueUnit(grid: GridState, n: number, x: ValueUnit) {
  grid.row.sizes[n] = valueUnitToString(x)
}

export function setRowValue(grid: GridState, n: number, value: string) {
  setRowValueUnit(grid, n, { value, unit: getRowUnit(grid, n) })
}

export function setColValueUnit(grid: GridState, n: number, x: ValueUnit) {
  grid.col.sizes[n] = valueUnitToString(x)
}

export function setColValue(grid: GridState, n: number, value: string) {
  setColValueUnit(grid, n, { value, unit: getColUnit(grid, n) })
}

export function addImplicitCol(grid: GridState, val: string) {
  grid.col.auto.push(val)
}

export function addImplicitRow(grid: GridState, val: string) {
  grid.row.auto.push(val)
}

export function getImplicitRowValue(grid: GridState, n: number) {
  return parseValue(grid.row.auto[n])
}

export function getImplicitRowUnit(grid: GridState, n: number) {
  return parseUnit(grid.row.auto[n])
}

export function getImplicitColValue(grid: GridState, n: number) {
  return parseValue(grid.col.auto[n])
}

export function getImplicitColUnit(grid: GridState, n: number) {
  return parseUnit(grid.col.auto[n])
}

export function setImplicitRowValueUnit(grid: GridState, n: number, x: ValueUnit) {
  grid.row.auto[n] = valueUnitToString(x)
}

export function setImplicitRowValue(grid: GridState, n: number, value: string) {
  setImplicitRowValueUnit(grid, n, { value, unit: getImplicitRowUnit(grid, n) })
}

export function setImplicitColValueUnit(grid: GridState, n: number, x: ValueUnit) {
  grid.col.auto[n] = valueUnitToString(x)
}

export function setImplicitColValue(grid: GridState, n: number, value: string) {
  setImplicitColValueUnit(grid, n, { value, unit: getImplicitColUnit(grid, n) })
}

export function removeImplicitRow(grid: GridState, n: number) {
  grid.row.auto.splice(n, 1)
}
export function removeImplicitCol(grid: GridState, n: number) {
  grid.col.auto.splice(n, 1)
}

export function withChangedValue(current: GridUnit, newValue: string) {
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
export function withChangedUnit(current: GridUnit, newUnit: GridUnit) {
  return valueUnitToString({ value: unitMeasureMap[newUnit], unit: newUnit })
}

function parseLineName(item: string): string | undefined {
  return item.includes('[') ? item.match(/\[(.*)\]/)?.[1].trim() : undefined
}

export function parseGridTemplate(templateStr: string) {
  // splits at and space that isn't between two [ ] brackets
  const parsedArr = templateStr.split(/\s(?![^[]*])/)
  const lineNames: string[] = []
  const templateArr: string[] = []
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
