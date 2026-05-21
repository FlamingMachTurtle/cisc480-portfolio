/**
 * Tech-icon registry — maps human-readable tech names from
 * `src/content/projects/*.md` (and the home Skills list) to the
 * `simple-icons` SVG path data + brand hex.
 *
 * Render strategy:
 *   - Default state: monochrome, currentColor (matches editorial tone).
 *   - Hover state: brand hex (subtle reveal of identity, no AI-marketing
 *     "stack lockup" feel).
 *   - Names that have no entry here render as text-only via a graceful
 *     fallback in <TechIcon />. This keeps non-iconic skills like
 *     "Inquiry-based questioning" from looking broken.
 *
 * Why an explicit registry instead of dynamic name → slug lookup:
 *   - Our content uses friendly names ("Material UI v7", "React 19",
 *     "QuickBooks Online inventory workflow") that don't match
 *     simple-icons slug conventions.
 *   - Some entries are intentionally aliased ("React 19" → React).
 *   - Some entries deliberately have no logo (server APIs / abstract
 *     skills) and we want them to render gracefully.
 */

import {
	siApple,
	siAstro,
	siCss,
	siEbay,
	siEslint,
	siFigma,
	siFramer,
	siGit,
	siGithub,
	siGithubactions,
	siGooglesheets,
	siGreensock,
	siHtml5,
	siJavascript,
	siMaterialdesign,
	siMui,
	siNextdotjs,
	siNodedotjs,
	siOpenjdk,
	siPostgresql,
	siPrettier,
	siPython,
	siQuickbooks,
	siReact,
	siSupabase,
	siSwift,
	siThreedotjs,
	siTypescript,
	siVercel,
	siVite,
	siWebgl,
} from 'simple-icons';

export interface TechIconData {
	/** Human-readable display label. */
	title: string;
	/** SVG path data (24x24 viewBox). */
	path: string;
	/** Brand hex without #. */
	hex: string;
}

/** Map of normalized tech name → icon data. */
export const TECH_ICONS: Record<string, TechIconData> = {
	// Languages
	python: { title: 'Python', path: siPython.path, hex: siPython.hex },
	java: { title: 'Java', path: siOpenjdk.path, hex: siOpenjdk.hex },
	javascript: { title: 'JavaScript', path: siJavascript.path, hex: siJavascript.hex },
	typescript: { title: 'TypeScript', path: siTypescript.path, hex: siTypescript.hex },
	swift: { title: 'Swift', path: siSwift.path, hex: siSwift.hex },
	html: { title: 'HTML5', path: siHtml5.path, hex: siHtml5.hex },
	css: { title: 'CSS', path: siCss.path, hex: siCss.hex },
	'html / css': { title: 'HTML / CSS', path: siHtml5.path, hex: siHtml5.hex },

	// Frameworks
	react: { title: 'React', path: siReact.path, hex: siReact.hex },
	'react 19': { title: 'React', path: siReact.path, hex: siReact.hex },
	'node.js': { title: 'Node.js', path: siNodedotjs.path, hex: siNodedotjs.hex },
	astro: { title: 'Astro', path: siAstro.path, hex: siAstro.hex },
	swiftui: { title: 'SwiftUI', path: siSwift.path, hex: siSwift.hex },
	'next.js': { title: 'Next.js', path: siNextdotjs.path, hex: siNextdotjs.hex },
	vite: { title: 'Vite', path: siVite.path, hex: siVite.hex },

	// UI / data libs
	'material ui v7': { title: 'Material UI', path: siMui.path, hex: siMui.hex },
	'material ui': { title: 'Material UI', path: siMui.path, hex: siMui.hex },
	figma: { title: 'Figma', path: siFigma.path, hex: siFigma.hex },

	// Infra / data
	supabase: { title: 'Supabase', path: siSupabase.path, hex: siSupabase.hex },
	'supabase (postgres + auth)': { title: 'Supabase', path: siSupabase.path, hex: siSupabase.hex },
	'supabase / postgres': { title: 'Supabase', path: siSupabase.path, hex: siSupabase.hex },
	postgres: { title: 'Postgres', path: siPostgresql.path, hex: siPostgresql.hex },
	postgresql: { title: 'PostgreSQL', path: siPostgresql.path, hex: siPostgresql.hex },
	sql: { title: 'SQL', path: siPostgresql.path, hex: siPostgresql.hex },
	vercel: { title: 'Vercel', path: siVercel.path, hex: siVercel.hex },
	'vercel (static + serverless api routes)': { title: 'Vercel', path: siVercel.path, hex: siVercel.hex },

	// Tooling
	eslint: { title: 'ESLint', path: siEslint.path, hex: siEslint.hex },
	prettier: { title: 'Prettier', path: siPrettier.path, hex: siPrettier.hex },
	'eslint + prettier': { title: 'ESLint + Prettier', path: siEslint.path, hex: siEslint.hex },
	git: { title: 'Git', path: siGit.path, hex: siGit.hex },
	github: { title: 'GitHub', path: siGithub.path, hex: siGithub.hex },
	'github actions': { title: 'GitHub Actions', path: siGithubactions.path, hex: siGithubactions.hex },
	'git / github actions': { title: 'Git · GitHub Actions', path: siGithub.path, hex: siGithub.hex },

	// Animation
	gsap: { title: 'GSAP', path: siGreensock.path, hex: siGreensock.hex },
	'framer motion': { title: 'Framer Motion', path: siFramer.path, hex: siFramer.hex },

	// Brands the projects integrate with
	ebay: { title: 'eBay', path: siEbay.path, hex: siEbay.hex },
	'ebay trading api': { title: 'eBay Trading API', path: siEbay.path, hex: siEbay.hex },
	'quickbooks online': { title: 'QuickBooks Online', path: siQuickbooks.path, hex: siQuickbooks.hex },
	'quickbooks online inventory workflow': { title: 'QuickBooks Online', path: siQuickbooks.path, hex: siQuickbooks.hex },
	'google sheets': { title: 'Google Sheets', path: siGooglesheets.path, hex: siGooglesheets.hex },
	'google sheets automation': { title: 'Google Sheets', path: siGooglesheets.path, hex: siGooglesheets.hex },
	'google sheets api': { title: 'Google Sheets', path: siGooglesheets.path, hex: siGooglesheets.hex },
	// Power BI has no simple-icons entry; rendered as text-only badge.

	// Game / visual (Minecraft has no simple-icons entry — falls back to text)
	webgl: { title: 'WebGL', path: siWebgl.path, hex: siWebgl.hex },
	'three.js': { title: 'Three.js', path: siThreedotjs.path, hex: siThreedotjs.hex },

	// iOS
	ios: { title: 'iOS', path: siApple.path, hex: '111111' /* siApple is white-on-black; keep dark */ },
	'ios development': { title: 'iOS', path: siApple.path, hex: '111111' },

	// Generic fallbacks for things that don't have a brand logo but want a glyph
	'design system': { title: 'Design System', path: siMaterialdesign.path, hex: siMaterialdesign.hex },
};

/**
 * Resolve a tech name to its icon data, or `null` if unknown.
 * Does case-insensitive lookup and a couple of normalization steps.
 */
export function resolveTechIcon(name: string): TechIconData | null {
	const key = name.trim().toLowerCase();
	if (TECH_ICONS[key]) return TECH_ICONS[key];
	// Try the substring in front of " (" — e.g., "Vercel (static ...)"
	const beforeParen = key.split(' (')[0]?.trim();
	if (beforeParen && TECH_ICONS[beforeParen]) return TECH_ICONS[beforeParen];
	// Try "Foo / Bar" → first segment.
	const beforeSlash = key.split(' / ')[0]?.trim();
	if (beforeSlash && TECH_ICONS[beforeSlash]) return TECH_ICONS[beforeSlash];
	return null;
}
