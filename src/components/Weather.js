import { IconCloud } from './Icons';

// Probni podaci. Sledeći korak: prava prognoza za Sjenicu preko vremenskog servisa.
export default function Weather() {
  return (
    <div className="weather">
      <svg className="weather-bg" viewBox="0 0 300 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="260" cy="40" r="70" style={{ fill: 'var(--accent)' }} opacity="0.75" />
        <circle cx="30" cy="240" r="90" style={{ fill: 'var(--hill-2)' }} />
      </svg>
      <div className="weather-glass">
        <div className="weather-top">
          <div>
            <div className="weather-label">VREME · SJENICA</div>
            <div className="weather-temp">6°</div>
            <div className="weather-desc">Oblačno · vetar 12 km/h</div>
          </div>
          <IconCloud />
        </div>
        <div className="weather-days">
          <div><span>Subota</span><span>4°</span></div>
          <div><span>Nedelja</span><span>2°</span></div>
          <div><span>Ponedeljak</span><span>−1°</span></div>
        </div>
        <a href="/servis">Detaljna prognoza</a>
      </div>
    </div>
  );
}
