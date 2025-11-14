"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { User, Mail, Lock, Phone, Eye, EyeOff, Shield } from "lucide-react"
import { API_URL } from "../config/api"
import "./Auth.css"

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("customer")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const { name, email, mobile, password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword || !mobile) {
      setError("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          role: selectedRole,
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setError(data.message || "Failed to send OTP.")
        return
      }

      setOtpSent(true)
      setSuccess("OTP sent to your email address.")
    } catch (err) {
      console.error(err)
      setError("Server error. Please try again later.")
      setLoading(false)
    }
  }

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!otp) {
      setError("Please enter the OTP.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      })
      const data = await res.json()
      setLoading(false)

      if (!res.ok) {
        setError(data.message || "Invalid OTP.")
        return
      }

      localStorage.setItem("userInfo", JSON.stringify(data))
      setSuccess("Account verified successfully! Redirecting...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      console.error(err)
      setError("OTP verification failed. Please try again.")
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
          maxWidth: "450px",
          animation: "slideUp 0.6s ease-out",
        }}
      >
        {/* Header */}
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
            {otpSent ? "Verify Your Email" : "Join Mana Ride"}
          </h1>
          <p style={{ color: "#999", fontSize: "0.95rem" }}>
            {otpSent
              ? "Enter the 6-digit OTP sent to your email"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Role Selection */}
        {!otpSent && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              marginBottom: "2rem",
              background: "var(--light-gray)",
              padding: "0.5rem",
              borderRadius: "10px",
            }}
          >
            {["customer", "owner"].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  background:
                    selectedRole === role ? "var(--white)" : "transparent",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  color:
                    selectedRole === role
                      ? "var(--primary-orange)"
                      : "#999",
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Alerts */}
        {success && (
          <div
            style={{
              background: "#efe",
              color: "#3a3",
              padding: "0.8rem",
              borderRadius: "8px",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}
          >
            {success}
          </div>
        )}
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

        {/* Forms */}
        {!otpSent ? (
          <form
            onSubmit={handleSendOtp}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <InputField
              label="Full Name"
              name="name"
              icon={<User size={18} />}
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />

            <InputField
              label="Email Address"
              name="email"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
            />

            <InputField
              label="Phone Number"
              name="mobile"
              icon={<Phone size={18} />}
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              type="tel"
            />

            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              show={showPassword}
              setShow={setShowPassword}
              placeholder="Create a strong password"
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              placeholder="Confirm your password"
            />

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
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "var(--dark)",
                }}
              >
                Enter OTP
              </label>
              <Shield
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
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "0.8rem 0.8rem 0.8rem 2.5rem",
                  border: "2px solid #eee",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  letterSpacing: "3px",
                }}
              />
            </div>

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
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </form>
        )}

        {!otpSent && (
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #eee",
            }}
          >
            <span style={{ color: "#666", fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--primary-orange)",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                Sign In
              </Link>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* Reusable Input */
function InputField({ label, name, icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.85rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
          color: "var(--dark)",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--primary-orange)",
          }}
        >
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "0.8rem 0.8rem 0.8rem 2.5rem",
            border: "2px solid #eee",
            borderRadius: "8px",
            fontSize: "0.95rem",
          }}
        />
      </div>
    </div>
  )
}

/* Password Input */
function PasswordField({ label, name, value, onChange, show, setShow, placeholder }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.85rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
          color: "var(--dark)",
        }}
      >
        {label}
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
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "0.8rem 2.5rem 0.8rem 2.5rem",
            border: "2px solid #eee",
            borderRadius: "8px",
            fontSize: "0.95rem",
          }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
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
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}
