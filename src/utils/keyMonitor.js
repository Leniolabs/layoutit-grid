import {
  addCol,
  addRow,
  canRedo,
  canUndo,
  currentArea,
  deselectCurrentArea,
  mainArea,
  redo,
  removeArea,
  restart,
  subGrid,
  undo,
} from '../store'

function ctrlMetaKeyHandler(event) {
  if (!event.shiftKey) {
    return
  }
  const key = event.key.toLowerCase()
  switch (key) {
    case 'z':
      if (canUndo) {
        event.preventDefault()
        undo()
      }
      break
    case 'y':
      if (canRedo) {
        event.preventDefault()
        redo()
      }
      break
  }
}

function keyHandler(event) {
  switch (event.key.toLowerCase()) {
    case 'backspace':
    case 'delete':
      if (currentArea.value !== mainArea.value) {
        removeArea(currentArea.value)
      }
      break
    case 'g':
      if (event.shiftKey && currentArea.value !== mainArea.value) {
        subGrid(currentArea.value)
      }
      break
    case 'r':
      if (event.shiftKey && currentArea?.value?.grid) {
        addRow(currentArea.value.grid, '1fr')
      }
      break
    case 'c':
      if (event.shiftKey && currentArea?.value?.grid) {
        addCol(currentArea.value.grid, '1fr')
      }
      break
    case 'escape':
      if (currentArea.value !== mainArea.value) {
        deselectCurrentArea()
      }
      break
  }
}

export function keyMonitor(event) {
  if ((event.target.nodeName === 'INPUT' || event.target.nodeName === 'SPAN') && event.key !== 'Escape') return
  else if (event.ctrlKey || event.metaKey) ctrlMetaKeyHandler(event)
  else keyHandler(event)
}
