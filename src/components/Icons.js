// Jednostavne linijske ikone (bez spoljnih biblioteka).
const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

export function IconSearch({ size = 20 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.8" {...base} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>);
}
export function IconPhoto({ size = 24 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5" {...base} aria-hidden="true"><rect x="3" y="5" width="18" height="14" /><circle cx="9" cy="10" r="2" /><path d="M21 17l-5-5-8 7" /></svg>);
}
export function IconPrev({ size = 18 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" {...base} aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>);
}
export function IconNext({ size = 18 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" {...base} aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>);
}
export function IconCloud({ size = 52 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.3" {...base} aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.5A3.3 3.3 0 0 0 7 18z" /></svg>);
}
export function IconPower({ size = 26 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.6" {...base} aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>);
}
export function IconRoad({ size = 26 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.6" {...base} aria-hidden="true"><path d="M8 3L4 21M16 3l4 18M12 5v2M12 11v2M12 17v2" /></svg>);
}
export function IconBus({ size = 26 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.6" {...base} aria-hidden="true"><rect x="4" y="3" width="16" height="14" /><path d="M4 11h16M8 17v3M16 17v3" /></svg>);
}
export function IconCandle({ size = 26 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.6" {...base} aria-hidden="true"><path d="M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10z" /><path d="M12 8v5" /></svg>);
}
