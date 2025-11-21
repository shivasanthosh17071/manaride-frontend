"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  MapPin,
  Phone,
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import VehicleCard from "../components/VehicleCard"
import { API_URL } from "../config/api"

export default function VehicleDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [relatedVehicles, setRelatedVehicles] = useState([])
  const [currentImageIdx, setCurrentImageIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  // Booking modal state
  const [showBooking, setShowBooking] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false) // <-- new
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    timeSlot: "",
    days: 1,
    notes: "",
    agree: false,
    ageConfirm: false,
  })

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ]

  // Mobile detection (used to reorder content on mobile)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
const userDataFromLocalStorage = localStorage.getItem("userInfo")
 const userInfo = JSON.parse(userDataFromLocalStorage)

  // Prefill user info
  useEffect(() => {
    const raw = localStorage.getItem("userInfo")
    if (raw) {
      try {
        const userInfo = JSON.parse(raw)
        setForm((f) => ({
          ...f,
          name: userInfo.name || "",
          email: userInfo.email || "",
          phone: userInfo.mobile || "",
        }))
      } catch {}
    }
  }, [])

  // FETCH VEHICLE & RELATED
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/vehicles/${id}`)
        const data = await res.json()
        if (res.ok) {
          setVehicle(data)

          // Fetch related vehicles same type
          const relatedRes = await fetch(
            `${API_URL}/vehicles?type=${encodeURIComponent(data.type)}`
          )
          const relatedData = await relatedRes.json()
          setRelatedVehicles(relatedData.filter((v) => v._id !== data._id))
        } else {
          setVehicle(null)
        }
      } catch (err) {
        console.error("Failed to fetch:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchVehicle()
  }, [id])

  // --------- ROLE CHECK: OWNER CANNOT BOOK OWN VEHICLE ----------
  const rawUser = localStorage.getItem("userInfo")
  let loggedUser = null
  let isOwnerViewingOwnVehicle = false

  if (rawUser && vehicle) {
    try {
      loggedUser = JSON.parse(rawUser)

      const loggedId = loggedUser?._id
      const ownerId =
        vehicle.ownerId ||
        vehicle.ownerId?._id ||
        vehicle.owner?._id ||
        vehicle.owner

      isOwnerViewingOwnVehicle =
        loggedUser.role === "owner" && String(ownerId) === String(loggedId)
    } catch {}
  }

  // WhatsApp booking
  const handleWhatsAppBooking = () => {
    if (!vehicle?.phone) return
    const message = `Hi, I'm interested in booking the ${vehicle.name}. Please share availability.`
    const whatsappUrl = `https://wa.me/${vehicle.phone}?text=${encodeURIComponent(
      message
    )}`
    window.open(whatsappUrl, "_blank")
  }

  // Carousel handlers
  const handlePrevImage = () =>
    setCurrentImageIdx((prev) => Math.max(prev - 1, 0))
  const handleNextImage = () =>
    setCurrentImageIdx((prev) =>
      vehicle && vehicle.images ? Math.min(prev + 1, vehicle.images.length - 1) : prev + 1
    )

  // OPEN BOOKING MODAL
  const openBooking = () => {
    const raw = localStorage.getItem("userInfo")
    if (!raw) {
      setBookingMessage("Please login to reserve a vehicle.")
      navigate("/login")
      return
    }

    try {
      const userInfo = JSON.parse(raw)
      setForm((f) => ({
        ...f,
        name: userInfo.name || f.name,
        email: userInfo.email || f.email,
        phone: userInfo.mobile || f.phone,
      }))
    } catch {}

    setShowBooking(true)
  }

  // SUBMIT BOOKING
  const submitBooking = async (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setBookingMessage("Please fill name, email and phone.")
      return
    }
    if (!form.date) return setBookingMessage("Please choose a date.")
    if (!form.timeSlot) return setBookingMessage("Please choose a time slot.")
    if (!form.agree) return setBookingMessage("Please accept the terms and conditions.")
    if (!form.ageConfirm) return setBookingMessage("You must confirm that you are 18+.")

    const raw = localStorage.getItem("userInfo")
    if (!raw) return setBookingMessage("Please login again.")

    let userInfo
    try {
      userInfo = JSON.parse(raw)
    } catch {
      return setBookingMessage("Invalid session. Please login.")
    }

    const token = userInfo?.token
    if (!token) return setBookingMessage("Authentication error.")

    try {
      setBookingLoading(true)
      const payload = {
        vehicleId: vehicle._id,
        ownerId: vehicle.ownerId || vehicle.ownerId?._id || vehicle.owner,
        userId: userInfo._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        timeSlot: form.timeSlot,
        days: Number(form.days) || 1,
        notes: form.notes,
      }

      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Booking failed")

      // Close booking form and show success modal
      setShowBooking(false)
      setShowSuccessModal(true)
      setBookingMessage("")
    } catch (err) {
      setBookingMessage(err.message || "Booking failed")
    } finally {
      setBookingLoading(false)
    }
  }

  // Show loading screen while fetching
  if (loading) {
    return (
      <div className="vd-loading">
        Loading vehicle details...
      </div>
    )
  }

  // Not found case
  if (!vehicle) {
    return (
      <div className="vd-notfound">
        <div className="vd-notfound-card">
          <h2>Vehicle Not Found</h2>
          <button
            onClick={() => navigate("/search")}
            className="vd-button-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    )
  }

  // Helper: image source fallback handling (support vehicle.images array or vehicle.image)
  const mainImage =
    (vehicle.images && vehicle.images.length && vehicle.images[currentImageIdx]) ||
    vehicle.image ||
    "/placeholder.svg"

  return (
    <div className="vd-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <button onClick={() => navigate(-1)} className="breadcrumb-back">
          <ArrowLeft size={18} /> Back
        </button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{vehicle.name}</span>
      </div>

      {/* Main container: desktop 2-col, mobile becomes stacked */}
      <div
        className="vehicle-details-container"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
        }}
      >
        {/* If mobile: show image first */}
        {isMobile && (
          <div className="left-column">
            <div className="image-card">
              <img src={mainImage} alt={vehicle.name} className="vehicle-main-image" />
              <div
                className="status-badge"
                style={{
                  background:
                    vehicle.status === "Available" ? "var(--primary-orange)" : "#999",
                }}
              >
                {vehicle.status}
              </div>

              <button onClick={handlePrevImage} style={navArrowStyle("left")} className="nav-arrow">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNextImage} style={navArrowStyle("right")} className="nav-arrow">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="specs-card">
              <h3>Vehicle Specifications</h3>
              <div className="specs-grid">
                {[ 
                  { label: "Vehicle Type", value: vehicle.type },
                  { label: "Fuel Type", value: vehicle.fuel },
                  { label: "Price / Day", value: `₹${vehicle.pricePerDay}` },
                  { label: "Location", value: vehicle.location },
                ].map((spec) => (
                  <div key={spec.label} className="spec-item">
                    <span className="spec-label">{spec.label}</span>
                    <br />
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT column on desktop; on mobile it appears after image/specs */}
        <div className="right-column">
          {/* Title + Price */}
          <h1 className="vehicle-title">{vehicle.name}</h1>

          <div className="price-row">
            <span className="vehicle-price">₹{vehicle.pricePerDay}</span>
            <span className="price-sub">per day</span>
          </div>

          <div className="vehicle-location">
            <MapPin size={18} /> <span>{vehicle.location}</span>
          </div>

          <p className="vehicle-desc">{vehicle.description}</p>

          {isOwnerViewingOwnVehicle && (
            <div className="owner-note">
              <strong>Note:</strong> You cannot reserve vehicle from Owners account.
            </div>
          )}

          {/* Booking Buttons */}
          {userInfo?.role !== "owner" && vehicle.status === "Available" && (
            <div className="book-buttons" style={{ display: "flex", gap: 12 }}>
              <button
                // onClick={handleWhatsAppBooking}
                style={{
                  background: "transparent",
                  color: "#333",
                  border: "2px solid #ddd",
                  padding: "0.75rem 1.2rem",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                disabled
              >
                <MessageCircle size={18} /> Book via WhatsApp
              </button>

              <button onClick={openBooking} className="vd-button-primary icon-btn" style={{ padding: "0.75rem 1.4rem" }}>
                Reserve Now
              </button>
            </div>
          )}
          { vehicle.status !== "Available" && (
            <div className="vehicle-unavailable-msg">
              <p style={{ color: "#c33", fontWeight: "600" }}>
                This vehicle is currently booked.
              </p>
            </div>
          )}

          {/* Owner Info */}
          <div className="owner-box">
            <h3>Owner Information</h3>
            <div className="owner-details" style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div>
                <span className="spec-label">Name</span>
                <br />
                <strong>{vehicle.ownerName || "N/A"}</strong>
              </div>

              <div>
                <span className="spec-label">Phone</span>
                <br />

                <a
                  href={`tel:${vehicle.phone}`}
                  className="owner-phone"
                  style={{ textDecoration: "none", color: "inherit", display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <Phone size={16} />
                  {"*****" + (vehicle.phone ? vehicle.phone.slice(-4) : "")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* If desktop: show image/specs in left column (preserve desktop layout) */}
        {!isMobile && (
          <div className="left-column">
            <div className="image-card">
              <img src={mainImage} alt={vehicle.name} className="vehicle-main-image" />
              <div
                className="status-badge"
                style={{
                  background:
                    vehicle.status === "Available" ? "var(--primary-orange)" : "#999",
                }}
              >
                {vehicle.status}
              </div>

              <button onClick={handlePrevImage} style={navArrowStyle("left")} className="nav-arrow">
                <ChevronLeft size={20} />
              </button>
              <button onClick={handleNextImage} style={navArrowStyle("right")} className="nav-arrow">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="specs-card">
              <h3>Vehicle Specifications</h3>
              <div className="specs-grid">
                {[
                  { label: "Vehicle Type", value: vehicle.type },
                  { label: "Fuel Type", value: vehicle.fuel },
                  { label: "Price / Day", value: `₹${vehicle.pricePerDay}` },
                  { label: "Location", value: vehicle.location },
                ].map((spec) => (
                  <div key={spec.label} className="spec-item">
                    <span className="spec-label">{spec.label}</span>
                    <br />
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RELATED VEHICLES */}
      {relatedVehicles.length > 0 && (
        <section className="related-section">
          <div className="related-inner">
            <h2>Similar {vehicle.type}s</h2>
            <div className="related-grid">
              {relatedVehicles.map((v, idx) => (
                <div key={v._id} style={{ animation: `slideUp 0.6s ease-out ${idx * 0.1}s both` }}>
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOOKING MODAL */}
      {showBooking && (
        <div className="booking-overlay" onClick={() => setShowBooking(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Reserve {vehicle.name}</h2>

            <form onSubmit={submitBooking} className="booking-form">
              <div className="row-2">
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row-2">
                <div>
                  <label>Mobile</label>
                  <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  maxLength="10"
  value={form.phone}
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, ""); // removes non-numbers
    setForm({ ...form, phone: onlyNumbers });
  }}
  required
/>

                </div>

                <div>
                  <label>Pick a date</label>
                <input
  type="date"
  min={new Date().toISOString().split("T")[0]}   // ⬅️ This blocks past dates
  value={form.date}
  onChange={(e) => setForm({ ...form, date: e.target.value })}
  required
/>

                </div>
              </div>

              <div className="row-2">
                <div>
                  <label>Time slot</label>
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    required
                  >
                    <option value="">Pick a time</option>
                    {timeSlots.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Days</label>
                  <input
                    type="number"
                    min="1"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label>Extra Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special requests"
                />
              </div>

              <div className="checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                  />{" "}
                  I agree to terms & conditions
                </label>
              </div>

              <div className="checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={form.ageConfirm}
                    onChange={(e) => setForm({ ...form, ageConfirm: e.target.checked })}
                  />{" "}
                  I confirm I am 18+ years old
                </label>
              </div>

              {bookingMessage && <div className="booking-msg">{bookingMessage}</div>}

              <div className="row-2" style={{ marginTop: 12 }}>
                <button type="submit" className="vd-button-primary" disabled={bookingLoading}>
                  {bookingLoading ? "Submitting..." : "Submit Reservation"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowBooking(false)
                    setBookingMessage("")
                  }}
                  className="vd-button-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL AFTER BOOKING */}
      {showSuccessModal && (
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
              maxWidth: "360px",
              borderRadius: "14px",
              padding: "2rem 1.5rem",
              textAlign: "center",
              animation: "slideUp 0.3s ease-out",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontWeight: "700", marginBottom: "1rem" }}>
              Booking Submitted!
            </h2>

            <p style={{ color: "#555", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Please <strong>check your email</strong>. When the vehicle owner accepts your booking,
              you will receive the pickup details and the owner's contact number.
            </p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setShowSuccessModal(false)}
                style={{
                  background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.4rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                OK
              </button>

              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate("/my-bookings")
                }}
                style={{
                  background: "transparent",
                  color: "#333",
                  border: "1px solid #ddd",
                  padding: "0.75rem 1.2rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Arrow styling (kept as inline style generator)
function navArrowStyle(side) {
  return {
    position: "absolute",
    [side]: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.9)",
    border: "none",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  }
}
