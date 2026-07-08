export const SETTINGS_CATEGORIES = ['appearance', 'accessibility', 'advanced'] as const
export const SETTINGS_DEFAULT_TAB: SettingsCategory = 'accessibility'

export interface Settings {
  appearance: {
    font: 'Inter' | 'System'
  }
  accessibility: {
    uiAnimations: boolean
  }
  advanced: {
    resync: undefined
  }
}

export const DEFAULT_SETTINGS: EnforcedSettingsKeys<Settings> = {
  accessibility: {
    uiAnimations: true,
  },
  appearance: {
    font: 'System',
  },
  advanced: {
    resync: undefined,
  },
}

export const SETTINGS_CATEGORY_METADATA: SettingsCategoryMetadata = {
  accessibility: {
    icon: 'tabler:accessible',
    key: 'accessibility',
    title: 'Accessibility',
  },
  appearance: {
    icon: 'tabler:palette',
    key: 'appearance',
    title: 'Appearance',
  },
  advanced: {
    icon: 'tabler:code-circle',
    title: 'Advanced',
    key: 'advanced',
  },
}
export const SETTINGS_ITEM_METADATA: SettingsItemMetadata = {
  accessibility: {
    uiAnimations: {
      description: 'Whether to enable animations in the app',
      options: [true, false],
      title: 'UI animations',
    },
  },
  appearance: {
    font: {
      description: 'The font to use in the app',
      options: ['Inter', 'System'],
      title: 'Font',
    },
  },
  advanced: {
    resync: {
      title: 'Re-sync Magi',
      description:
        'Delete all cached data in Magi and fetch fresh data from the homeserver. This may fix some issues if you are having issues with state in the app.',
    },
  },
}

export type SettingsCategory = (typeof SETTINGS_CATEGORIES)[number]
export type SettingsCategoryValue<T extends SettingsCategory> = Settings[T]

type EnforcedSettingsKeys<T extends Record<string, any>> = {
  [K in keyof T]: K extends SettingsCategory ? T[K] : never
}

interface SettingsMetadataItem<T> {
  title: string
  description: string
  options?: T[]
}

type SettingsCategoryMetadata = {
  [K in SettingsCategory]: {
    title: string
    icon: string
    key: K
  }
}

type SettingsItemMetadata = {
  [K in SettingsCategory]: {
    [T in keyof SettingsCategoryValue<K>]: SettingsMetadataItem<SettingsCategoryValue<K>[T]>
  }
}
