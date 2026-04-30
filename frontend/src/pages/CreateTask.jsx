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

      alert("Task created successfully");
      navigate("/dashboard");

    } catch (err) {
      alert("Error creating task");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "300px"
        }}
      >
        <h2>Create Task</h2>

        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <select onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
        <br /><br />

        <input
          type="number"
          placeholder="Assign Employee ID"
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateTask;