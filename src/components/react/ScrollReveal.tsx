/**
 * ScrollReveal — wraps any block of content and fades it up into
 * place when 20% of it crosses into the viewport. Once revealed, it
 * stays revealed (animation runs once per element).
 *
 * Used to make project entries and major home sections feel like
 * they "develop" as you scroll, without leaning on tinted card
 * chrome to mark them as units. The animation is intentionally
 * subtle: 16px upward translate, opacity 0 → 1, 600ms ease-out.
 *
 * React island, hydrated with `client:visible` so it only runs when
 * the wrapped content is approaching the viewport. Anything off-
 * screen at first paint stays opaque-via-CSS-fallback so the page
 * remains readable if JS fails or is delayed.
 *
 * Reduced-motion: framer-motion respects prefers-reduced-motion via
 * `useReducedMotion()`, falling back to a no-op render of children.
 */
import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
	children: ReactNode;
	/** Render element. Defaults to a plain div. */
	as?: 'div' | 'section' | 'article' | 'aside';
	/**
	 * Additional CSS classes to forward to the wrapper. Useful when
	 * the reveal needs to honour a layout class on the consumer side.
	 */
	className?: string;
	/** Delay (in seconds) before the reveal starts. Default 0. */
	delay?: number;
	/** Translate distance in px. Default 16. */
	distance?: number;
	/** Reveal duration in seconds. Default 0.6. */
	duration?: number;
	/** % of element that must be in view before triggering. Default 0.2. */
	amount?: number;
}

export default function ScrollReveal({
	children,
	as: Tag = 'div',
	className,
	delay = 0,
	distance = 16,
	duration = 0.6,
	amount = 0.2,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const inView = useInView(ref, { once: true, amount });
	const prefersReduced = useReducedMotion();

	// If the user prefers reduced motion, just render children with
	// no animation — and no wrapper transform that could shift layout.
	if (prefersReduced) {
		const Static = Tag as keyof JSX.IntrinsicElements;
		return <Static className={className}>{children}</Static>;
	}

	const MotionTag = motion[Tag] as typeof motion.div;

	return (
		<MotionTag
			ref={ref}
			className={className}
			initial={{ opacity: 0, y: distance }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
			transition={{
				duration,
				delay,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			{children}
		</MotionTag>
	);
}
