import * as v from 'valibot'

export const SETTINGS_DEFAULT_TAB: SettingsCategory = 'accessibility'

export const AppearanceSettingsSchema = v.pipe(
  v.object({
    font: v.union([v.literal('Inter'), v.literal('System')]),
  }),
  v.metadata({
    icon: 'tabler:palette',
    title: 'Appearance',
  }),
)

export const AccessibilitySettingsSchema = v.pipe(
  v.object({
    doAnimations: v.boolean(),
    saturationPercent: v.number(),
  }),
  v.metadata({
    icon: 'tabler:accessible',
    title: 'Accessibility',
  }),
)

export const EventSettingsSchema = v.pipe(
  v.object({
    toggledEventTypes: v.array(EventTypeSchema),
  }),
  v.metadata({
    icon: 'tabler:calendar-event',
    title: 'Events',
  }),
)

export const SettingsSchema = v.pipe(
  v.object({
    accessibility: AccessibilitySettingsSchema,
    appearance: AppearanceSettingsSchema,
    events: EventSettingsSchema,
  }),
  v.metadata({
    icon: 'tabler:settings',
    title: 'Settings',
  }),
)

export type Settings = v.InferOutput<typeof SettingsSchema>
export type SettingsCategory = keyof Settings

export const SETTINGS_CATEGORIES = objectKeys(SettingsSchema.entries)
export const SETTINGS_ENTRIES = mapValues(SettingsSchema.entries, v.getMetadata)
