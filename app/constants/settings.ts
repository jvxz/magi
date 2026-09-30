import type { PublicRuntimeConfig } from 'nuxt/schema'

import {
  ICON__ACCESSIBILITY,
  ICON__ADVANCED,
  ICON__APPEARANCE,
  ICON__DEVICE,
  ICON__MESSAGE,
  ICON__SETTINGS,
} from './icon'

export interface Settings {
  appearance: {
    font: 'Inter' | 'System'
    palette: PublicRuntimeConfig['colorModes'][number]
  }
  accessibility: {
    uiAnimations: boolean
  }
  advanced: {
    resync: undefined
    developerMode: boolean
  }
  messaging: {
    typingEvents: boolean
  }
  devices: object
  general: object
}

export type SettingsCategory = (typeof SETTINGS__CATEGORIES)[number]

export type SettingsCategoryValue<T extends SettingsCategory> = Settings[T]

export const SETTINGS__CATEGORIES = [
  'general',
  'appearance',
  'messaging',
  'devices',
  'accessibility',
  'advanced',
] as const

export const SETTINGS__CATEGORY_METADATA: SettingsCategoryMetadata = {
  accessibility: {
    icon: ICON__ACCESSIBILITY,
    key: 'accessibility',
    title: 'Accessibility',
  },
  advanced: {
    icon: ICON__ADVANCED,
    key: 'advanced',
    title: 'Advanced',
  },
  appearance: {
    icon: ICON__APPEARANCE,
    key: 'appearance',
    title: 'Appearance',
  },
  devices: {
    icon: ICON__DEVICE,
    key: 'devices',
    title: 'Devices',
  },
  general: {
    icon: ICON__SETTINGS,
    key: 'general',
    title: 'General',
  },
  messaging: {
    icon: ICON__MESSAGE,
    key: 'messaging',
    title: 'Messaging',
  },
}

export const SETTINGS__DEFAULT_TAB: SettingsCategory = 'accessibility'

export const SETTINGS__DEFAULTS: EnforcedSettingsKeys<Settings> = {
  accessibility: {
    uiAnimations: true,
  },
  advanced: {
    developerMode: false,
    resync: undefined,
  },
  appearance: {
    font: 'System',
    palette: 'default',
  },
  devices: {},
  general: {},
  messaging: {
    typingEvents: true,
  },
}

export const SETTINGS__ITEM_METADATA: SettingsItemMetadata = {
  accessibility: {
    uiAnimations: {
      description: 'Whether to enable animations in the app',
      options: [true, false],
      title: 'UI animations',
    },
  },
  advanced: {
    developerMode: {
      description: 'Enable developer mode',
      title: 'Developer mode',
    },
    resync: {
      description:
        'Delete all cached data in Magi and fetch fresh data from the homeserver. This may fix some issues if you are having issues with state in the app.',
      title: 'Re-sync Magi',
    },
  },
  appearance: {
    font: {
      description: 'The font to use in the app',
      options: ['Inter', 'System'],
      title: 'Font',
    },
    palette: {
      description: 'Color palette of the app',
      title: 'Color palette',
    },
  },
  devices: {},
  general: {},
  messaging: {
    typingEvents: {
      description: 'Share your typing status with the current room',
      title: 'Emit typing status',
    },
  },
}

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
