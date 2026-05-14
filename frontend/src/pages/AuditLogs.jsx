import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import API from "../services/api";

import Navbar from "../components/Navbar";


function AuditLogs() {

  const [logs, setLogs] = useState([]);

  const [user, setUser] = useState({});

  useEffect(() => {

    fetchUser();

    fetchLogs();

  }, []);


  const fetchUser = async () => {

    try {

      const res = await API.get("/auth/me");

      setUser(res.data || {});

    } catch {

      toast.error("Failed to load user");

    }
  };


  const fetchLogs = async () => {

    try {

      const res = await API.get("/audit/logs");

      setLogs(res.data || []);

    } catch {

      toast.error("Failed to fetch logs");

    }
  };


  return (

    <div style={styles.container}>

      <Navbar user={user} />

      <h1 style={styles.title}>
        📋 Audit Logs
      </h1>

      <div style={styles.grid}>

        {logs.length === 0 ? (

          <div style={styles.empty}>
            No Audit Logs
          </div>

        ) : (

          logs.map((log) => (

            <div
              key={log.id}
              style={styles.card}
            >

              <h2 style={styles.action}>
                {log.action}
              </h2>

              <p style={styles.text}>
                Entity:
                {" "}
                {log.entity}
              </p>

              <p style={styles.text}>
                Entity ID:
                {" "}
                {log.entity_id}
              </p>

              <p style={styles.text}>
                User ID:
                {" "}
                {log.user_id}
              </p>

              <p style={styles.time}>
                {new Date(
                  log.timestamp
                ).toLocaleString()}
              </p>

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

  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "42px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "25px",
    color: "#fff",
    border: "1px solid #374151",
  },

  action: {
    marginBottom: "15px",
    color: "#60a5fa",
  },

  text: {
    color: "#e5e7eb",
    marginBottom: "10px",
  },

  time: {
    color: "#9ca3af",
    marginTop: "15px",
    fontSize: "14px",
  },

  empty: {
    color: "#fff",
    textAlign: "center",
    marginTop: "50px",
    fontSize: "22px",
  },
};

export default AuditLogs;