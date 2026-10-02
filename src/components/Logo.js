import Link from 'next/link';

export default function Logo({ size = 'lg', inverse = false, tagline = true }) {
  return (
    <Link href="/" aria-label="SJ24 početna" className={`logo logo-${size}${inverse ? ' logo-inverse' : ''}`}>
      <span className="logo-mark">
        <span className="sj">SJ</span>
        <span className="n24">24</span>
      </span>
      {tagline && <span className="logo-tag">SJENICA · PEŠTER</span>}
    </Link>
  );
}
