export const COLOR_MODES = ['dark'] as const
export const DEFAULT_COLOR_MODE: ColorMode = 'dark'
export type ColorMode = (typeof COLOR_MODES)[number]
