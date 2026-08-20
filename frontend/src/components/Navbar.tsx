import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { StickyNote, LogOut } from "lucide-react";
import type { User } from "../lib/types";

export default function Navbar() {
  const navigate = useNavigate();

  let user: User | null = null;
  const userCookie = Cookies.get("user");
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <StickyNote size={22} color="#2563eb" />
        <span>NotesApp</span>
      </Link>

      <div className="navbar-user">
        {user && (
          <span className="user-email">
            {user.full_name || user.username || user.email}
          </span>
        )}
        <button onClick={handleLogout} className="logout-btn" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </nav>
  );
}
