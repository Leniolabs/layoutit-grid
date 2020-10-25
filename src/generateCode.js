import { getGridArea, toCssName, gridTemplateAreas, namedTemplateColumns, namedTemplateRows } from './utils.js'

export function areaToCSS(area, { parentGrid, useTemplateAreas = true, validTemplateAreas = true, repeat, oldSpec }) {
  const { name, grid } = area
  const singleLine = grid == null
  const cssName = toCssName(name)
  let css = `.${cssName} {${singleLine ? '' : '\n'}`
  if (grid) {
    css += gridToCSS(area, { useTemplateAreas, repeat })
  }

  const gridArea = getGridArea(area, parentGrid)
  if (gridArea) {
    css += `${singleLine ? ' ' : '\n  '}grid-area: ${useTemplateAreas && validTemplateAreas ? cssName : gridArea};`
  }
  css += `${singleLine ? ' ' : '\n'}}\n`

  if (grid) {
    const validTemplateAreas = gridTemplateAreas(area) !== undefined
    area.children.forEach((area) => {
      css += '\n' + areaToCSS(area, { parentGrid: grid, useTemplateAreas, validTemplateAreas, repeat })
    })
  }

  if (oldSpec) {
    css += '\n' + ie_areaToCSS(area, { repeat })
  }

  return css
}

export function gridToCSS(area, { useTemplateAreas = true, repeat }) {
  const { grid } = area
  let css = `  display: grid;
  grid-template-columns: ${namedTemplateColumns(grid, repeat)};
  grid-template-rows: ${namedTemplateRows(grid, repeat)};
  gap: ${grid.row.gap} ${grid.col.gap};` // TODO: cssGridGap(grid)

  if (useTemplateAreas) {
    const templateAreas = gridTemplateAreas(area, '\n    ')
    if (templateAreas) {
      css += `\n  grid-template-areas:\n    ${templateAreas};`
    }
  }
  return css
}

export function ie_areaToCSS(area, options) {
  return `@media all and (-ms-high-contrast:none) {\n${ie_areaToCSS_i(area, options)}}`
}

function ie_areaToCSS_i(area, { repeat }) {
  const { name, grid } = area

  let css = `  .${toCssName(name)} {\n`
  if (grid) {
    css += ie_gridToCSS(area, repeat) + '\n'
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
    area.children.forEach((area) => {
      css += '\n' + ie_areaToCSS_i(area, { repeat })
    })
  }

  return css
}

export function ie_gridToCSS(area, repeat) {
  let css = `    display: -ms-grid;
    -ms-grid-columns: ${namedTemplateColumns(area.grid, repeat)};
    -ms-grid-rows: ${namedTemplateRows(area.grid, repeat)};`
  return css
}

export function identString(ident) {
  return '  '.repeat(ident)
}

function areasToHTML(area, ident = 0) {
  let html = ''
  area.children.forEach((child) => {
    html += '\n' + identString(ident) + areaToHTML(child, ident)
  })
  if (area.children.length > 0) {
    html += '\n' + identString(ident - 1) // ident for parent </div>
  }
  return html
}

export function areaToHTML(area, ident = 0) {
  return `<div class="${toCssName(area.name)}">${areasToHTML(area, ident + 1)}</div>`
}
