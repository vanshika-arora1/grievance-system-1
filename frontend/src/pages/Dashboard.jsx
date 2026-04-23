import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Academic", "Hostel", "Transport", "Library", "Sports", "Other"];

function StatusBadge({ status }) {
  const map = {
    Pending:    "badge-warning",
    "In Progress": "badge-purple",
    Resolved:   "badge-success",
    Rejected:   "badge-danger",
  };
  return <span className={`badge ${map[status] ?? "badge-purple"}`}>{status}</span>;
}

function CategoryBadge({ category }) {
  return (
    <span className="badge badge-purple" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>
      {category}
    </span>
  );
}

export default function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");
  const [search, setSearch]         = useState("");
  const [userName, setUserName]     = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic",
  });

  /* ── Fetch grievances ── */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/grievances");
      setGrievances(res.data);
    } catch {
      // token may be invalid; ProtectedRoute will handle redirect
    } finally {
      setLoading(false);
    }
  };

  /* ── Decode JWT for user name ── */
  useEffect(() => {
    fetchData();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserName(payload.name || "");
      }
    } catch {
      // ignore
    }
  }, []);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    if (!search.trim()) return grievances;
    const q = search.toLowerCase();
    return grievances.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q)
    );
  }, [grievances, search]);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:    grievances.length,
    pending:  grievances.filter((g) => g.status === "Pending").length,
    resolved: grievances.filter((g) => g.status === "Resolved").length,
    other:    grievances.filter((g) => !["Pending","Resolved"].includes(g.status)).length,
  }), [grievances]);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim() || !form.description.trim()) {
      setFormError("Title and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      await API.post("/grievances", form);
      setForm({ title: "", description: "", category: "Academic" });
      fetchData();
    } catch (err) {
      setFormError(err?.response?.data?.msg || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Update status ── */
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/grievances/${id}`, { status });
      fetchData();
    } catch {
      alert("Failed to update status.");
    }
  };

  /* ── Delete ── */
  const deleteGrievance = async (id) => {
    if (!confirm("Delete this grievance? This cannot be undone.")) return;
    try {
      await API.delete(`/grievances/${id}`);
      fetchData();
    } catch {
      alert("Failed to delete grievance.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar userName={userName} />

      <main className="dashboard-content">
        {/* ── Header ── */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              {userName ? `Welcome, ${userName.split(" ")[0]} 👋` : "Dashboard"}
            </h1>
            <p className="dashboard-subtitle">
              Manage and track all your submitted grievances below.
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">📋</div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">⏳</div>
            <div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div>
              <div className="stat-value">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">🔄</div>
            <div>
              <div className="stat-value">{stats.other}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
        </div>

        {/* ── Submit Form ── */}
        <div className="submit-panel">
          <div className="panel-title">📝 Submit a New Grievance</div>

          {formError && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              ⚠️ {formError}
            </div>
          )}

          <form className="submit-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  placeholder="Brief title of your grievance"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe your grievance in detail…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? <><span className="spinner" /> Submitting…</> : "Submit Grievance →"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Grievances List ── */}
        <div className="grievances-panel">
          <div className="panel-header">
            <span className="panel-title" style={{ margin: 0, fontSize: "1rem" }}>
              📂 My Grievances
              {grievances.length > 0 && (
                <span className="badge badge-purple" style={{ marginLeft: 8 }}>
                  {grievances.length}
                </span>
              )}
            </span>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                placeholder="Search grievances…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
              <div className="spinner" style={{ margin: "0 auto 12px", width: 32, height: 32, borderWidth: 3 }} />
              <p>Loading grievances…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>{search ? "No results found" : "No grievances yet"}</h3>
              <p>
                {search
                  ? "Try a different search term."
                  : "Submit your first grievance using the form above."}
              </p>
            </div>
          ) : (
            <div className="grievances-list">
              {filtered.map((g) => (
                <div className="grievance-item" key={g._id}>
                  <div className="grievance-info">
                    <div className="grievance-title">{g.title}</div>
                    <div className="grievance-desc">{g.description}</div>
                    <div className="grievance-meta">
                      <CategoryBadge category={g.category} />
                      <StatusBadge status={g.status} />
                      {g.date && (
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {new Date(g.date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grievance-actions">
                    {g.status === "Pending" && (
                      <button
                        className="btn btn-sm btn-ghost"
                        style={{ color: "var(--accent-2)", borderColor: "rgba(124,58,237,0.3)", fontSize: "0.8rem", padding: "6px 12px" }}
                        onClick={() => updateStatus(g._id, "In Progress")}
                      >
                        Mark In Progress
                      </button>
                    )}
                    {g.status === "In Progress" && (
                      <button
                        className="btn btn-sm btn-ghost"
                        style={{ color: "var(--success)", borderColor: "rgba(16,185,129,0.3)", fontSize: "0.8rem", padding: "6px 12px" }}
                        onClick={() => updateStatus(g._id, "Resolved")}
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      className="btn btn-danger-ghost"
                      onClick={() => deleteGrievance(g._id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}