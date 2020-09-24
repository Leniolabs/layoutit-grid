import { ref, computed, watch } from 'vue'

export function useRefHistory(
  current = ref(null),
  { capacity = 100, serialize = JSON.stringify, parse = JSON.parse, restore = (value) => (current.value = value) }
) {
  const history = ref([serialize(current.value)])
  const position = ref(0)

  const canUndo = computed(() => position.value > 0)
  const canRedo = computed(() => history.value.length - 1 - position.value > 0)

  function actualValue() {
    return parse(history.value[position.value])
  }

  function undo() {
    if (canUndo.value) {
      position.value--
      restore(actualValue())
    }
  }
  function redo() {
    if (canRedo.value) {
      position.value++
      restore(actualValue())
    }
  }

  const atomicChange = ref(0)
  function startAtomicChange() {
    atomicChange.value++
  }
  function endAtomicChange() {
    atomicChange.value--
  }

  function updateHistory(newValue) {
    const str = serialize(newValue)
    if (history.value[position.value] === str) {
      return
    }
    if (canRedo.value) {
      history.value.splice(position.value + 1)
    }

    if (history.value.length > capacity) {
      history.value.shift()
      position.value--
    }

    history.value.push(str)
    position.value++
  }

  watch(
    current,
    (newValue) => {
      if (atomicChange.value > 0) {
        return
      }
      updateHistory(newValue)
    },
    {
      deep: true,
    }
  )
  watch(atomicChange, (value) => {
    if (value === 0) {
      updateHistory(current.value)
    }
  })

  function clear() {
    history.value = [serialize(current.value)]
    position.value = 0
  }

  return { undo, redo, canUndo, canRedo, clear, startAtomicChange, endAtomicChange, current }
}
