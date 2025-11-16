"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Eye, Check, X, AlertTriangle } from "lucide-react"
import { API_URL } from "../config/api" // ✅ Base URL
import "./Dashboard.css"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [vehicleSubmissions, setVehicleSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectModal, setShowRejectModal] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)

  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const token = userInfo?.token

  // ✅ Redirect if not logged in or not admin
  useEffect(() => {
    if (!token || userInfo.role !== "admin") {
      navigate("/login")
      return
    }
    fetchSubmissions()
    fetchStats()
  }, [token, navigate])

  // ✅ Fetch all vehicle submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to load submissions")
      setVehicleSubmissions(data)
    } catch (err) {
      console.error("❌ fetchSubmissions:", err.message)
      showToast("Failed to load submissions")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setStats([
        { label: "Total Submissions", value: data.total, icon: "📋", color: "#6496c8" },
        { label: "Pending Review", value: data.pending, icon: "⏳", color: "#d4a500" },
        { label: "Approved", value: data.approved, icon: "✓", color: "#2d7d2d" },
        { label: "Rejected", value: data.rejected, icon: "✕", color: "#c86464" },
      ])
    } catch (err) {
      console.error("❌ fetchStats:", err.message)
      showToast("Failed to load stats")
    }
  }

  // ✅ Approve a submission
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/vehicles/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showToast("Vehicle approved successfully!")
      fetchSubmissions()
      fetchStats()
    } catch (err) {
      showToast(err.message)
    }
  }

  // ✅ Reject a submission
  const handleReject = async (id) => {
    if (!rejectionReason.trim()) return showToast("Please provide a rejection reason")
    try {
      const res = await fetch(`${API_URL}/admin/vehicles/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected", reason: rejectionReason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      showToast("Vehicle rejected successfully!")
      setRejectionReason("")
      setShowRejectModal(null)
      fetchSubmissions()
      fetchStats()
    } catch (err) {
      showToast(err.message)
    }
  }

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  // ✅ Toast utility
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return { bg: "#d4f8d4", text: "#2d7d2d" }
      case "rejected":
        return { bg: "#fdd8d8", text: "#c86464" }
      case "pending":
        return { bg: "#fff3cd", text: "#d4a500" }
      default:
        return { bg: "#f0f0f0", text: "#999" }
    }
  }

  const filteredSubmissions =
    filterStatus === "all"
      ? vehicleSubmissions
      : vehicleSubmissions.filter((v) => v.reviewStatus === filterStatus)

  // ✅ Loading spinner
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--primary-orange)",
          fontWeight: "600",
          fontSize: "1.2rem",
        }}
      >
        Loading submissions...
      </div>
    )
// ✅ Fetch vehicle details for "View" modal
const fetchVehicleDetails = async (id) => {
  try {
    const res = await fetch(`${API_URL}/admin/vehicles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch vehicle details");
    setSelectedSubmission(data);
    setShowDetails(true);
  } catch (err) {
    console.error("❌ fetchVehicleDetails error:", err.message);
    showToast("Failed to load vehicle details");
  }
};

  return (
    <div style={{ background: "var(--light-gray)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--white)",
          borderBottom: "2px solid var(--primary-orange)",
          padding: "1.5rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            style={{
              background: "var(--light-gray)",
              color: "var(--primary-orange)",
              border: "2px solid var(--primary-orange)",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--primary-orange)"
              e.currentTarget.style.color = "var(--white)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--light-gray)"
              e.currentTarget.style.color = "var(--primary-orange)"
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
            color: "var(--white)",
            padding: "1rem 1.5rem",
            borderRadius: "var(--border-radius)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            animation: "slideInRight 0.3s ease-out",
            zIndex: 1000,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Dashboard Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--white)",
                padding: "1.5rem",
                borderRadius: "var(--border-radius)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                borderLeft: `4px solid ${stat.color}`,
                animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#999" }}>{stat.label}</p>
                  <h3 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--dark)" }}>
                    {stat.value}
                  </h3>
                </div>
                <span style={{ fontSize: "2rem" }}>{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                background:
                  filterStatus === status
                    ? `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`
                    : "var(--white)",
                color: filterStatus === status ? "var(--white)" : "var(--dark)",
                border: filterStatus === status ? "none" : "2px solid #eee",
                padding: "0.7rem 1.3rem",
                borderRadius: "20px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>
          Vehicle Submissions ({filteredSubmissions.length})
        </h2>

        {/* Submissions List */}
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {filteredSubmissions.map((submission, idx) => {
            const statusColor = getStatusColor(submission.reviewStatus)
            return (
              <div
                key={submission._id}
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--border-radius)",
                  padding: "1.5rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  borderLeft: `4px solid ${statusColor.text}`,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "2rem",
                  animation: `slideUp 0.6s ease-out ${idx * 0.05}s both`,
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src={submission.image}
                      alt={submission.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{submission.name}</h3>
                      <p style={{ fontSize: "0.9rem", color: "#666" }}>
                        Submitted by: <strong>{submission.ownerName}</strong>
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "#999" }}>
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "1rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <div style={{ background: "var(--light-gray)", padding: "0.8rem", borderRadius: "8px" }}>
                      <span style={{ display: "block", color: "#999" }}>Type</span>
                      <strong>{submission.type}</strong>
                    </div>
                    <div style={{ background: "var(--light-gray)", padding: "0.8rem", borderRadius: "8px" }}>
                      <span style={{ display: "block", color: "#999" }}>Fuel</span>
                      <strong>{submission.fuel}</strong>
                    </div>
                    <div style={{ background: "var(--light-gray)", padding: "0.8rem", borderRadius: "8px" }}>
                      <span style={{ display: "block", color: "#999" }}>Price/Day</span>
                      <strong>₹{submission.pricePerDay}</strong>
                    </div>
                    <div style={{ background: "var(--light-gray)", padding: "0.8rem", borderRadius: "8px" }}>
                      <span style={{ display: "block", color: "#999" }}>Location</span>
                      <strong>{submission.location}</strong>
                    </div>
                    
                  </div>

                  {submission.reason && (
                    <div
                      style={{
                        marginTop: "1rem",
                        background: "#fdd8d8",
                        padding: "1rem",
                        borderRadius: "8px",
                        display: "flex",
                        gap: "0.8rem",
                      }}
                    >
                      <AlertTriangle size={18} style={{ color: "#c86464" }} />
                      <div>
                        <strong style={{ color: "#c86464" }}>Rejection Reason</strong>
                        <p style={{ fontSize: "0.9rem", color: "#a04a4a" }}>{submission.reason}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div
                    style={{
                      background: statusColor.bg,
                      color: statusColor.text,
                      padding: "0.6rem 1rem",
                      borderRadius: "20px",
                      fontWeight: "700",
                      textAlign: "center",
                      textTransform: "capitalize",
                    }}
                  >
                    {submission.reviewStatus}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <button
                       onClick={() => fetchVehicleDetails(submission._id)}
                      style={{
                        background: "rgba(100,150,200,0.1)",
                        color: "#6496c8",
                        border: "none",
                        padding: "0.6rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={16} /> View
                    </button>

                   {["pending", "approved", "rejected"].includes(submission.reviewStatus) && (
  <>
    {submission.reviewStatus !== "approved" && (
      <button
        onClick={() => handleApprove(submission._id)}
        style={{
          background: "rgba(45,125,45,0.1)",
          color: "#2d7d2d",
          border: "none",
          padding: "0.6rem",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        <Check size={16} /> Approve
      </button>
    )}

    {submission.reviewStatus !== "rejected" && (
      <button
        onClick={() => setShowRejectModal(submission._id)}
        style={{
          background: "rgba(200,100,100,0.1)",
          color: "#c86464",
          border: "none",
          padding: "0.6rem",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        <X size={16} /> Reject
      </button>
    )}
  </>
)}

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--white)",
              padding: "2rem",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "1rem" }}>Reject Submission</h2>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "2px solid #eee",
                marginBottom: "1rem",
                minHeight: "100px",
              }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => handleReject(showRejectModal)}
                style={{
                  flex: 1,
                  background: "#c86464",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.8rem",
                }}
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(null)
                  setRejectionReason("")
                }}
                style={{
                  flex: 1,
                  background: "var(--light-gray)",
                  borderRadius: "8px",
                  border: "none",
                  padding: "0.8rem",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Vehicle Details Modal */}
{showDetails && selectedSubmission && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "var(--white)",
        padding: "2rem",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "100vh",
overflowY: "auto"
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>
        {selectedSubmission.name}
      </h2>

      <img
        src={selectedSubmission.image}
        alt={selectedSubmission.name}
        style={{
          width: "100%",
          height: "300px",
          borderRadius: "8px",
          objectFit: "cover",
          marginBottom: "1rem",
        }}
      />

     <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginTop: "1rem",
  }}
>
  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Owner</span>
    <p style={{ fontWeight: "600" }}>{selectedSubmission.ownerName}</p>
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Phone</span>
    <p style={{ fontWeight: "600" }}>{selectedSubmission.phone}</p>
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Fuel Type</span>
    <p>{selectedSubmission.fuel}</p>
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Price Per Day</span>
    <p>₹{selectedSubmission.pricePerDay}</p>
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Location</span>
    <p>{selectedSubmission.location}</p>
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Status</span>
    <p>{selectedSubmission.reviewStatus}</p>
  </div>

  {/* Documents */}
  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>RC Book</span>
    {selectedSubmission.rcBook ? (
      <a href={selectedSubmission.rcBook} target="_blank" style={{ color: "blue" }}>
        View RC Book
      </a>
    ) : (
      <p>Not Provided</p>
    )}
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Insurance</span>
    {selectedSubmission.insurance ? (
      <a href={selectedSubmission.insurance} target="_blank" style={{ color: "blue" }}>
        View Insurance
      </a>
    ) : (
      <p>Not Provided</p>
    )}
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Pollution</span>
    {selectedSubmission.pollution ? (
      <a href={selectedSubmission.pollution} target="_blank" style={{ color: "blue" }}>
        View PU Certificate
      </a>
    ) : (
      <p>Not Provided</p>
    )}
  </div>

  <div>
    <span style={{ color: "#999", fontSize: "0.85rem" }}>Vehicle Permit</span>
    {selectedSubmission.vehiclePermit ? (
      <a href={selectedSubmission.vehiclePermit} target="_blank" style={{ color: "blue" }}>
        View Permit
      </a>
    ) : (
      <p>Not Provided</p>
    )}
  </div>
</div>


      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
        <div>
          <span style={{ color: "#999", fontSize: "0.85rem" }}>Owner</span>
          <p style={{ fontWeight: "600" }}>{selectedSubmission.ownerName || "N/A"}</p>
        </div>
        <div>
          <span style={{ color: "#999", fontSize: "0.85rem" }}>Phone</span>
          <p style={{ fontWeight: "600" }}>{selectedSubmission.phone || "N/A"}</p>
        </div>
      </div>

      <button
        onClick={() => setShowDetails(false)}
        style={{
          marginTop: "1.5rem",
          background: "var(--light-gray)",
          border: "none",
          borderRadius: "8px",
          padding: "0.8rem 1.5rem",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  )
}
