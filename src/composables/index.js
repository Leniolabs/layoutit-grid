import { useDebounceFn } from '@vueuse/core'

export function debounce(fn, ms = 400) {
  return useDebounceFn(fn, ms)
}

export function inputSetter(update, validate = () => true, valueFrom = (value) => value) {
  return debounce((source) => {
    const value = valueFrom(source)
    if (validate(value)) {
      update(value)
    }
  })
}

export function useInputSetter(target, validate = () => true, valueFrom = (value) => value) {
  return inputSetter((value) => (target.value = value), validate, valueFrom)
}
