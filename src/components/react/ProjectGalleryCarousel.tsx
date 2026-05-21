/**
 * ProjectGalleryCarousel — embla-based slide carousel for project
 * galleries that have multiple images. Replaces the static grid for
 * any project entry where the count of figures > 2.
 *
 * Editorial constraints (per redesign/audit/interactions-research.md):
 *   - No fade-in slide animations (carousels with fade can feel
 *     gimmicky); use a normal x-translate scroll with snap.
 *   - Prev/next controls are outlined-only mono-glyph buttons —
 *     same chrome budget as the rest of the site (no filled circles,
 *     no shadow piles).
 *   - Dot pagination uses --color-text-subtle for inactive,
 *     --color-accent for active.
 *   - Keyboard navigable: ArrowLeft / ArrowRight on the carousel.
 *   - Swipeable on touch.
 *   - prefers-reduced-motion: snap remains, but transition duration
 *     drops to ~0ms so each slide jump is instant.
 */
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface GalleryItem {
	src: string;
	alt: string;
	cap: string;
}

interface Props {
	items: GalleryItem[];
	/** Editorial number, e.g. "04". Rendered as the kicker prefix. */
	indexLabel?: string;
	heading: string;
	caption: string;
}

export default function ProjectGalleryCarousel({ items, indexLabel, heading, caption }: Props) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		align: 'start',
		slidesToScroll: 1,
		containScroll: 'trimSnaps',
	});
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
	const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
			setCanScrollPrev(emblaApi.canScrollPrev());
			setCanScrollNext(emblaApi.canScrollNext());
		};

		setScrollSnaps(emblaApi.scrollSnapList());
		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);
		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi]);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				scrollPrev();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				scrollNext();
			}
		},
		[scrollPrev, scrollNext],
	);

	return (
		<section
			className="pgc"
			aria-roledescription="carousel"
			aria-label={`${heading} gallery`}
			tabIndex={0}
			onKeyDown={onKeyDown}
		>
			<header className="pgc__head">
				{indexLabel && (
					<>
						<span className="pgc__index mono">{indexLabel}</span>
						<span className="pgc__sep" aria-hidden="true">/</span>
					</>
				)}
				<span className="pgc__title">{heading}</span>
				<span className="pgc__caption">{caption}</span>
				<div className="pgc__controls" role="group" aria-label="Gallery controls">
					<button
						type="button"
						className="pgc__btn"
						aria-label="Previous slide"
						onClick={scrollPrev}
						disabled={!canScrollPrev}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<polyline points="15 18 9 12 15 6"></polyline>
						</svg>
					</button>
					<button
						type="button"
						className="pgc__btn"
						aria-label="Next slide"
						onClick={scrollNext}
						disabled={!canScrollNext}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</button>
				</div>
			</header>

			<div className="pgc__viewport" ref={emblaRef}>
				<div className="pgc__container">
					{items.map((item, i) => (
						<figure
							key={item.src}
							className="pgc__slide"
							role="group"
							aria-roledescription="slide"
							aria-label={`${i + 1} of ${items.length}`}
							aria-hidden={selectedIndex !== i ? 'true' : 'false'}
						>
							<img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
							<figcaption>{item.cap}</figcaption>
						</figure>
					))}
				</div>
			</div>

			<div className="pgc__dots" role="tablist" aria-label="Slide pagination">
				{scrollSnaps.map((_, i) => (
					<button
						key={i}
						type="button"
						role="tab"
						aria-label={`Go to slide ${i + 1}`}
						aria-selected={selectedIndex === i}
						onClick={() => scrollTo(i)}
						className={`pgc__dot ${selectedIndex === i ? 'is-active' : ''}`}
					/>
				))}
			</div>

			<style>{`
				.pgc {
					margin-top: var(--space-xl);
					padding-top: var(--space-md);
					border-top: 1px solid var(--color-border);
					outline: none;
				}
				.pgc:focus-visible {
					box-shadow: 0 0 0 2px var(--color-focus);
					border-radius: var(--radius-sm);
				}
				.pgc__head {
					display: flex;
					align-items: baseline;
					gap: var(--space-xs);
					margin-bottom: var(--space-md);
					flex-wrap: wrap;
				}
				.pgc__index {
					font-size: var(--fs-2xs);
					font-weight: 600;
					font-feature-settings: "tnum" on, "ss03" on;
					color: var(--color-text-subtle);
					letter-spacing: 0.04em;
				}
				.pgc__sep {
					font-size: var(--fs-2xs);
					color: var(--color-text-subtle);
					opacity: 0.6;
				}
				.pgc__title {
					font-size: var(--fs-2xs);
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: var(--tracking-caps);
					color: var(--color-text);
				}
				.pgc__caption {
					font-size: var(--fs-xs);
					color: var(--color-text-muted);
					font-style: italic;
				}
				.pgc__controls {
					margin-left: auto;
					display: flex;
					gap: var(--space-2xs);
				}
				.pgc__btn {
					all: unset;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					width: 1.75rem;
					height: 1.75rem;
					border: 1px solid var(--color-border-strong);
					border-radius: var(--radius-sm);
					color: var(--color-text-muted);
					cursor: pointer;
					transition: color 0.18s ease, border-color 0.18s ease,
						background 0.18s ease, transform 0.18s ease;
				}
				.pgc__btn:hover:not(:disabled) {
					color: var(--color-accent);
					border-color: var(--color-accent);
					transform: translateY(-1px);
				}
				.pgc__btn:focus-visible {
					outline: 2px solid var(--color-focus);
					outline-offset: 2px;
				}
				.pgc__btn:disabled {
					opacity: 0.35;
					cursor: not-allowed;
				}

				.pgc__viewport {
					overflow: hidden;
				}
				.pgc__container {
					display: flex;
					gap: var(--space-md);
					touch-action: pan-y;
				}
				.pgc__slide {
					flex: 0 0 auto;
					width: 22rem;
					margin: 0;
				}
				.pgc__slide img {
					width: 100%;
					height: 14rem;
					object-fit: cover;
					display: block;
					border-radius: var(--radius-sm);
					border: 1px solid var(--color-border);
					transition: border-color 0.2s ease;
				}
				.pgc__slide:hover img {
					border-color: var(--color-border-strong);
				}
				.pgc__slide figcaption {
					margin-top: var(--space-2xs);
					font-size: var(--fs-xs);
					color: var(--color-text-muted);
				}

				.pgc__dots {
					display: flex;
					justify-content: center;
					gap: var(--space-2xs);
					margin-top: var(--space-md);
				}
				.pgc__dot {
					all: unset;
					width: 0.4rem;
					height: 0.4rem;
					border-radius: 50%;
					background: var(--color-text-subtle);
					opacity: 0.4;
					cursor: pointer;
					transition: background 0.18s ease, opacity 0.18s ease,
						width 0.18s ease;
				}
				.pgc__dot:hover { opacity: 0.7; }
				.pgc__dot.is-active {
					background: var(--color-accent);
					opacity: 1;
					width: 1.25rem;
					border-radius: var(--radius-sm);
				}
				.pgc__dot:focus-visible {
					outline: 2px solid var(--color-focus);
					outline-offset: 2px;
				}

				@media (max-width: 640px) {
					.pgc__slide { width: 16rem; }
					.pgc__slide img { height: 11rem; }
				}

				@media (prefers-reduced-motion: reduce) {
					.pgc__btn,
					.pgc__dot,
					.pgc__slide img {
						transition: none;
					}
				}
			`}</style>
		</section>
	);
}
