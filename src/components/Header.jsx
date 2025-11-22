"use client"

import { Link, useNavigate } from "react-router-dom"
import { LogOut, User, CalendarDays, LayoutDashboard, Download, Home, Search, Accessibility, PowerOffIcon, CircleUserRound, CircleUser } from "lucide-react"
import { useState, useEffect } from "react"

export default function Header() {
  const navigate = useNavigate()

  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // 🔥 NEW: scroll hide header
  const [hideHeader, setHideHeader] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
const floatAnimation = `
@keyframes floatBtn {
  0% { transform: translateX(0); }
  50% { transform: translateX(4px); }
  100% { transform: translateX(0); }
}
`;


if (!document.getElementById("floatBtnAnim")) {
  const style = document.createElement("style");
  style.id = "floatBtnAnim";
  style.innerHTML = floatAnimation;
  document.head.appendChild(style);
}

  useEffect(() => {
    const updateScreen = () => setIsMobile(window.innerWidth <= 768)
    updateScreen()
    window.addEventListener("resize", updateScreen)
    return () => window.removeEventListener("resize", updateScreen)
  }, [])

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userInfo")
      if (storedUser) setUser(JSON.parse(storedUser))
    } catch (err) {
      console.error("Failed to parse userInfo", err)
    }
  }, [])

  // 🔥 NEW: Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY

      if (currentScroll > lastScrollY && currentScroll > 80) {
        setHideHeader(true) // scrolling down → hide
      } else {
        setHideHeader(false) // scrolling up → show
      }

      setLastScrollY(currentScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const confirmLogout = () => {
    localStorage.removeItem("userInfo")
    setUser(null)
    setShowLogoutModal(false)
    navigate("/login")
  }

  return (
    <>
      {/* DESKTOP HEADER */}
      <header
        style={{
          background: "var(--dark)",
          padding: "0.2rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          // borderBottom: "2px solid var(--primary-orange)",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          transition: "all 0.6s ease",
          opacity: hideHeader ? 0 : 1,
          transform: hideHeader ? "translateY(-20px)" : "translateY(0)",
          pointerEvents: hideHeader ? "none" : "auto",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ maxWidth: "1400px", margin: "0 auto" }}
        >
          {/* LOGO */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              className="ms-"
              src="/manarideblack.png"
              alt="Mana Ride Logo"
              style={{ height: "90px", objectFit: "contain" }}
            />
          </Link>

          {/* DESKTOP NAV */}
          {!isMobile && (
            <div className="d-flex align-items-center gap-4">
              <Link to="/search" style={linkStyle}  className="header-link-hover">
                Browse Vehicles
              </Link>

              {/* CUSTOMER */}
              {user?.role === "customer" && (
                <>
                  <Link to="/my-bookings" style={linkStyle}  className="header-link-hover">
                    <CalendarDays size={14} style={{ marginRight: 4 }} /> My Bookings
                  </Link>

                  <Link to="/customer-profile" style={linkStyle}  className="header-link-hover">
                    <User size={14} style={{ marginRight: 4 }} /> {user.name}
                  </Link>
                </>
              )}

              {/* OWNER */}
              {user?.role === "owner" && (
                <>
                  <Link to="/owner-dashboard" style={linkStyle}  className="header-link-hover">
                    <LayoutDashboard size={14} style={{ marginRight: 4 }} /> Dashboard
                  </Link>

                  <Link to="/owner-bookings" style={linkStyle}  className="header-link-hover">
                    <CalendarDays size={14} style={{ marginRight: 4 }} /> Bookings
                  </Link>

                  <Link to="/owner-account" style={linkStyle}  className="header-link-hover">
                    <User size={14} style={{ marginRight: 4 }} /> {user.name}
                  </Link>
                </>
              )}

              {/* ADMIN */}
              {user?.role === "admin" && (
                <>
                  <Link to="/admin-dashboard" style={linkStyle}  className="header-link-hover">
                    <LayoutDashboard size={14} style={{ marginRight: 4 }} /> Admin Panel
                  </Link>

                  <Link to="/admin/users" style={linkStyle}  className="header-link-hover">
                    <User size={14} style={{ marginRight: 4 }} /> Manage Users
                  </Link>

                  <Link to="/admin/vehicles" style={linkStyle}  className="header-link-hover">
                    <User size={14} style={{ marginRight: 4 }} /> Manage Vehicles
                  </Link>
                </>
              )}

              {/* AUTH BUTTONS */}
              {!user ? (
                <>
                  <Link to="/login" style={linkStyle}  className="header-link-hover">Login</Link>
                  <Link to="/register" style={signupButton}>Sign Up</Link>
                </>
              ) : (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  style={logoutButton}
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          )}
          {/* MOBILE TOP-RIGHT  BUTTON */}
{/* ⭐ FLOATING PROFILE LETTER BUTTON — GLASS DARK */}

{isMobile && (
  user ? (
    // Logged-in user → show profile shortcut
    <Link
      to={
        user.role === "customer"
          ? "/customer-profile"
          : user.role === "owner"
          ? "/owner-account"
          : "/admin-dashboard"
      }
      style={{
        position: "fixed",
        top: "25px",
        right: "12px",
        zIndex: 3000,
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.25)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "700",
        fontSize: "1.2rem",
        textDecoration: "none",
        boxShadow: "0 6px 15px rgba(0,0,0,0.45)",
        animation: "floatBtn 3s ease-in-out infinite",
      }}
    >
      {user?.name?.charAt(0)?.toUpperCase() || "S"}
    </Link>
  ) : (
    // No user → show default K
    <Link
      to="/login"
      style={{
        position: "fixed",
        top: "25px",
        right: "12px",
        zIndex: 3000,
        width: "46px",
        height: "46px",
        borderRadius: "50%",
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.25)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: "700",
        fontSize: "1.2rem",
        textDecoration: "none",
        boxShadow: "0 6px 15px rgba(0,0,0,0.45)",
        animation: "floatBtn 3s ease-in-out infinite",
      }}
    >
      <User  />

    </Link>
  )
)}



        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            maxHeight:"60px",
            background: "var(--dark)",
            // borderTop: "2px solid var(--primary-orange)",
            display: "flex",
            justifyContent: "space-around",
            padding: "0.6rem 0.4rem",
            zIndex: 9999,
          }}
        >
          <Link to="/" style={bottomNavItem}>
            <Home size={22} />
            <span>Home</span>
          </Link>

          <Link to="/search" style={bottomNavItem}>
            <Search size={22} />
            <span>Browse</span>
          </Link>

          {/* CUSTOMER */}
          {user?.role === "customer" && (
            <>
              <Link to="/my-bookings" style={bottomNavItem}>
                <CalendarDays size={22} />
                <span>Bookings</span>
              </Link>

            
            </>
          )}

          {/* OWNER */}
          {user?.role === "owner" && (
            <>
              <Link to="/owner-dashboard" style={bottomNavItem}>
                <LayoutDashboard size={22} />
                <span>Dashboard</span>
              </Link>

              <Link to="/owner-bookings" style={bottomNavItem}>
                <CalendarDays size={22} />
                <span>Bookings</span>
              </Link>

             
            </>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <Link to="/admin-dashboard" style={bottomNavItem}>
                <LayoutDashboard size={22} />
                <span>A.Dash</span>
              </Link>

             

             
            </>
          )}

          {/* LOGOUT (MOBILE) */}
          {user && (
            <button
              onClick={() => setShowLogoutModal(true)}
              style={{ ...bottomNavItem, background: "none", border: "none" }}
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          )}

          {!user && (
            <>
              <Link to="/login" style={bottomNavItem}>
                <User size={22} />
                <span>Login</span>
              </Link>

              <Link to="/register" style={bottomNavItem}>
                <User size={22} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </nav>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 400 }}>
            <div className="modal-content" style={{ borderRadius: 15 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Confirm Logout</h5>
                <button className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
              </div>

              <div className="modal-body text-center">
                <p>Are you sure you want to logout?</p>
              </div>

              <div className="modal-footer border-0 d-flex justify-content-center gap-3">
                <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>

                <button
                  className="btn text-white"
                  style={{
                    background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
                    borderRadius: "8px",
                  }}
                  onClick={confirmLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- styles ---------- */
const linkStyle = {
  color: "var(--white)",
  textDecoration: "none",
  fontSize: "0.99rem",
  display: "flex",
  alignItems: "center",
}
Object.assign(linkStyle, {
  "--hover-color": "var(--primary-orange)",
});
// 🔥 Modern hover underline animation for all header links
const headerHoverStyle = `.header-link-hover {
  position: relative;
  display: inline-block;
  padding-bottom: 3px;
  transition: transform 0.28s cubic-bezier(.21,1.12,.29,1);
}

/* Magnetic micro-bounce */
.header-link-hover:hover {
  transform: translateY(-3px) scale(1.03);
  color: var(--primary-orange) !important;
}

/* Dual-line futuristic underline */
.header-link-hover::before,
.header-link-hover::after {
  content: "";
  position: absolute;
  bottom: -3px;
  height: 2.5px;
  width: 0;
  background: var(--primary-orange);
  border-radius: 10px;
  transition: width 0.35s cubic-bezier(.22,1,.36,1);
}

/* Left bar */
.header-link-hover::before {
  left: 50%;
  transform: translateX(-100%);
}

/* Right bar */
.header-link-hover::after {
  left: 50%;
}

/* On hover → bars slide outward */
.header-link-hover:hover::before,
.header-link-hover:hover::after {
  width: 50%;
}

/* Neon Glow Edge */
.header-link-hover:hover {
  text-shadow:
    0 0 8px rgba(255, 125, 40, 0.45),
    0 0 18px rgba(255, 125, 40, 0.25);
}
`;


if (!document.getElementById("headerHoverAnim")) {
  const style = document.createElement("style");
  style.id = "headerHoverAnim";
  style.innerHTML = headerHoverStyle;
  document.head.appendChild(style);
}

const signupButton = {
  background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
  color: "var(--white)",
  padding: "0.5rem 1.2rem",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: "600",
}

const logoutButton = {
  background: "none",
  border: "2px solid var(--primary-orange)",
  padding: "6px 12px",
  borderRadius: "8px",
  color: "var(--white)",
  cursor: "pointer",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
}

const bottomNavItem = {
  color: "var(--white)",
  textDecoration: "none",
  fontSize: "0.75rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}
const downloadMobileBtn = {
  padding: "8px",
  textDecoration: "none",
  borderRadius: "15%",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 111, 0, 0.4)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--primary-orange)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  animation: "floatBtn 3s ease-in-out infinite",
};

