"use client"

import { useNavigate } from "react-router-dom"
import { MapPin, Fuel, Users } from "lucide-react"
import "./VehicleCard.css"

export default function VehicleCard({ vehicle }) {
  // console.log(vehicle)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/vehicle/${vehicle._id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="vehicle-card"
      style={{
        background: "var(--white)",
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        animation: "cardPop 0.6s ease-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)"
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(255, 111, 0, 0.4)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
      }}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img
          src={vehicle.image || "/placeholder.svg"}
          alt={vehicle.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: vehicle.status === "Available" ? "var(--primary-orange)" : "#999",
            color: "var(--white)",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: "600",
          }}
        >
          {vehicle.status}
        </div>
      </div>

      <div style={{ padding: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1.2rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
            color: "var(--dark)",
          }}
        >
          {vehicle.name}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#666",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          <MapPin size={16} />
          {vehicle.location}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            marginBottom: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Fuel size={14} />
            {vehicle.fuel}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Users size={14} />
            {vehicle.seating} Seater
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #eee",
            paddingTop: "1rem",
          }}
        >
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ₹{vehicle.pricePerDay}
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              color: "#999",
            }}
          >
            per day
          </span>
        </div>
      </div>
    </div>
  )
}
