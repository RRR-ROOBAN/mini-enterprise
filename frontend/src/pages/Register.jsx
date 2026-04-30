import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ ADD
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success("Registered successfully"); // ✅ SUCCESS
      navigate("/");

    } catch (err) {
      const message =
        err.response?.data?.detail || "Registration failed";

      toast.error(message); // ✅ ERROR
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>Register</h2>

        <input
          style={styles.input}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

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

        <select
          style={styles.input}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>

        <button style={styles.button}>Register</button>

        {/* 👉 Back to login */}
        <p style={{ marginTop: "15px" }}>
          Already have account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
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
    background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
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
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Register;