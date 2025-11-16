"use client"

import { Link } from "react-router-dom"
import { Instagram, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--dark)",
        color: "var(--white)",
        padding: "3rem 2rem 1.5rem",
        borderTop: "3px solid var(--primary-orange)",
        marginTop: "4rem",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h4
            style={{
              background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "1rem",
            }}
          >
            Mana Ride
          </h4>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            Your trusted vehicle booking platform with verified owners and real-time availability.
          </p>
        </div>

        <div>
          <h5 style={{ marginBottom: "1rem", color: "var(--primary-orange)" }}>Quick Links</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link to="/" style={{ color: "var(--white)", textDecoration: "none", fontSize: "0.9rem" }}>
              Home
            </Link>
            <Link to="/search" style={{ color: "var(--white)", textDecoration: "none", fontSize: "0.9rem" }}>
              Browse
            </Link>
            <Link to="/login" style={{ color: "var(--white)", textDecoration: "none", fontSize: "0.9rem" }}>
              Login
            </Link>
          </div>
        </div>

        <div>
          <h5 style={{ marginBottom: "1rem", color: "var(--primary-orange)" }}>For Owners</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link to="/login" style={{ color: "var(--white)", textDecoration: "none", fontSize: "0.9rem" }}>
              List Vehicle
            </Link>
            <Link to="/owner-dashboard" style={{ color: "var(--white)", textDecoration: "none", fontSize: "0.9rem" }}>
              Dashboard
            </Link>
            <a
              href="mailto:owner@Mana Ride.com"
              style={{ color: "var(--white)", textDecoration: "none", fontSize: "0.9rem" }}
            >
              Contact
            </a>
          </div>
        </div>

        <div>
          <h5 style={{ marginBottom: "1rem", color: "var(--primary-orange)" }}>Follow Us</h5>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a
              href="https://www.instagram.com/manaride.in/" target="_blank"
              style={{ color: "var(--primary-orange)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.target.style.transform = "rotate(20deg)")}
              onMouseLeave={(e) => (e.target.style.transform = "rotate(0)")}
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              style={{ color: "var(--primary-orange)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.target.style.transform = "rotate(20deg)")}
              onMouseLeave={(e) => (e.target.style.transform = "rotate(0)")}
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              style={{ color: "var(--primary-orange)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.target.style.transform = "rotate(20deg)")}
              onMouseLeave={(e) => (e.target.style.transform = "rotate(0)")}
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>

     <div
  style={{
    borderTop: "1px solid rgba(255, 111, 0, 0.3)",
    padding: "1.5rem 1rem",
    textAlign: "center",
    fontSize: "0.9rem",
    opacity: 0.8,
    lineHeight: "1.6",
  }}
>
  <p style={{ margin: 0 }}>
    © 2025 <strong>Mana Ride</strong>. All rights reserved.
  </p>

  <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem" }}>
    Developed by{" "}
    <a
      href="https://santhoshdev.space"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "var(--primary-orange)",
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      santhosh
    </a>
  </p>
</div>

    </footer>
  )
}
