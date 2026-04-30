import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ ADD
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const navigate = useNavigate();

  // 🔄 Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks", err);
      toast.error("Failed to load tasks"); // ✅
    }
  };

  // 👤 Fetch user
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.log("Error fetching user", err);
      toast.error("Failed to load user"); // ✅
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, []);

  // 🔐 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out"); // ✅
    navigate("/");
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));

      toast.success("Task deleted"); // ✅
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.detail ||
        (err.response?.status === 403
          ? "Only Admin/Manager can delete"
          : err.response?.status === 404
          ? "Task not found"
          : "Delete failed");

      toast.error(message); // ✅
    }
  };

  // 💾 SAVE UPDATE
  const handleSave = async (id) => {
    try {
      await API.put(`/tasks/${id}`, editData);
      setEditId(null);
      fetchTasks();

      toast.success("Task updated"); // ✅
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.detail || "Update failed";

      toast.error(message); // ✅
    }
  };

  // 🔄 STATUS UPDATE
  const handleStatusUpdate = async (id, value) => {
    try {
      await API.patch(`/tasks/${id}/status?status=${value}`);
      fetchTasks();

      toast.success("Status updated"); // ✅
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.detail || "Status update failed";

      toast.error(message); // ✅
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* USER */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          fontWeight: "bold",
        }}
      >
        {user ? `👤 ${user.name} (${user.role})` : ""}
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      {(user?.role === "admin" || user?.role === "manager") && (
        <button
          onClick={() => navigate("/create-task")}
          style={{
            marginBottom: "30px",
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          + Create Task
        </button>
      )}

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            maxWidth: "1000px",
          }}
        >
          {tasks.map((task) => {
            const statusColor =
              task.status === "done"
                ? "green"
                : task.status === "in_progress"
                ? "orange"
                : "gray";

            const priorityColor =
              task.priority === "high"
                ? "red"
                : task.priority === "medium"
                ? "blue"
                : "green";

            return (
              <div
                key={task.id}
                style={{
                  width: "260px",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderLeft: `6px solid ${priorityColor}`,
                }}
              >
                {editId === task.id ? (
                  <>
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                    <input
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                    />
                    <input
                      value={editData.priority}
                      onChange={(e) =>
                        setEditData({ ...editData, priority: e.target.value })
                      }
                    />

                    <button onClick={() => handleSave(task.id)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h3>{task.title}</h3>

                    <p>
                      <b>Status:</b>{" "}
                      <span style={{ color: statusColor }}>
                        {task.status}
                      </span>
                    </p>

                    <p>
                      <b>Priority:</b>{" "}
                      <span style={{ color: priorityColor }}>
                        {task.priority}
                      </span>
                    </p>

                    {user?.role === "employee" && (
                      <input
                        defaultValue={task.status}
                        onBlur={(e) =>
                          handleStatusUpdate(task.id, e.target.value)
                        }
                      />
                    )}

                    {(user?.role === "admin" ||
                      user?.role === "manager") && (
                      <button
                        onClick={() => {
                          setEditId(task.id);
                          setEditData({
                            title: task.title,
                            description: task.description || "",
                            priority: task.priority,
                          });
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {(user?.role === "admin" ||
                      user?.role === "manager") && (
                      <button onClick={() => handleDelete(task.id)}>
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;