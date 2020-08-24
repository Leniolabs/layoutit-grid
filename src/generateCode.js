import { getGridArea, toCssName, gridTemplateAreas, namedTemplateColumns, namedTemplateRows } from './utils.js'

function prefixedName(name, prefix) {
  return toCssName(`${prefix ? prefix + '-' : ''}${name}`)
}

export function areaToCSS(
  area,
  { parentGrid, useTemplateAreas = true, validTemplateAreas = true, prefix, repeat, oldSpec }
) {
  const { name, grid } = area
  const singleLine = grid == null
  const pName = prefixedName(name, prefix)
  let css = `.${pName} {${singleLine ? '' : '\n'}`
  if (grid) {
    css += gridToCSS(name, grid, { useTemplateAreas, prefix, repeat })
  }

  const gridArea = getGridArea(area, parentGrid)
  if (gridArea) {
    css += `${singleLine ? ' ' : '\n  '}grid-area: ${useTemplateAreas && validTemplateAreas ? pName : gridArea};`
  }
  css += `${singleLine ? ' ' : '\n'}}\n`

  if (grid) {
    const validTemplateAreas = gridTemplateAreas(grid) !== undefined
    grid.areas.forEach((area) => {
      css += '\n' + areaToCSS(area, { parentGrid: grid, useTemplateAreas, validTemplateAreas, prefix, repeat })
    })
  }

  if (oldSpec) {
    css += '\n' + ie_areaToCSS(area, { prefix, repeat })
  }

  return css
}

export function gridToCSS(name, grid, { useTemplateAreas = true, prefix, repeat }) {
  let css = `  display: grid;
  grid-template-columns: ${namedTemplateColumns(grid, repeat)};
  grid-template-rows: ${namedTemplateRows(grid, repeat)};
  gap: ${grid.row.gap + ' ' + grid.col.gap};` // TODO: cssGridGap(grid)

  if (useTemplateAreas) {
    const templateAreas = gridTemplateAreas(grid, prefix, '\n    ')
    if (templateAreas) {
      css += `\n  grid-template-areas:\n    ${templateAreas};`
    }
  }
  return css
}

export function ie_areaToCSS(area, options) {
  return `@media all and (-ms-high-contrast:none) {\n${ie_areaToCSS_i(area, options)}}`
}

function ie_areaToCSS_i(area, { prefix, repeat }) {
  const { name, grid } = area

  let css = `  .${prefixedName(name, prefix)} {\n`
  if (grid) {
    css += ie_gridToCSS(grid, repeat) + '\n'
  }

  const { gridRegion } = area
  if (gridRegion) {
    const { row, col } = gridRegion
    css += `    -ms-grid-row: ${row.start};\n`
    css += `    -ms-grid-row-span: ${row.end - row.start};\n`
    css += `    -ms-grid-column: ${col.start};\n`
    css += `    -ms-grid-column-span: ${col.end - col.start};\n`
  }

  css += '  }\n'

  if (grid) {
    grid.areas.forEach((area) => {
      css += '\n' + ie_areaToCSS_i(area, { prefix, repeat })
    })
  }

  return css
}

export function ie_gridToCSS(grid, repeat) {
  let css = `    display: -ms-grid;
    -ms-grid-columns: ${namedTemplateColumns(grid, repeat)};
    -ms-grid-rows: ${namedTemplateRows(grid, repeat)};`
  return css
}

function identString(ident) {
  return '  '.repeat(ident)
}

export function areaToHTML(area, { prefix }) {
  return gridToHTML(area.grid, 'grid-container', 0, prefix)
}

function areasToHTML(grid, ident = 0, prefix) {
  let html = ''
  grid.areas.forEach((area) => {
    html += '\n' + identString(ident) + gridToHTML(area.grid, area.name, ident, prefix)
  })
  if (grid.areas.length > 0) {
    html += '\n' + identString(ident - 1) // ident for parent </div>
  }
  return html
}

export function gridToHTML(grid, name, ident, prefix) {
  return `<div class="${prefixedName(name, prefix)}">${grid ? areasToHTML(grid, ident + 1, prefix) : ''}</div>`
}
