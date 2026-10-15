import { IconPhoto } from './Icons';

// Fotografija; dok je nema, siva zamena sa ikonom.
export default function Photo({ src, alt = '', className = '', label }) {
  return (
    <span className={`photo ${className}`} aria-hidden={src ? undefined : 'true'}>
      {src
        ? <img src={src} alt={alt} loading="lazy" decoding="async" />
        : (label ?? <IconPhoto />)}
    </span>
  );
}
