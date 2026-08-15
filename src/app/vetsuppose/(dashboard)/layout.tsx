import LogoutButton from "@/components/LogoutButton";
import SideNav from "@/components/SideNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site">
        <div className="logo">
          <span className="logo-badge">V</span> Veterinary{" "}
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