// Helper for safely composing absolute asset/route URLs when the site
// is served from a sub-path (GitHub project pages). Always prepends the
// configured Astro base so a single source line works whether base is
// '/' or '/cisc480-portfolio/'.
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL ?? '/';
	const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
	const cleanedPath = path.startsWith('/') ? path : `/${path}`;
	return `${trimmedBase}${cleanedPath}`;
}
