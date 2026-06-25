export const useAppHeaderLabel = createGlobalState(() => {
  const label = shallowRef('Magi')

  const setAppHeaderLabel = (newLabel: string | undefined) => {
    if (newLabel) label.value = newLabel
  }

  return {
    label,
    setAppHeaderLabel,
  }
})
