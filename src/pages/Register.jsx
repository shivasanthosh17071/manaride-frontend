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
    className="d-flex align-items-center justify-content-center"
    style={{
      minHeight: "100vh",
      background: `url("https://plus.unsplash.com/premium_photo-1681433426886-3d6d17f79d53?q=80&w=829&auto=format&fit=crop") center/cover no-repeat`,
      padding: "1rem",
    }}
  >
    <div
      className="p-4 p-md-5 rounded-4 shadow-lg"
      style={{
        width: "100%",
        maxWidth: "395px",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
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
          {otpSent ? "Verify Email" : "Create an Account"}
        </h2>

        <p className="text-muted small">
          {otpSent
            ? "Enter the 6-digit OTP sent to your email"
            : "Register to get started with Mana Ride"}
        </p>
      </div>

      {/* ROLE SELECTION */}
      {!otpSent && (
        <div
          className="d-flex gap-2 mb-4 p-1 rounded-pill"
          style={{ background: "#f3f3f3" }}
        >
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
              {role.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="alert alert-success small py-2">{success}</div>
      )}

      {/* ERROR */}
      {error && <div className="alert alert-danger small py-2">{error}</div>}

      {/* FORM STEP 1: REGISTRATION DETAILS */}
      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="d-flex flex-column gap-3">
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
            placeholder="Confirm password"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn fw-bold py-2 rounded-3"
            style={{
              background:
                "linear-gradient(135deg, var(--primary-orange), var(--accent-amber))",
              color: "white",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        // FORM STEP 2: OTP VERIFICATION
        <form onSubmit={handleVerifyOtp} className="d-flex flex-column gap-4">
          <div className="position-relative">
            <label className="small fw-semibold mb-1">Enter OTP</label>

            <Shield
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
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              maxLength={6}
              className="form-control py-2 rounded-3 text-center"
              style={{
                paddingLeft: "2.5rem",
                fontSize: "1rem",
                letterSpacing: "3px",
                border: "2px solid #eee",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn fw-bold py-2 rounded-3"
            style={{
              background:
                "linear-gradient(135deg, var(--primary-orange), var(--accent-amber))",
              color: "white",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying..." : "Verify & Register"}
          </button>
        </form>
      )}

      {/* FOOTER LINK */}
      {!otpSent && (
        <div className="text-center mt-4 pt-3 border-top">
          <p className="small mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-bold"
              style={{
                color: "var(--primary-orange)",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </p>
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
