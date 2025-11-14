"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Clock, MapPin, Car, Calendar, XCircle, CheckCircle } from "lucide-react"
import { API_URL } from "../config/api"

export default function MyBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const token = userInfo?.token

  // ✅ Fetch bookings
  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/bookings/me`, {
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

    fetchBookings()
  }, [token, navigate])

  // ✅ Cancel booking
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return
    try {
      const res = await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to cancel booking")

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      )
      setMessage("Booking cancelled successfully.")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage(err.message)
    }
  }

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
        Loading your bookings...
      </div>
    )
  }

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
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "250px",
            height: "250px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: "800",
            marginBottom: "1rem",
            zIndex: 2,
            position: "relative",
          }}
        >
          My Vehicle Bookings
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.95)",
            zIndex: 2,
            position: "relative",
          }}
        >
          Manage your active and past bookings with ease.
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

      {/* Bookings Section */}
   <section className="container my-5">
  {bookings.length === 0 ? (
    <div className="text-center bg-white p-5 rounded shadow">
      <h3 className="text-muted mb-3">You have no bookings yet.</h3>
      <button
        onClick={() => navigate("/search")}
        className="btn"
        style={{
          background: "var(--primary-orange)",
          color: "#fff",
          borderRadius: "8px",
          padding: "0.8rem 1.5rem",
          fontWeight: "600",
        }}
      >
        Browse Vehicles
      </button>
    </div>
  ) : (
    <div className="row g-4">
      {bookings.map((b, idx) => (
        <div key={b._id} className="col-12 col-md-6 col-lg-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "14px",
              transition: "0.3s",
              animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)"
              e.currentTarget.style.boxShadow =
                "0 14px 35px rgba(255,111,0,0.25)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"
            }}
          >
            {/* Image */}
            <div className="position-relative">
              <img
                src={b.vehicleId?.image}
                alt="Vehicle"
                className="card-img-top"
                style={{
                  height: "220px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Status Badge */}
              <span
                className="position-absolute top-0 end-0 m-2 px-3 py-1 fw-bold"
                style={{
                  fontSize: "0.85rem",
                  borderRadius: "20px",
                  background:
                    b.status === "confirmed"
                      ? "#d4f8d4"
                      : b.status === "rejected"
                      ? "#fdd8d8"
                      : b.status === "cancelled"
                      ? "#eee"
                      : "#fff3cd",
                  color:
                    b.status === "confirmed"
                      ? "#2d7d2d"
                      : b.status === "rejected"
                      ? "#c86464"
                      : b.status === "cancelled"
                      ? "#777"
                      : "#d4a500",
                }}
              >
                {b.status}
              </span>
            </div>

            {/* Details */}
            <div className="card-body">
              <h5 className="fw-bold mb-1">{b.vehicleId?.name}</h5>

              <p className="text-muted small d-flex align-items-center mb-3">
                <Car size={16} className="me-2" />
                {b.vehicleId?.type} • ₹{b.vehicleId?.pricePerDay}/day
              </p>

              <div className="row text-muted small mb-3">
                <div className="col-6 mb-2">
                  <Calendar size={16} className="me-1" />
                  {b.date}
                </div>

                <div className="col-6 mb-2">
                  <Clock size={16} className="me-1" />
                  {b.timeSlot}
                </div>

                <div className="col-6 mb-2">
                  <MapPin size={16} className="me-1" />
                  {b.vehicleId?.location}
                </div>

                <div className="col-6 mb-2">Days: {b.days}</div>
              </div>

              {b.notes && (
                <p className="p-2 rounded small" style={{ background: "var(--light-gray)" }}>
                  Note: {b.notes}
                </p>
              )}

              {/* Buttons */}
              {b.status === "pending" && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="btn w-100 fw-bold mt-3"
                  style={{
                    background: "#fff3f3",
                    border: "1px solid #c86464",
                    color: "#c86464",
                    borderRadius: "8px",
                    padding: "0.8rem",
                    transition: "0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#c86464"
                    e.currentTarget.style.color = "white"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff3f3"
                    e.currentTarget.style.color = "#c86464"
                  }}
                >
                  <XCircle size={16} className="me-2" />
                  Cancel Booking
                </button>
              )}

              {b.status === "confirmed" && (
                <button
                  className="btn w-100 fw-bold mt-3"
                  style={{
                    background: "#e6fbe6",
                    border: "1px solid #2d7d2d",
                    color: "#2d7d2d",
                    borderRadius: "8px",
                    padding: "0.8rem",
                  }}
                >
                  <CheckCircle size={16} className="me-2" />
                  Confirmed
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>


      {/* CTA Footer */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
          padding: "3rem 2rem",
          textAlign: "center",
          color: "var(--white)",
          marginTop: "4rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "800",
            marginBottom: "1rem",
          }}
        >
          Ready for your next ride?
        </h2>
        <p style={{ marginBottom: "2rem", color: "rgba(255,255,255,0.9)" }}>
          Discover verified vehicles near you and book instantly.
        </p>
        <button
          onClick={() => navigate("/search")}
          style={{
            background: "var(--white)",
            color: "var(--primary-orange)",
            border: "none",
            padding: "1rem 2.5rem",
            borderRadius: "var(--border-radius)",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          Explore More Vehicles
        </button>
      </section>
    </div>
  )
}
