/**
 * Shown while a server component streams in. The skeleton mirrors the card grid
 * so the layout doesn't jump when the real content arrives.
 */
export default function Loading() {
  return (
    <div className="wrap">
      <div className="page-note">
        <span className="spinner" /> Loading…
      </div>
      <div className="grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="skeleton-card" key={i} aria-hidden="true">
            <div className="sk-media" />
            <div className="sk-body">
              <div className="sk-line short" />
              <div className="sk-line" />
              <div className="sk-line" />
              <div className="sk-btn" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
