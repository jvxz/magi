/**
 * @returns boolean depicting if component is currently alive. Useful for components wrapped in <KeepAlive/ >
 */
export function useAlive() {
  const isAlive = shallowRef(true)

  onActivated(() => isAlive.value = true)
  onDeactivated(() => isAlive.value = false)

  return isAlive
}
