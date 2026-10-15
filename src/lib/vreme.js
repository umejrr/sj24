// Vremenska prognoza za Sjenicu (Open-Meteo, bez ključa). Osvežava se na 30 minuta.
const URL_PROGNOZE = 'https://api.open-meteo.com/v1/forecast?latitude=43.2733&longitude=20.0017'
  + '&current=temperature_2m,weather_code,wind_speed_10m'
  + '&daily=temperature_2m_max,temperature_2m_min,weather_code'
  + '&timezone=Europe%2FBelgrade&forecast_days=4';

const OPISI = [
  [[0], 'Vedro'], [[1], 'Pretežno vedro'], [[2], 'Delimično oblačno'], [[3], 'Oblačno'],
  [[45, 48], 'Magla'], [[51, 53, 55, 56, 57], 'Rosulja'], [[61, 63, 65, 66, 67], 'Kiša'],
  [[71, 73, 75, 77], 'Sneg'], [[80, 81, 82], 'Pljuskovi'], [[85, 86], 'Snežni pljuskovi'],
  [[95, 96, 99], 'Grmljavina'],
];
const DANI = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];

export function opisVremena(kod) {
  return OPISI.find(([kodovi]) => kodovi.includes(kod))?.[1] ?? '';
}

export async function getVreme() {
  try {
    const res = await fetch(URL_PROGNOZE, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const d = await res.json();
    return {
      temp: Math.round(d.current.temperature_2m),
      opis: opisVremena(d.current.weather_code),
      vetar: Math.round(d.current.wind_speed_10m),
      dani: d.daily.time.slice(1, 4).map((dan, i) => ({
        dan: DANI[new Date(`${dan}T12:00:00Z`).getUTCDay()],
        max: Math.round(d.daily.temperature_2m_max[i + 1]),
        min: Math.round(d.daily.temperature_2m_min[i + 1]),
      })),
    };
  } catch {
    return null;
  }
}
