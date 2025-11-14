"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Car, MapPin, Calendar, Clock, CheckCircle, XCircle, User } from "lucide-react"
import { API_URL } from "../config/api"

export default function OwnerBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [selectedBooking, setSelectedBooking] = useState(null)

  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const token = userInfo?.token

  // ✅ Fetch all bookings for owner's vehicles
 useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  // ❌ If not owner → redirect to home
  if (userInfo.role !== "owner") {
    navigate("/");
    return;
  }

  const fetchOwnerBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings/owner`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch bookings");

      setBookings(data);
    } catch (err) {
      setMessage("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  fetchOwnerBookings();
}, [token, navigate, userInfo]);

  // ✅ Update booking status (accept/reject)
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

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status, rejectedReason: reason || "" } : b
        )
      )

      setMessage(`Booking ${status === "confirmed" ? "accepted" : "rejected"} successfully.`)
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
        Loading bookings...
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
          Vehicle Owner Bookings
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.95)",
            zIndex: 2,
            position: "relative",
          }}
        >
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

      {/* Booking Cards */}
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
    <div className="row g-4">
      {bookings.map((b, idx) => (
        <div key={b._id} className="col-12 col-md-6 col-lg-4">
          <div
            className="card h-100 border-0 shadow"
            style={{
              borderRadius: "15px",
              transition: "0.3s",
              animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)"
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(255, 111, 0, 0.25)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"
            }}
          >
            {/* Image */}
            <div className="position-relative">
              <img
                src={b.vehicleId?.image || "/placeholder.svg"}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                alt="vehicle"
              />

              {/* Status badge */}
              <span
                className="position-absolute top-0 end-0 m-2 px-3 py-1 fw-bold"
                style={{
                  borderRadius: "20px",
                  fontSize: "0.9rem",
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
                      ? "#999"
                      : "#d4a500",
                }}
              >
                {b.status}
              </span>
            </div>

            {/* Content */}
            <div className="card-body">
              <h5 className="card-title fw-bold">{b.vehicleId?.name}</h5>

              <p className="text-muted small mb-2 d-flex align-items-center">
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

              <div className="d-flex align-items-center text-muted small mb-3">
                <User size={16} className="me-2" />
                {b.userId?.name || "Customer"}
              </div>

              {/* Rejected reason */}
              {b.rejectedReason && (
                <p className="p-2 rounded" style={{ background: "#fff5f5", color: "#c86464" }}>
                  Reason: {b.rejectedReason}
                </p>
              )}

              {/* Action buttons */}
              {b.status === "pending" && (
                <div className="d-flex gap-2 mt-3">
                  <button
                    onClick={() => handleStatusUpdate(b._id, "confirmed")}
                    className="btn w-50 fw-bold"
                    style={{
                      background: "#e6fbe6",
                      color: "#2d7d2d",
                      border: "1px solid #2d7d2d",
                    }}
                  >
                    <CheckCircle size={16} className="me-1" /> Accept
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(b._id, "rejected")}
                    className="btn w-50 fw-bold"
                    style={{
                      background: "#fff3f3",
                      color: "#c86464",
                      border: "1px solid #c86464",
                    }}
                  >
                    <XCircle size={16} className="me-1" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

    </div>
  )
}
