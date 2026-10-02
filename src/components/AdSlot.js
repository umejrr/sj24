// Reklamno mesto. Kasnije ovde dolazi baner firme iz baze + brojanje prikaza i klikova.
const formati = {
  leaderboard: { cls: 'ad-leaderboard', size: '728 × 90', label: 'SPONZORISANO' },
  rect: { cls: 'ad-rect', size: '300 × 250', label: 'REKLAMA' },
  tall: { cls: 'ad-tall', size: '300 × 600', label: 'REKLAMA' },
};

export default function AdSlot({ format = 'rect', title = '[Baner firme]', label }) {
  const f = formati[format];
  return (
    <a href="#" className={`ad ${f.cls}`}>
      <span className="ad-label">{label ?? f.label}</span>
      <span className="ad-title">{title}</span>
      <span className="ad-size">{f.size}</span>
    </a>
  );
}
