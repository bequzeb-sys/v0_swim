// Real underwater photo as a fixed full-page background, with a gradient
// overlay that fades from transparent (near the light shaft) down to the
// saturated blue atmosphere so content below the hero stays clean and readable.
export function UnderwaterBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-x-clip">
      {/* Real underwater photo */}
      <div
        className="absolute inset-0 overflow-x-clip bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url('/underwater-hero.webp')" }}
      />
      {/* Gradient overlay: transparent at top (let light shaft show),
          fading to a saturated underwater blue by ~85% so lower
          sections sit on a visibly blue background. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,42,82,0.15) 0%, rgba(13,42,82,0.45) 35%, rgba(10,31,61,0.85) 62%, #0a1f3d 85%)",
        }}
      />
    </div>
  )
}
