import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ userName }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Generate initials avatar from name
  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand" style={{ textDecoration: "none" }}>
        <div className="navbar-logo">🎓</div>
        <span className="navbar-title">GrieveEase</span>
      </Link>

      <div className="navbar-actions">
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          {userName && (
            <span style={{ color: "var(--text)", fontSize: "0.88rem" }}>
              {userName}
            </span>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}