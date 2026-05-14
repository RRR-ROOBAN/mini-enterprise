import { useNavigate } from "react-router-dom";

function Navbar({ user }) {

  const navigate = useNavigate();

  const role = user?.role || "employee";

  return (

    <div style={styles.navbar}>

      <div style={styles.logo}>
        🚀 Enterprise Workflow
      </div>

      <div style={styles.links}>

        <button
          style={styles.btn}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          style={styles.btn}
          onClick={() => navigate("/kanban")}
        >
          Tasks
        </button>

        <button
          style={styles.btn}
          onClick={() => navigate("/approvals")}
        >
          Approvals
        </button>

        <button
          style={styles.btn}
          onClick={() => navigate("/comments")}
        >
          Comments
        </button>

        <button
          style={styles.btn}
          onClick={() => navigate("/notifications")}
        >
          Notifications
        </button>

        {/* ✅ Only Admin */}
        {role === "admin" && (

          <button
            style={styles.btn}
            onClick={() => navigate("/audit-logs")}
          >
            Audit Logs
          </button>
        )}

      </div>

    </div>
  );
}

const styles = {

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 30px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    marginBottom: "25px",
  },

  logo: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "bold",
  },

  links: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  btn: {
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;