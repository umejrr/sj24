import { IconCloud } from './Icons';
import { getVreme } from '@/lib/vreme';

export default async function Weather() {
  const v = await getVreme();
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
            {v ? (
              <>
                <div className="weather-temp">{v.temp}°</div>
                <div className="weather-desc">{v.opis} · vetar {v.vetar} km/h</div>
              </>
            ) : (
              <div className="weather-desc">Prognoza trenutno nije dostupna.</div>
            )}
          </div>
          <IconCloud />
        </div>
        {v && (
          <div className="weather-days">
            {v.dani.map((d) => (
              <div key={d.dan}><span>{d.dan}</span><span>{d.max}° / {d.min}°</span></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
