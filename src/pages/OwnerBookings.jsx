"use client"

import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Car, MapPin, Calendar, Clock, CheckCircle, XCircle, User } from "lucide-react"
import { API_URL } from "../config/api"

export default function OwnerBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [showAcceptedModal, setShowAcceptedModal] = useState(false) // ⭐ NEW MODAL STATE

  // Memoized userInfo
  const userInfo = useMemo(() => {
    return JSON.parse(localStorage.getItem("userInfo"))
  }, [])

  const token = userInfo?.token
  const role = userInfo?.role

  // ============================================
  //   FETCH OWNER BOOKINGS
  // ============================================
  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    if (role !== "owner") {
      navigate("/")
      return
    }

    const fetchOwnerBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/bookings/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Failed to fetch bookings")

        setBookings(data)
      } catch (err) {
        setMessage("Failed to load bookings.")
      } finally {
        setLoading(false)
      }
    }

    fetchOwnerBookings()
  }, [token, role, navigate])

  // ============================================
  //   UPDATE BOOKING STATUS
  // ============================================
  const handleStatusUpdate = async (id, status) => {
    const reason =
      status === "rejected" ? prompt("Enter rejection reason (optional):") : null

    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, rejectedReason: reason }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to update booking")

      // Update UI
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status, rejectedReason: reason || "" } : b
        )
      )

      // ⭐ SHOW MODAL FOR ACCEPT
      if (status === "confirmed") {
        setShowAcceptedModal(true)
      } else {
        setMessage("Booking rejected successfully.")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (err) {
      setMessage(err.message)
    }
  }

  // ============================================
  //   LOADING SCREEN
  // ============================================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary-orange)",
          fontWeight: "700",
          fontSize: "1.2rem",
        }}
      >
        Loading bookings...
      </div>
    )
  }

  // ============================================
  //   UI START
  // ============================================
  return (
    <div style={{ background: "var(--light-gray)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
          color: "var(--white)",
          padding: "4rem 2rem 3rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: "800",
            marginBottom: "1rem",
          }}
        >
          Vehicle Owner Bookings
        </h1>
        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.95)" }}>
          Manage all booking requests for your listed vehicles.
        </p>
      </section>

      {/* Message */}
      {message && (
        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            margin: "2rem auto",
            maxWidth: "1200px",
          }}
        >
          {message}
        </div>
      )}

      {/* Booking LIST */}
      <section className="container my-5">
        {bookings.length === 0 ? (
          <div
            className="text-center bg-white p-5 rounded shadow"
            style={{ borderRadius: "12px" }}
          >
            <h3 style={{ color: "#999", marginBottom: "1rem" }}>
              No bookings found for your vehicles.
            </h3>
          </div>
        ) : (
          <div>
            {bookings.map((b, idx) => (
              <div
                key={b._id}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "14px 0",
                  borderBottom: "1px solid #ddd",
                  animation: `slideUp 0.4s ease-out ${idx * 0.05}s both`,
                }}
              >
                {/* Small Image */}
                <img
                  src={b.vehicleId?.image || "/placeholder.svg"}
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />

                {/* MAIN CONTENT */}
                <div style={{ flex: 1 }}>
                  {/* First Line */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      fontSize: "0.9rem",
                      color: "#333",
                    }}
                  >
                    <strong>{b.vehicleId?.name}</strong>
                    <span>• {b.status}</span>
                    <span>• {b.date}</span>
                    <span>• {b.timeSlot}</span>
                    <span>• {b.days} Days</span>
                  </div>

                  {/* Second Line */}
                  <div style={{ fontSize: "0.8rem", color: "#777" }}>
                    {b.vehicleId?.location} • {b.userId?.name || "Customer"}
                  </div>

                  {/* Accept / Reject */}
                  {b.status === "pending" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "8px",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleStatusUpdate(b._id, "confirmed")
                        }
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          borderRadius: "6px",
                          border: "1px solid #2d7d2d",
                          background: "#e6fbe6",
                          color: "#2d7d2d",
                        }}
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(b._id, "rejected")
                        }
                        style={{
                          flex: 1,
                          padding: "6px 0",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          borderRadius: "6px",
                          border: "1px solid #c86464",
                          background: "#ffecec",
                          color: "#c86464",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Rejected Reason */}
                  {b.rejectedReason && (
                    <div
                      style={{
                        marginTop: "8px",
                        background: "#fff5f5",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: "#c86464",
                      }}
                    >
                      Reason: {b.rejectedReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ⭐ ACCEPTED MODAL */}
      {showAcceptedModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "380px",
              borderRadius: "14px",
              padding: "2rem 1.5rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <h3 style={{ fontWeight: "700", marginBottom: "1rem", color: "#333" }}>
              Booking Accepted 🎉
            </h3>

            <p
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "1.5rem",
              }}
            >
              Please <strong>check your email</strong> and{" "}
              <strong>contact the customer</strong> to arrange the pickup.
            </p>

            <button
              onClick={() => setShowAcceptedModal(false)}
              style={{
                background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
                color: "white",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
