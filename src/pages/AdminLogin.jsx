"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { API_URL } from "../config/api"
import "./Auth.css"

export default function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: "admin", // ⭐ Only admin
        }),
      })

      const data = await response.json()
      setLoading(false)

      if (!response.ok) {
        setError(data.message || "Invalid email or password")
        return
      }

      localStorage.setItem("userInfo", JSON.stringify(data))
      window.dispatchEvent(new Event("authChanged"))

      // ⭐ Admin redirect
      window.location.replace("/admin-dashboard")

    } catch (err) {
      console.error(err)
      setError("Server error, please try again later.")
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      className="auth-page"
    >
      <div
        style={{
          background: "var(--white)",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "400px",
          animation: "slideUp 0.6s ease-out",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem",
            }}
          >
            Admin Login
          </h1>
          <p style={{ color: "#999", fontSize: "0.95rem" }}>Sign in to manage Mana Ride</p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee",
              color: "#c33",
              padding: "0.8rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {/* Email */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--primary-orange)",
                }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                style={{
                  width: "100%",
                  padding: "0.8rem 0.8rem 0.8rem 2.5rem",
                  border: "2px solid #eee",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--primary-orange)",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter admin password"
                style={{
                  width: "100%",
                  padding: "0.8rem 2.5rem 0.8rem 2.5rem",
                  border: "2px solid #eee",
                  borderRadius: "8px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
              color: "var(--white)",
              border: "none",
              padding: "1rem",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Go Back */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            borderTop: "1px solid #eee",
            paddingTop: "1.5rem",
          }}
        >
          <span style={{ color: "#666", fontSize: "0.9rem" }}>
            Not an admin?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--primary-orange)",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Go Back
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
