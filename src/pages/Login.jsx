"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { API_URL } from "../config/api"
import "./Auth.css"
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  // ⭐ ONLY customer + owner (admin removed)
  const [selectedRole, setSelectedRole] = useState("customer")

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: selectedRole, // only customer or owner
        }),
      })

      const data = await response.json()
      setLoading(false)

      if (!response.ok) {
        setError(data.message || "Invalid email or password")
        return
      }

      // Save user
      localStorage.setItem("userInfo", JSON.stringify(data))
      window.dispatchEvent(new Event("authChanged"))

      // ⭐ ADMIN REMOVED
      if (data.role === "owner") {
        window.location.replace("/owner-dashboard")
      } else {
        window.location.replace("/")
      }

    } catch (err) {
      console.error(err)
      setError("Server error, please try again later.")
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (response) => {
    try {
      const result = await fetch(`${API_URL}/users/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: response.credential,
          role: selectedRole, // only customer or owner
        }),
      })

      const data = await result.json()

      if (!result.ok) {
        setError(data.message || "Google login failed")
        return
      }

      localStorage.setItem("userInfo", JSON.stringify(data))
      window.dispatchEvent(new Event("authChanged"))

      // ⭐ ADMIN REMOVED
      if (data.role === "owner") {
        window.location.replace("/owner-dashboard")
      } else {
        window.location.replace("/")
      }

    } catch (err) {
      setError("Google login error")
    }
  }

return (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{
      minHeight: "100vh",
      background: `url("https://plus.unsplash.com/premium_photo-1681487916420-8f50a06eb60e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D") center/cover no-repeat`,
      padding: "1rem",
    }}
  >
    <div
      className="shadow-lg p-4 p-md-5 bg-white rounded-4"
      style={{
        width: "100%",
        maxWidth: "380px",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(23, 17, 17, 0.85)",
        animation: "fadeInUp 0.6s ease",
      }}
    >
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2
          style={{
            fontWeight: "800",
            background: "linear-gradient(90deg, var(--primary-orange), var(--accent-amber))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back
        </h2>
        <p className="text-muted small">Login to your Mana Ride account</p>
      </div>

      {/* ROLE SWITCH */}
      <div className="d-flex gap-2 p-1 rounded-pill mb-4" style={{ background: "#f9f9f9" }}>
        {["customer", "owner"].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className="flex-grow-1 py-2 rounded-pill border-0 fw-semibold"
            style={{
              background: selectedRole === role ? "white" : "transparent",
              color: selectedRole === role ? "var(--primary-orange)" : "#888",
              fontSize: "0.85rem",
              boxShadow:
                selectedRole === role ? "0 0 10px rgba(0,0,0,0.08)" : "none",
              transition: "0.2s",
            }}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-danger small py-2">{error}</div>}

      {/* FORM */}
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        {/* Email */}
        <div>
          <label className="small fw-semibold mb-1">Email</label>
          <div className="position-relative">
            <Mail
              size={18}
              className="position-absolute"
              style={{
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
              placeholder="you@example.com"
              className="form-control ps-5 py-2 rounded-3"
              style={{ border: "2px solid #eee" }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="small fw-semibold mb-1">Password</label>
          <div className="position-relative">
            <Lock
              size={18}
              className="position-absolute"
              style={{
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
              placeholder="Enter your password"
              className="form-control ps-5 pe-5 py-2 rounded-3"
              style={{ border: "2px solid #eee" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute bg-transparent border-0"
              style={{
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn fw-bold py-2 rounded-3"
          style={{
            background: "linear-gradient(135deg, var(--primary-orange), var(--accent-amber))",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Google Login */}
      <div className="text-center mt-3">
        <GoogleLogin
          onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse)}
          onError={() => console.log("Google Login Failed")}
        />
      </div>

      {/* Sign Up Link */}
      <div className="text-center mt-4 pt-3 border-top">
        <p className="small mb-0">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="fw-bold"
            style={{ color: "var(--primary-orange)", textDecoration: "none" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </div>
)

}
