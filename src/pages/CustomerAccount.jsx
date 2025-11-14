"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Phone, Heart, CalendarCheck, LogOut } from "lucide-react"

export default function CustomerAccount() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo"))
    if (!info || info.role !== "customer") {
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
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "var(--white)",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontWeight: "800",
            fontSize: "1.8rem",
            background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Customer Profile
        </h2>

        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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

      {/* Options */}
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
          onClick={() => navigate("/my-bookings")}
          style={buttonStylePrimary}
        >
          <CalendarCheck size={18} /> My Bookings
        </button>

        <button
          onClick={() => navigate("/favourites")}
          style={buttonStylePrimary}
        >
          <Heart size={18} /> Saved Vehicles
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
  background: "white",
  border: "2px solid var(--primary-orange)",
  color: "var(--primary-orange)",
  padding: "1rem",
  borderRadius: "10px",
  fontWeight: "700",
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
  cursor: "pointer",
}

const buttonStyleDanger = {
  background: "#ffdddd",
  color: "#c33",
  padding: "1rem",
  borderRadius: "10px",
  border: "2px solid #c33",
  fontWeight: "700",
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
  cursor: "pointer",
}
