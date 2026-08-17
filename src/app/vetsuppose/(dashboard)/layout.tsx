import LogoutButton from "@/components/LogoutButton";
import SideNav from "@/components/SideNav";
import { IconBell } from "@/components/Icons";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="dash-header-v2">
        <div className="brand">
          <span className="brand-badge">V</span> SupposeVeterinary
        </div>
        <div className="header-actions">
          <a href="/" className="header-link">Shop</a>
          <LogoutButton />
          <button className="icon-btn" aria-label="Notifications">
            <IconBell />
            <span className="bell-dot" />
          </button>
        </div>
      </div>
      <div className="admin-shell">
        <div className="side">
          <SideNav />
        </div>
        <div className="main">{children}</div>
      </div>
    </>
  );
}