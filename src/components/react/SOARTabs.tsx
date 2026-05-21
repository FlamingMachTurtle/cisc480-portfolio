/**
 * SOARTabs — React island that replaces the always-visible 4-quadrant
 * SOAR grid with a tabbed disclosure.
 *
 * Why: per the v3 audit, every project entry has 4 SOAR paragraphs
 * (Situation / Obstacle / Action / Result) rendered in a 2x2 grid. With
 * 8 projects on the index, that's a lot of vertical real estate. Tabs
 * collapse this to a single panel + a 4-step tab strip, cutting roughly
 * 60% of the vertical footprint per entry while keeping every word
 * available to anyone who clicks (or arrows) through.
 *
 * Editorial constraints (matched to InfoPanel.astro v2):
 *   - No tinted backgrounds, no rounded chrome.
 *   - Tab labels are mono index ("01") + small-caps label ("SITUATION").
 *   - Active tab is darker text + amber underline (the same accent used
 *     for the InfoPanel "Approach" kicker).
 *   - Underline animates between tabs via Framer Motion shared
 *     layout (one motion.span with `layoutId` shared across tabs).
 *
 * Accessibility:
 *   - Proper WAI-ARIA tabs pattern: role="tablist" / "tab" / "tabpanel".
 *   - aria-selected + aria-controls + tabIndex roving (only the active
 *     tab is in the tab order; arrow keys move focus between tabs).
 *   - ArrowLeft / ArrowRight wrap; Home / End jump to first / last.
 *   - Respects prefers-reduced-motion: instant content swap, no spring.
 *
 * Multiple instances per page is the common case (one per project entry).
 * `useId()` keeps each underline's `layoutId` unique so they don't fight
 * for shared layout transitions.
 */

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Props {
	situation: string;
	obstacle: string;
	action: string;
	result: string;
}

const STEPS = [
	{ key: 'situation', index: '01', label: 'Situation' },
	{ key: 'obstacle', index: '02', label: 'Obstacle' },
	{ key: 'action', index: '03', label: 'Action' },
	{ key: 'result', index: '04', label: 'Result' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

export default function SOARTabs(props: Props) {
	const [active, setActive] = useState<StepKey>('situation');
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const prefersReduced = useReducedMotion();
	const layoutPrefix = useId();

	const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
		let nextIdx = idx;
		if (e.key === 'ArrowRight') nextIdx = (idx + 1) % STEPS.length;
		else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + STEPS.length) % STEPS.length;
		else if (e.key === 'Home') nextIdx = 0;
		else if (e.key === 'End') nextIdx = STEPS.length - 1;
		else return;
		e.preventDefault();
		setActive(STEPS[nextIdx].key);
		tabRefs.current[nextIdx]?.focus();
	};

	const activeStep = STEPS.find((s) => s.key === active) ?? STEPS[0];

	return (
		<div className="soar-tabs">
			<div
				className="soar-tabs__tablist"
				role="tablist"
				aria-label="Approach: situation, obstacle, action, result"
			>
				{STEPS.map((step, idx) => {
					const isActive = active === step.key;
					return (
						<button
							key={step.key}
							ref={(el) => {
								tabRefs.current[idx] = el;
							}}
							role="tab"
							id={`soar-tab-${layoutPrefix}-${step.key}`}
							aria-selected={isActive}
							aria-controls={`soar-panel-${layoutPrefix}-${step.key}`}
							tabIndex={isActive ? 0 : -1}
							onClick={() => setActive(step.key)}
							onKeyDown={(e) => onKeyDown(e, idx)}
							className={`soar-tab${isActive ? ' soar-tab--active' : ''}`}
						>
							<span className="soar-tab__index mono">{step.index}</span>
							<span className="soar-tab__label">{step.label}</span>
							{isActive && (
								<motion.span
									className="soar-tab__rule"
									layoutId={`soar-rule-${layoutPrefix}`}
									transition={
										prefersReduced
											? { duration: 0 }
											: { type: 'spring', stiffness: 380, damping: 32 }
									}
									aria-hidden="true"
								/>
							)}
						</button>
					);
				})}
			</div>

			<div className="soar-tabs__panel">
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={active}
						id={`soar-panel-${layoutPrefix}-${active}`}
						role="tabpanel"
						aria-labelledby={`soar-tab-${layoutPrefix}-${active}`}
						initial={prefersReduced ? false : { opacity: 0, y: 4 }}
						animate={prefersReduced ? false : { opacity: 1, y: 0 }}
						exit={prefersReduced ? undefined : { opacity: 0, y: -4 }}
						transition={
							prefersReduced
								? { duration: 0 }
								: { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
						}
						className="soar-tabs__panel-inner"
					>
						<p>{props[activeStep.key]}</p>
					</motion.div>
				</AnimatePresence>
			</div>

			<style>{`
				.soar-tabs {
					display: flex;
					flex-direction: column;
					gap: var(--space-md);
				}

				.soar-tabs__tablist {
					display: flex;
					flex-wrap: wrap;
					gap: var(--space-md) var(--space-lg);
					border-bottom: 1px solid var(--color-border);
					padding-bottom: 0;
				}

				.soar-tab {
					position: relative;
					background: none;
					border: 0;
					padding: var(--space-2xs) var(--space-2xs) calc(var(--space-xs) + 2px);
					margin: 0;
					display: inline-flex;
					align-items: baseline;
					gap: var(--space-2xs);
					color: var(--color-text-subtle);
					cursor: pointer;
					font: inherit;
					border-radius: var(--radius-sm) var(--radius-sm) 0 0;
					transition: color 0.2s ease, background-color 0.2s ease;
					-webkit-tap-highlight-color: transparent;
				}
				.soar-tab:hover {
					color: var(--color-text);
					background: var(--color-surface);
				}
				.soar-tab:focus-visible {
					outline: 2px solid var(--color-accent);
					outline-offset: 4px;
					border-radius: 2px;
				}
				/* Subtle hover hairline below inactive tabs — preview of
				   the active state so users know these are clickable. */
				.soar-tab:not(.soar-tab--active):hover::after {
					content: '';
					position: absolute;
					left: var(--space-2xs);
					right: var(--space-2xs);
					bottom: -1px;
					height: 1px;
					background: var(--color-border-strong);
				}

				.soar-tab__index {
					font-size: var(--fs-2xs);
					font-weight: 500;
					font-feature-settings: "tnum" on, "ss03" on;
					color: var(--color-text-subtle);
					letter-spacing: 0.04em;
					transition: color 0.2s ease;
				}
				.soar-tab__label {
					font-size: var(--fs-2xs);
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: var(--tracking-caps);
				}

				.soar-tab--active { color: var(--color-text); }
				.soar-tab--active .soar-tab__index { color: var(--color-accent); }

				.soar-tab__rule {
					position: absolute;
					left: 0;
					right: 0;
					bottom: -1px;
					height: 2px;
					background: var(--color-accent);
					display: block;
				}

				.soar-tabs__panel {
					min-height: 4.5rem;
					position: relative;
				}
				.soar-tabs__panel-inner p {
					margin: 0;
					font-size: var(--fs-base);
					line-height: var(--lh-base);
					color: var(--color-text);
				}

				@media (max-width: 640px) {
					.soar-tabs__tablist {
						gap: var(--space-sm) var(--space-md);
					}
				}
			`}</style>
		</div>
	);
}
