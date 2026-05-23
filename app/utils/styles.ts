// @unocss-include
export const interactiveBase = tv({
  base: 'font-medium cursor-pointer focus-visible:border-primary/50 select-none focus-visible:ring-ring/40 focus-visible:ring-[3px] active:ring-ring/60 aria-invalid:ring-danger/20 aria-invalid:border-danger dark:aria-invalid:ring-danger/40 shrink-0 gap-2 rounded text-base whitespace-nowrap font-medium outline-none disabled:pointer-events-none hover:disabled:cursor-not-allowed disabled:opacity-50 underline-offset-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 transition-transform duration-75',
  variants: {
    size: {
      default: 'h-8 px-2.5 py-0.75 text-sm',
      icon: 'aspect-square size-8',
      lg: 'h-10 px-5 text-base text-base',
      sm: 'h-7 px-2.5 py-1 text-xs',
    },
    variant: {
      danger:
        'hover:bg-danger/90 bg-danger/90 text-danger-foreground hover:bg-danger active:bg-danger/87.5 border-danger',
      default: 'bg-primary/85 border border-primary active:bg-primary/80 text-primary-foreground',
      ghost: 'hover:bg-muted/50 hover:text-foreground active:bg-muted/75 text-muted-foreground active:text-foreground',
      link: 'text-foreground px-2.5 -mx-2.5 underline-offset-4 hover:underline',
      outline:
        'border-border/90 hover:bg-muted/90 active:bg-muted/75 hover:border-border active:border-border border bg-transparent',
      soft: 'border-border/90 text-muted-foreground hover:text-foreground hover:bg-muted/75 active:bg-muted/90 hover:border-border active:border-border border bg-input',
    },
  },
})

export const staticBase = tv({
  base: 'rounded p-6 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      danger: 'bg-card-light border-danger border [&>svg]:text-current',
      default: 'bg-card-light border border-border text-card-foreground',
    },
  },
})

export const popoverContentBase = tv({
  base: 'shadow-lg z-50 w-52 overflow-hidden p-1',
  defaultVariants: {
    variant: 'default',
  },
  extend: staticBase,
})

export const popoverItemBase = tv({
  base: 'duration-0 relative flex cursor-default items-center p-1 px-2 text-sm outline-hidden transition-all select-none focus-visible:ring-0 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  defaultVariants: {
    size: 'default',
    variant: 'ghost',
  },
  extend: interactiveBase,
  variants: {
    variant: {
      ghost: 'text-foreground',
    },
  },
})

export const overlayStyles =
  'duration-75 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-overlay'

export const inputStyles = tv({
  base: [
    staticBase({ variant: 'default' }),
    interactiveBase({ size: 'default' }),
    'flex w-full min-w-0 cursor-text truncate py-1 selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:ring-3 text-sm',
  ],
})
