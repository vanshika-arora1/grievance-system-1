import { Link } from "react-router-dom";

const features = [
  {
    icon: "📋",
    title: "Submit Grievances Easily",
    desc: "File complaints across Academic, Hostel, Transport and other categories in seconds with a clean, guided form.",
  },
  {
    icon: "🔍",
    title: "Track Everything",
    desc: "Monitor the status of every grievance you've submitted — from Pending to Resolved — all in one place.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "JWT-based authentication ensures your data belongs only to you. No one else can see your submissions.",
  },
  {
    icon: "⚡",
    title: "Instant Responses",
    desc: "Real-time form submission with live status updates — no page reloads, no waiting.",
  },
  {
    icon: "🗂️",
    title: "Organized Categories",
    desc: "Grievances are neatly grouped by category so administrators can prioritize and respond effectively.",
  },
  {
    icon: "📱",
    title: "Works Everywhere",
    desc: "Fully responsive design that looks great on desktop, tablet, and mobile devices.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* ── Top Nav ── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">🎓</div>
          <span className="navbar-title">GrieveEase</span>
        </div>
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <span className="hero-badge">🎓 Student Grievance Portal</span>
        <h1 className="hero-title">
          Your Voice,
          <br />
          <span className="gradient-text">Heard & Resolved</span>
        </h1>
        <p className="hero-subtitle">
          A modern platform that empowers students to submit, track, and resolve grievances — transparently and efficiently.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">
            Submit a Grievance →
          </Link>
          <Link to="/login" className="btn btn-outline">
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <p className="features-label">✦ Everything you need</p>
        <h2 className="features-title">
          Built for students,<br />designed for clarity
        </h2>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="gradient-text">Ready to get started?</h2>
        <p>Join thousands of students making their campus experience better.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary">
            Create Free Account
          </Link>
          <Link to="/login" className="btn btn-outline">
            Already have an account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} GrieveEase · Student Grievance Management System</p>
      </footer>
    </div>
  );
}
