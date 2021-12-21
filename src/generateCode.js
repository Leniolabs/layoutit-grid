import { getGridRegion } from './store.js'
import {
  toCssName,
  gridTemplateAreas,
  namedTemplateColumns,
  namedTemplateRows,
  getCodeGridArea,
  areaIsSingleLineInCSS,
  includeAreaInCSS,
  getElementTag,
} from './utils.js'

function declaration(name, value, def) {
  return value !== def ? `\n  ${name}: ${value};` : ''
}

export function areaToCSS(area, { parentGrid, templateAreas = true, repeat, oldSpec }) {
  const { name, grid } = area
  const singleLine = areaIsSingleLineInCSS(area)
  const cssName = toCssName(name)
  let css = `.${cssName} {`
  if (grid) {
    css += gridToCSS(area, { templateAreas, repeat })
  }

  if (area.parent && area.parent.display === 'grid') {
    css += declaration('justify-self', area.justifySelf, 'initial')
    css += declaration('align-self', area.alignSelf, 'initial')
    if (area.gridArea !== 'auto') {
      css += `${singleLine ? ' ' : '\n  '}grid-area: ${getCodeGridArea(area, templateAreas)};`
    }
  }

  if (!(!area.parent && area.width === 'auto' && area.height === 'auto')) {
    css += declaration('width', area.width, 'auto')
    css += declaration('height', area.height, 'auto')
  }
  css += declaration('margin', area.margin, '0')
  css += declaration('padding', area.padding, '0')

  css += `${singleLine ? ' ' : '\n'}}\n`

  if (grid) {
    area.children.forEach((area) => {
      if (includeAreaInCSS(area)) {
        css += '\n' + areaToCSS(area, { parentGrid: grid, templateAreas, repeat })
      }
    })
  }

  if (oldSpec) {
    css += '\n' + ie_areaToCSS(area, { repeat })
  }

  return css
}

export function gridToCSS(area, { templateAreas = true, repeat }) {
  const { grid } = area
  let css = `  display: grid;`
  if (grid.col.sizes.length) {
    css += `\n  grid-template-columns: ${namedTemplateColumns(grid, repeat)};`
  }
  if (grid.row.sizes.length) {
    css += `\n  grid-template-rows: ${namedTemplateRows(grid, repeat)};`
  }
  if (grid.col.auto.length) {
    css += `\n  grid-auto-columns: ${grid.col.auto.join(' ')};`
  }
  if (grid.row.auto.length) {
    css += `\n  grid-auto-rows: ${grid.row.auto.join(' ')};`
  }
  css += `\n  gap: ${grid.row.gap} ${grid.col.gap};` // TODO: cssGridGap(grid)

  css += declaration('grid-auto-flow', grid.autoFlow, 'initial')
  css += declaration('justify-content', grid.justifyContent, 'initial')
  css += declaration('align-content', grid.alignContent, 'initial')
  css += declaration('justify-items', grid.justifyItems, 'initial')
  css += declaration('align-items', grid.alignItems, 'initial')
  if (templateAreas) {
    const templateAreasCode = gridTemplateAreas(area, '\n    ')
    if (templateAreasCode) {
      css += `\n  grid-template-areas:\n    ${templateAreasCode};`
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

  const gridRegion = getGridRegion(area)
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
  const tag = getElementTag(area)
  return `<${tag} ${includeAreaInCSS(area) ? `class="${toCssName(area.name)}"` : ''}>${areasToHTML(
    area,
    ident + 1
  )}</${tag}>`
}

export function presentationCSS(area) {
  const cssName = toCssName(area.name)
  const needsHeight = area.height === 'auto'
  return `html, body ${needsHeight ? `, .${cssName} ` : ''}{
  height: 100%;
  margin: 0;
}

/* For presentation only, no need to copy the code below */

.${cssName} * {
  border: 1px solid red;
  position: relative;
}

.${cssName} *:after {
  content:attr(class);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
}
`
}

export function areaToIndexCSS(area, options) {
  return `${areaToCSS(area, options)}

${presentationCSS(area)}
`
}
