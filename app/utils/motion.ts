import type { MotionProps } from "motion-v"

export const motionSlideFromTop: MotionProps = {
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  initial: { opacity: 0, y: 20 },
  transition: { duration: 0.15, ease: 'easeOut' },
}
