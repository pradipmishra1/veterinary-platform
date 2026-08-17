export default function SiteHeader({
  title,
  subtitle,
  active
}: {
  title: string;
  subtitle: string;
  active: "shop" | "services";
}) {
  return (
    <>
      <div
        style={{
          background: "var(--danger)",
          color: "#fff",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600
        }}
      >
        🚨 Emergency? Call us now:{" "}
        <a href="tel:+9779808486381" style={{ color: "#fff", textDecoration: "underline" }}>
          +977 9808486381
        </a>
      </div>

      <header className="site">
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div className="logo">
            <span className="logo-badge">V</span> SupposeVeterinary
          </div>
         <nav className="site" style={{ display: "flex" }}>
            <a href="/" style={{ marginLeft: 0, color: active === "shop" ? "var(--green-dark)" : undefined, fontWeight: active === "shop" ? 700 : 500 }}>
              Shop
            </a>
            <a href="/services" style={{ color: active === "services" ? "var(--green-dark)" : undefined, fontWeight: active === "services" ? 700 : 500 }}>
              Services
            </a>
            <a href="/vetsuppose">Admin</a>
          </nav>
        </div>
      </header>

      <div className="hero">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </>
  );
}