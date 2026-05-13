// @unocss-include
import type { VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
  base: 'relative inline-flex items-center justify-center',
  defaultVariants: {
    size: 'default',
    variant: 'soft',
  },
  extend: interactiveBase,
})

export type ButtonVariants = VariantProps<typeof buttonVariants>

export const badgeVariants = tv({
  base: 'inline-flex w-fit shrink-0 cursor-default items-center justify-center tracking-wide select-none',
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  extend: interactiveBase,
  variants: {
    size: {
      default: 'px-2 py-0.5 text-xs',
      lg: 'px-2.5 py-1 text-sm',
      sm: 'px-1.5 py-px text-2xs',
    },
  },
})

export const avatarVariants = tv({
  base: 'inline-flex shrink-0 items-center justify-center overflow-hidden bg-secondary font-normal text-foreground select-none',
  variants: {
    shape: {
      circle: 'rounded-full',
      square: 'rounded-md',
    },
    size: {
      base: 'h-16 w-16 text-2xl',
      lg: 'h-32 w-32 text-5xl',
      sm: 'h-10 w-10 text-xs',
    },
  },
})

export type AvatarVariants = VariantProps<typeof avatarVariants>

export const alertVariants = tv({
  base: 'relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 py-3 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-1 [&>svg]:text-foreground',
  defaultVariants: {
    variant: 'default',
  },
  extend: staticBase,
  variants: {
    variant: {
      danger: staticBase({ class: 'bg-danger/40 text-danger-foreground' }),
    },
  },
})

export type AlertVariants = VariantProps<typeof alertVariants>

export const toggleVariants = tv({
  base: 'p-0',
  defaultVariants: {
    size: 'default',
    variant: 'ghost',
  },
  extend: interactiveBase,
  variants: {
    variant: {
      accent: interactiveBase({
        class: 'data-[state=off]:hover:not-active:bg-muted/50 data-[state=off]:hover:not-active:text-foreground data-[state=off]:active:bg-muted/75 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        variant: 'ghost',
      }),
      ghost: interactiveBase({
        class: 'data-[state=off]:hover:not-active:bg-muted/50 data-[state=off]:hover:not-active:text-foreground data-[state=off]:active:bg-muted/75 data-[state=on]:bg-muted data-[state=on]:text-foreground',
        variant: 'ghost',
      }),
      outline: interactiveBase({
        class: 'data-[state=on]:bg-muted data-[state=on]:border-primary/30 m-0',
        variant: 'outline',
      }),
    },
  },
})

export type ToggleVariants = VariantProps<typeof toggleVariants>
