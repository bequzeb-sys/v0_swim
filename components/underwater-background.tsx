// Real underwater photo as a fixed full-page background, with a gradient
// overlay that fades from transparent (near the light shaft) down to the
// solid deep-navy bg so content below the hero stays clean and readable.
export function UnderwaterBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* Real underwater photo */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url('/underwater-hero.webp')" }}
      />
      {/* Gradient overlay: transparent at top (let light shaft show),
          fading to solid deep navy by ~85% so lower sections sit on a
          clean dark background. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,11,26,0.15) 0%, rgba(5,11,26,0.45) 35%, rgba(5,11,26,0.85) 62%, #050B1A 85%)",
        }}
      />
    </div>
  )
}
