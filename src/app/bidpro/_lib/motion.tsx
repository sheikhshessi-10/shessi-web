"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  useEffect,
  useRef,
  type ComponentType,
  type ReactNode,
} from "react";

type MotionTagProps = Record<string, unknown> & { children?: ReactNode };

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export const VIEWPORT = { once: true, amount: 0.2, margin: "-80px" } as const;

export function fadeUp(reduce: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE },
    },
  };
}

export function staggerContainer(reduce: boolean | null): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduce ? 0 : 0.08,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };
}

export function staggerItem(reduce: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };
}

/** Single fade-up element revealed once on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "span" | "li";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as unknown as ComponentType<MotionTagProps>;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: EASE, delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/** Wrapper that staggers its direct <StaggerItem> children. */
export function Stagger({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as unknown as ComponentType<MotionTagProps>;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerContainer(reduce)}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as unknown as ComponentType<MotionTagProps>;
  return (
    <MotionTag className={className} variants={staggerItem(reduce)}>
      {children}
    </MotionTag>
  );
}

/** Counts from 0 to `value` when scrolled into view. Renders inside a <span>. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  const text = useTransform(spring, (latest) => {
    const n = decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
    return `${prefix}${formatThousands(n)}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, value, duration, reduce, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

function formatThousands(numStr: string) {
  const [intPart, dec] = numStr.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withCommas}.${dec}` : withCommas;
}
