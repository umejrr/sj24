'use client';

// Dugme koje pre slanja traži potvrdu (brisanje).
export default function PotvrdiDugme({ akcija, poruka = 'Sigurno?', className = 'cbtn danger', children }) {
  return (
    <form
      action={akcija}
      onSubmit={(e) => {
        if (!window.confirm(poruka)) e.preventDefault();
      }}
    >
      <button className={className}>{children}</button>
    </form>
  );
}
