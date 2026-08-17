import LogoutButton from "@/components/LogoutButton";
import SideNav from "@/components/SideNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="dash-header-v2 mobile-only-header">
        <div className="brand">
          <span className="brand-badge">V</span> SupposeVeterinary
        </div>
        <div className="bell">
          🔔<span className="bell-dot" />
        </div>
      </div>
      <header className="site desktop-only-header">
        <div className="logo">
          <span className="logo-badge">V</span> SupposeVeterinary{" "}
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Admin</span>
        </div>
        <nav className="site" style={{ display: "flex", alignItems: "center" }}>
          <a href="/">View shop</a>
          <LogoutButton />
        </nav>
      </header>
      <div className="admin-shell">
        <div className="side"><SideNav /></div>
        <div className="main">{children}</div>
      </div>
    </>
  );
}