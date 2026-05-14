import { useState } from "react";

import toast from "react-hot-toast";

import API from "../services/api";

import { useNavigate } from "react-router-dom";


function Documents() {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("upload");

  const [taskId, setTaskId] = useState("");

  const [file, setFile] = useState(null);

  const [documentId, setDocumentId] =
    useState("");

  const [singleDocument, setSingleDocument] =
    useState(null);

  const [taskDocuments, setTaskDocuments] =
    useState([]);


  // ✅ Upload Document
  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) {

      toast.error("Select file");

      return;
    }

    try {

      const formData = new FormData();

      formData.append("file", file);

      await API.post(
        `/documents/upload/${taskId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "✅ Document uploaded successfully"
      );

      setTaskId("");

      setFile(null);

    } catch {

      toast.error("❌ Upload failed");

    }
  };


  // ✅ Get Single Document
  const fetchDocumentById = async () => {

    try {

      const res = await API.get(
        `/documents/${documentId}`
      );

      setSingleDocument(res.data);

      toast.success(
        "✅ Document fetched"
      );

    } catch {

      toast.error(
        "❌ Document not found"
      );

      setSingleDocument(null);

    }
  };


  // ✅ Get Task Documents
  const fetchTaskDocuments = async () => {

    try {

      const res = await API.get(
        `/documents/task/${taskId}`
      );

      setTaskDocuments(res.data || []);

      toast.success(
        "✅ Task documents fetched"
      );

    } catch {

      toast.error(
        "❌ Failed to fetch documents"
      );

      setTaskDocuments([]);

    }
  };


  return (

    <div style={styles.container}>

      <div style={styles.layout}>


        {/* ✅ LEFT MENU */}
        <div style={styles.sidebar}>

          <h2 style={styles.sideTitle}>
            📁 Documents
          </h2>

          <button
            style={styles.sideBtn}
            onClick={() =>
              setActiveTab("upload")
            }
          >
            Upload Document
          </button>

          <button
            style={styles.sideBtn}
            onClick={() =>
              setActiveTab("single")
            }
          >
            Fetch Document ID
          </button>

          <button
            style={styles.sideBtn}
            onClick={() =>
              setActiveTab("task")
            }
          >
            Task Documents
          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.backBtn}
          >
            ← Dashboard
          </button>

        </div>


        {/* ✅ RIGHT CONTENT */}
        <div style={styles.content}>

          <h1 style={styles.title}>
            📂 Enterprise Document Portal
          </h1>


          {/* ✅ Upload */}
          {activeTab === "upload" && (

            <div style={styles.section}>

              <h2 style={styles.subTitle}>
                Upload Document
              </h2>

              <form onSubmit={handleUpload}>

                <input
                  type="number"
                  placeholder="Task ID"
                  value={taskId}
                  onChange={(e) =>
                    setTaskId(e.target.value)
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                  style={styles.fileInput}
                  required
                />

                <button
                  type="submit"
                  style={styles.button}
                >
                  Upload Document
                </button>

              </form>

            </div>

          )}


          {/* ✅ Single Document */}
          {activeTab === "single" && (

            <div style={styles.section}>

              <h2 style={styles.subTitle}>
                Fetch Document By ID
              </h2>

              <input
                type="number"
                placeholder="Document ID"
                value={documentId}
                onChange={(e) =>
                  setDocumentId(e.target.value)
                }
                style={styles.input}
              />

              <button
                onClick={fetchDocumentById}
                style={styles.button}
              >
                Fetch Document
              </button>

              {singleDocument && (

                <div style={styles.docCard}>

                  <h3>
                    {singleDocument.file_name}
                  </h3>

                  <p>
                    Version:
                    {" "}
                    {singleDocument.version}
                  </p>

                  <p>
                    Task ID:
                    {" "}
                    {singleDocument.task_id}
                  </p>

                  <p>
                    Uploaded By:
                    {" "}
                    {singleDocument.uploaded_by}
                  </p>

                  <button
                    style={styles.downloadBtn}
                    onClick={() =>
                      window.open(
                        `http://127.0.0.1:8000/documents/download/${singleDocument.id}`
                      )
                    }
                  >
                    ⬇ Download File
                  </button>

                </div>

              )}

            </div>

          )}


          {/* ✅ Task Documents */}
          {activeTab === "task" && (

            <div style={styles.section}>

              <h2 style={styles.subTitle}>
                Fetch Task Documents
              </h2>

              <input
                type="number"
                placeholder="Task ID"
                value={taskId}
                onChange={(e) =>
                  setTaskId(e.target.value)
                }
                style={styles.input}
              />

              <button
                onClick={fetchTaskDocuments}
                style={styles.button}
              >
                Fetch Task Documents
              </button>

              {taskDocuments.length > 0 && (

                <div>

                  {taskDocuments.map((doc) => (

                    <div
                      key={doc.id}
                      style={styles.docCard}
                    >

                      <h3>
                        {doc.file_name}
                      </h3>

                      <p>
                        Version:
                        {" "}
                        {doc.version}
                      </p>

                      <p>
                        Uploaded By:
                        {" "}
                        {doc.uploaded_by}
                      </p>

                      <button
                        style={styles.downloadBtn}
                        onClick={() =>
                          window.open(
                            `http://127.0.0.1:8000/documents/download/${doc.id}`
                          )
                        }
                      >
                        ⬇ Download File
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


const styles = {

  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
    padding: "30px",
  },

  layout: {
    display: "flex",
    gap: "25px",
  },

  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background:
      "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  sideTitle: {
    color: "#fff",
    marginBottom: "25px",
    textAlign: "center",
  },

  sideBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    background:
      "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "35px",
  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "30px",
    fontSize: "38px",
  },

  section: {
    marginTop: "20px",
  },

  subTitle: {
    color: "#fff",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    background:
      "rgba(255,255,255,0.15)",
    color: "#fff",
  },

  fileInput: {
    width: "100%",
    marginBottom: "15px",
    color: "#fff",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  docCard: {
    background:
      "rgba(255,255,255,0.08)",
    padding: "18px",
    borderRadius: "14px",
    marginTop: "18px",
    color: "#fff",
  },

  backBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#374151",
    color: "#fff",
    cursor: "pointer",
    marginTop: "20px",
  },

  downloadBtn: {
    marginTop: "12px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#10b981,#059669)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Documents;