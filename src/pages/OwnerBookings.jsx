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
<div
  style={{
    maxWidth: "900px",
    margin: "1.5rem auto 0",
    background: "rgba(255, 255, 255, 1)",
    padding: "1rem 1.4rem",
    borderRadius: "10px",
    backdropFilter: "blur(6px)",
    color: "black",
    fontSize: "0.9rem",
  }}
>
  <strong>Guidelines for Owners:</strong>
  <ul style={{ marginTop: "6px", paddingLeft: "1.2rem" }}>
    <li>Review every booking request carefully.</li>
    <li>If you accept, immediately check your email for customer details.</li>
    <li>Contact the customer directly and decide the pickup location & time.</li>
    <li>If unavailable or invalid, reject with a clear reason.</li>
    <li>Respond quickly — delayed actions may lead to booking cancellation.</li>
  </ul>
</div>

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
<p style={{ fontSize: "0.75rem", color: "#888", marginTop: "4px" }}>
  Accept only if your vehicle is available for the selected date & time.
</p>

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
<div
className="mx-0 mx-md-4"
  style={{
    background: "white",
    padding: "1rem 1.2rem",
    borderRadius: "12px",
    marginBottom: "2rem",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  }}
>
  <details>
    <summary style={{ cursor: "pointer", fontWeight: "600" }}>
      How the booking process works for owners
    </summary>

    <div style={{ marginTop: "0.8rem", color: "#666", fontSize: "0.9rem" }}>
      <p><strong>1. Customer sends a booking request</strong><br />
      The customer selects your vehicle, date, and timeslot.</p>

      <p><strong>2. You decide to Accept or Reject</strong><br />
      If accepted, they receive confirmation. If rejected, provide a reason.</p>

      <p><strong>3. After Accepting</strong><br />
      You must contact them and finalize pickup & return instructions.</p>

      <p><strong>4. On Pickup Day</strong><br />
      Verify the customer's ID, license, and collect required documents.</p>
    </div>
  </details>
</div>

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
            <h3 style={{ fontWeight: "700", marginBottom: "1rem", color: "#15a100ff" }}>
              Booking Accepted 
            </h3>
<p
  style={{
    fontSize: "0.95rem",
    color: "#555",
    marginBottom: "1.5rem",
    lineHeight: "1.5",
    textAlign:"left"
  }}
>
  The booking is now <strong>confirmed</strong>.  
  Please follow the next steps:
  <br /><br />
  1️ Check your email for complete customer details.<br />
  2️ Contact the customer to plan <strong>pickup and drop timings</strong>.<br />
  3️ Verify customer ID before handing over the vehicle.<br />
  4️ Ensure the vehicle is clean and ready for use.
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
