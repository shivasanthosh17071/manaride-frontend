"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Car, CalendarCheck, LogOut, Phone, Mail, User } from "lucide-react"

export default function OwnerAccount() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo"))
    if (!info || info.role !== "owner") {
      navigate("/login")
      return
    }
    setUser(info)
  }, [navigate])

  if (!user) return null

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--light-gray)",
        padding: "2rem 1rem",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "var(--white)",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
          maxWidth: "600px",
          marginInline: "auto",
        }}
      >
        <h2
          style={{
            fontWeight: "800",
            fontSize: "1.8rem",
            background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
          }}
        >
          Owner Profile
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          <p style={{ display: "flex", gap: "0.5rem", color: "#555" }}>
            <User size={18} /> {user.name}
          </p>
          <p style={{ display: "flex", gap: "0.5rem", color: "#555" }}>
            <Mail size={18} /> {user.email}
          </p>
          <p style={{ display: "flex", gap: "0.5rem", color: "#555" }}>
            <Phone size={18} /> {user.mobile}
          </p>
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
        }}
      >
        <div
          style={{
            background: "var(--white)",
            borderRadius: "10px",
            padding: "1.5rem",
            textAlign: "center",
            borderLeft: "4px solid var(--primary-orange)",
            boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Car size={28} color="var(--primary-orange)" />
          <h3 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Your Vehicles</h3>
          <p style={{ color: "#777" }}>Manage your listings</p>
        </div>

        <div
          style={{
            background: "var(--white)",
            borderRadius: "10px",
            padding: "1.5rem",
            textAlign: "center",
            borderLeft: "4px solid var(--primary-orange)",
            boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
          }}
        >
          <CalendarCheck size={28} color="var(--primary-orange)" />
          <h3 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Bookings</h3>
          <p style={{ color: "#777" }}>View all bookings</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => navigate("/owner-dashboard")}
          style={buttonStylePrimary}
        >
          Go to Dashboard
        </button>

        <button
          onClick={() => navigate("/owner-bookings")}
          style={buttonStylePrimary}
        >
          View Bookings
        </button>

        {/* <button
          onClick={() => {
            localStorage.clear()
            navigate("/")
            window.dispatchEvent(new Event("authChanged"))
          }}
          style={buttonStyleDanger}
        >
          <LogOut size={18} /> Logout
        </button> */}
      </div>
    </div>
  )
}

const buttonStylePrimary = {
  background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
  color: "white",
  padding: "1rem",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
}

const buttonStyleDanger = {
  background: "#ffdddd",
  color: "#c33",
  padding: "1rem",
  borderRadius: "10px",
  border: "2px solid #c33",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
}
