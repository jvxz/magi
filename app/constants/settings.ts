import { EventType } from 'matrix-js-sdk'
import * as v from 'valibot'

export const SETTINGS_DEFAULT_TAB: SettingsCategory = 'accessibility'

export const AppearanceSettingsSchema = v.pipe(
  v.object({
    font: v.optional(
      v.union([v.literal('Inter'), v.literal('System')]),
      'System',
    ),
  }),
  v.metadata({
    icon: 'tabler:palette',
    title: 'Appearance',
  }),
)

export const AccessibilitySettingsSchema = v.pipe(
  v.object({
    doAnimations: v.optional(v.boolean(), true as boolean),
    saturationPercent: v.optional(v.number(), 50 as number),
  }),
  v.metadata({
    icon: 'tabler:accessible',
    title: 'Accessibility',
  }),
)

export const EventSettingsSchema = v.pipe(
  v.object({
    toggledEventTypes: v.optional(v.array(EventTypeSchema), [
      EventType.RoomMessage,
      EventType.RoomMember,
    ]),
  }),
  v.metadata({
    icon: 'tabler:calendar-event',
    title: 'Events',
  }),
)

const settingsSchemas = {
  accessibility: AccessibilitySettingsSchema,
  appearance: AppearanceSettingsSchema,
  events: EventSettingsSchema,
} as const

export const SettingsSchema = v.object(settingsSchemas)

export type Settings = {
  [K in SettingsCategory]: v.InferOutput<(typeof settingsSchemas)[K]>
}
export type SettingsCategory = keyof typeof settingsSchemas

export const SETTINGS_CATEGORIES = objectKeys(SettingsSchema.entries)
export const SETTINGS_ENTRIES = mapValues(SettingsSchema.entries, v.getMetadata)
