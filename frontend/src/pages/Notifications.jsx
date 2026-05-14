import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import API from "../services/api";


function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {

    fetchUser();

    fetchNotifications();

  }, []);


  const fetchUser = async () => {

    try {

      const res = await API.get("/auth/me");

      setUser(res.data || {});

    } catch {

      toast.error("Failed to load user");

    }
  };


  const fetchNotifications = async () => {

    try {

      const res = await API.get("/notifications/");

      setNotifications(res.data || []);

    } catch {

      toast.error("Failed to fetch notifications");

    }
  };


  const markAsRead = async (id) => {

    try {

      await API.patch(
        `/notifications/${id}/read`
      );

      toast.success("Marked as read");

      // ✅ UPDATE UI WITHOUT DISAPPEARING
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, is_read: true }
            : item
        )
      );

    } catch {

      toast.error("Failed to update");

    }
  };


  return (

    <div style={styles.container}>

      {/* 🔥 TOP BAR */}
      <div style={styles.topBar}>

        <div>

          <h2 style={styles.userName}>
            👋 {user?.name || "User"}
          </h2>

          <span style={styles.roleBadge}>
            {user?.role || "employee"}
          </span>

        </div>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Dashboard
        </button>

      </div>

      {/* 🔥 TITLE */}
      <h1 style={styles.title}>
        🔔 Notifications
      </h1>

      {/* 🔥 NOTIFICATIONS */}
      <div style={styles.grid}>

        {notifications.length === 0 ? (

          <div style={styles.empty}>
            No Notifications
          </div>

        ) : (

          notifications.map((item) => (

            <div
              key={item.id}
              style={{
                ...styles.card,

                border:
                  item.is_read
                    ? "1px solid #374151"
                    : "1px solid #2563eb",
              }}
            >

              <h3 style={styles.message}>
                {item.message}
              </h3>

              <p style={styles.status}>
                Status:
                {" "}
                {item.is_read
                  ? "Read"
                  : "Unread"}
              </p>

              {!item.is_read && (

                <button
                  style={styles.button}
                  onClick={() =>
                    markAsRead(item.id)
                  }
                >
                  Mark Read
                </button>

              )}

            </div>
          ))
        )}

      </div>

    </div>
  );
}


const styles = {

  container: {
    minHeight: "100vh",
    padding: "30px",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  userName: {
    color: "#fff",
    margin: 0,
  },

  roleBadge: {
    background: "#2563eb",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "10px",
    fontSize: "12px",
  },

  backBtn: {
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "42px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "25px",
    color: "#fff",
  },

  message: {
    marginBottom: "15px",
  },

  status: {
    color: "#cbd5e1",
    marginBottom: "15px",
  },

  button: {
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  empty: {
    color: "#fff",
    textAlign: "center",
    marginTop: "50px",
    fontSize: "22px",
  },
};

export default Notifications;