import { IconPhoto } from './Icons';

// Privremena zamena za fotografiju dok ne stignu prave slike iz baze.
export default function Photo({ className = '', label }) {
  return (
    <span className={`photo ${className}`} aria-hidden="true">
      {label ?? <IconPhoto />}
    </span>
  );
}
