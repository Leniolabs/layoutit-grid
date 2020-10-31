const colors = [
  'rgba(230, 25, 75, 0.8)',
  'rgba(60, 180, 75, 0.8)',
  'rgba(245, 130, 48, 0.8)',
  'rgba(240, 50, 230, 0.8)',
  'rgba(0, 128, 128, 0.8)',
]

export function createAreaState({
  name = 'area',
  color = colors[0],
  type = 'div',
  display = 'block',
  grid = null,
  flex = null,
  gridRegion = null,
  width = '100%',
  height = '100%',
  margin = '0',
  padding = '0',
  justifySelf = 'stretch',
  alignSelf = 'stretch',
  flexGrow = 0,
  flexShrink = 1,
  flexBasis = '100%',
  text = '',
  items = null,
  children = [],
  parent = null,
}) {
  return {
    name,
    color,
    type,
    display,
    grid,
    flex,
    gridRegion,
    width,
    height,
    margin,
    padding,
    justifySelf,
    alignSelf,
    flexGrow,
    flexShrink,
    flexBasis,
    text,
    items,
    children,
    parent,
  }
}

export function parentify(area, parent = null) {
  area.parent = parent
  area.children.forEach((child) => parentify(child, area))
  return area
}

const parentRemover = (key, value) => (key === 'parent' ? null : value)

export function serializeArea(area) {
  return JSON.stringify({ area: area, version: 1 }, parentRemover)
}
export function parseArea(area) {
  return parentify(JSON.parse(area).area)
}

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getAreaDepth(area) {
  const parent = area.parent
  if (parent) {
    return getAreaDepth(parent) + 1
  } else {
    return 0
  }
}
