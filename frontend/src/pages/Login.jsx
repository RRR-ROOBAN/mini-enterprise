import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ ADD
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.access_token);

      toast.success("Login successful"); // ✅ SUCCESS MESSAGE

      navigate("/dashboard");

    } catch (err) {
      const message =
        err.response?.data?.detail || "Invalid email or password";

      toast.error(message); // ✅ REPLACED ALERT
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button}>Login</button>

        {/* 👉 Register button */}
        <p style={{ marginTop: "15px" }}>
          Don’t have account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "300px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Login;