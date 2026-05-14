import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateTask() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/tasks/", {
        title,
        description,
        priority,
        assigned_to_id: Number(assignedTo)
      });

      alert("✅ Task created successfully");

      navigate("/dashboard");

    } catch (err) {

      alert("❌ Error creating task");

    }
  };

  return (

    <div style={styles.container}>

      <form
        onSubmit={handleSubmit}
        style={styles.card}
      >

        <h1 style={styles.heading}>
          🚀 Create Task
        </h1>

        <input
          type="text"
          placeholder="Task Title"
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        <textarea
          placeholder="Task Description"
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <select
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
        >

          <option
            value="low"
            style={styles.option}
          >
            Low
          </option>

          <option
            value="medium"
            style={styles.option}
          >
            Medium
          </option>

          <option
            value="high"
            style={styles.option}
          >
            High
          </option>

        </select>

        <input
          type="number"
          placeholder="Assign Employee ID"
          onChange={(e) => setAssignedTo(e.target.value)}
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
        >
          Create Task
        </button>

      </form>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
  },

  card: {
    width: "420px",
    padding: "35px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 25px rgba(0,0,0,0.4)",
  },

  heading: {
    color: "#fff",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "38px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
  },

  select: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "#4b5563",
    color: "#fff",
    cursor: "pointer",
  },

  option: {
    background: "#1f2937",
    color: "#fff",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(90deg,#2563eb,#7c3aed)",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default CreateTask;