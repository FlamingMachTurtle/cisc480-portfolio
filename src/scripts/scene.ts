/**
 * scene.ts — vanilla GSAP layer that complements Astro's <ClientRouter />
 * shared-element view transitions. See redesign/animation-options.md.
 *
 * Responsibilities:
 *   1. Lift body content on each page enter (subtle 24px translateY +
 *      stagger). The HeroScene is excluded — view transitions handle it.
 *   2. Apply a small parallax to the hero background image as the user
 *      scrolls past it. Gives the cinematic "moving through a scene"
 *      feel without being heavy.
 *   3. Re-bind everything on every `astro:page-load` so it survives
 *      view-transition navigations, and tear down scroll listeners on
 *      `astro:before-swap` to avoid leaks.
 *   4. Respect prefers-reduced-motion: skip everything.
 */
import gsap from 'gsap';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let scrollCleanup: (() => void) | null = null;

function bindScene() {
	// Body content lift — only enabled when motion is allowed.
	if (!REDUCED_MOTION) {
		const body = document.querySelectorAll('main > :not(.hero-scene)');
		if (body.length > 0) {
			gsap.from(body, {
				y: 18,
				autoAlpha: 0,
				duration: 0.5,
				ease: 'power2.out',
				stagger: 0.06,
				clearProps: 'all',
			});
		}
	}

	// Hero parallax — bg image scales + translates with scroll.
	const heroBg = document.querySelector<HTMLElement>('.hero-scene__bg');
	if (heroBg && !REDUCED_MOTION) {
		let raf = 0;
		const apply = () => {
			raf = 0;
			const y = window.scrollY;
			const ease = Math.min(y / 600, 1);
			gsap.to(heroBg, {
				scale: 1 + ease * 0.06,
				y: y * 0.18,
				duration: 0.6,
				ease: 'power1.out',
				overwrite: 'auto',
			});
		};
		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(apply);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		scrollCleanup = () => {
			window.removeEventListener('scroll', onScroll);
			if (raf) cancelAnimationFrame(raf);
			scrollCleanup = null;
		};
	}
}

function teardown() {
	if (scrollCleanup) scrollCleanup();
}

document.addEventListener('astro:page-load', bindScene);
document.addEventListener('astro:before-swap', teardown);

if (document.readyState !== 'loading') bindScene();
else document.addEventListener('DOMContentLoaded', bindScene, { once: true });
