"use client"

import { useNavigate } from "react-router-dom"
import { ArrowRight, Search, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { vehicles } from "../data/vehicles"
import VehicleCard from "../components/VehicleCard"
import { API_URL } from "../config/api"
import "./Home.css"
import BookingFlow from "../components/FAQ"

export default function Home() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [displayedVehicles, setDisplayedVehicles] = useState([])

  // Search bar state
  const [searchType, setSearchType] = useState("All Types")
  const [searchLocation, setSearchLocation] = useState("")
  const [startDate, setStartDate] = useState("")
  const [availableLocations, setAvailableLocations] = useState([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  useEffect(() => {
    setDisplayedVehicles(vehicles.slice(0, 3))
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vehicles.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // fetch locations once
  useEffect(() => {
    const loadLocations = async () => {
      setLoadingLocations(true)
      try {
        const res = await fetch(`${API_URL}/vehicles/locations/all`)
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          setAvailableLocations(data)
        } else {
          console.warn("Could not load locations", data)
        }
      } catch (err) {
        console.error("Failed to fetch locations", err)
      } finally {
        setLoadingLocations(false)
      }
    }

    loadLocations()
  }, [])

 const features = [
  {
    icon: "⚡",
    title: "Instant Booking",
    description:
      "Book your vehicle instantly with real-time updates and a smooth booking experience.",
  },
  {
    icon: "✓",
    title: "Verified Vehicle Owners",
    description:
      "All vehicles and owners are verified to ensure trust, safety, and a reliable rental experience.",
  },
  {
    icon: "💰",
    title: "Flexible Pricing",
    description:
      "Transparent pricing with no hidden charges. Choose the ride that fits your budget.",
  },
  {
    icon: "📍",
    title: "Real-Time Availability",
    description:
      "Check nearby vehicles available right now and pick the one that suits your plan.",
  },
];


  const testimonials = [
  {
    name: "Sai Teja",
    text: "Mana Ride chala useful ga undi anna! Near-by lo car dorikindi, rates kuda decent. Super experience!",
    rating: 5,
  },
  {
    name: "Alekhya Reddy",
    text: "Booking process baaga easy. Naku kavalsina time ki bike available undi. Owner kuda chala friendly!",
    rating: 5,
  },
  {
    name: "Mahesh Goud",
    text: "Hyderabad lo e service super! Local vehicles instant ga dorukutayi. Money waste avvu ani confidence.",
    rating: 4,
  },
];

const steps = [
  {
    number: 1,
    title: "Search",
    text: "Find nearby cars and bikes by selecting your location, vehicle type, and preferred dates.",
  },
  {
    number: 2,
    title: "Book",
    text: "Choose the vehicle you like and confirm your booking instantly with the verified owner.",
  },
  {
    number: 3,
    title: "Ride",
    text: "Pick up your vehicle at the scheduled time and enjoy a smooth, hassle-free journey.",
  },
];

const partnerSteps = [
  {
    number: 1,
    title: "Create Owner Account",
    text: "Sign up as a vehicle owner by selecting the Owner role and entering your basic details. Quick and simple registration.",
  },
  {
    number: 2,
    title: "List Your Vehicle",
    text: "Add all details and documents. Once submitted, you’ll receive a verification email after review.",
  },
  {
    number: 3,
    title: "Start Earning",
    text: "Get bookings from nearby users, manage pickup, and earn steady income easily.",
  },
];

  const goToSearchWithFilters = () => {
    const params = new URLSearchParams()
    if (searchType && searchType !== "All Types") params.set("type", searchType)
    if (searchLocation) params.set("location", searchLocation)
    if (startDate) params.set("date", startDate)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div style={{ background: "var(--light-gray)" }}>
      {/* Hero Section */}
      <section
        style={{
         background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
          padding: "4rem 2rem",
          position: "relative",
          overflow: "hidden",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="hero-section"
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "250px",
            height: "250px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>

        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "800",
              color: "var(--white)",
              marginBottom: "1rem",
              animation: "slideUp 0.8s ease-out",
            }}
          >
         Your Local Vehicle Booking Platform

          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.3rem)",
              color: "rgba(255,255,255,0.95)",
              marginBottom: "2rem",
              animation: "slideUp 0.8s ease-out 0.2s both",
            }}
          >
Rent bikes and cars from verified owners with live availability and instant booking.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "slideUp 0.8s ease-out 0.4s both",
            }}
          >
            <button
              onClick={() => navigate("/search")}
              style={{
                background: "var(--white)",
                color: "var(--primary-orange)",
                border: "none",
                padding: "1rem 2rem",
                fontSize: "1rem",
                fontWeight: "700",
                borderRadius: "var(--border-radius)",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)"
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              Explore Vehicles <ArrowRight size={20} />
            </button>

            <button
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "var(--white)",
                border: "2px solid var(--white)",
                padding: "1rem 2rem",
                fontSize: "1rem",
                fontWeight: "700",
                borderRadius: "var(--border-radius)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)"
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                e.currentTarget.style.transform = "scale(1)"
              }}
              onClick={() => {
  document.getElementById("booking-flow")?.scrollIntoView({
    behavior: "smooth",
  });
}}
            >
              Become Partner
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "-3rem auto 0",
          padding: "0 2rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "var(--white)",
            padding: "2rem",
            borderRadius: "var(--border-radius)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#666",
                  marginBottom: "0.5rem",
                }}
              >
                Vehicle Type
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "2px solid #eee",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                }}
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "#eee")}
              >
                <option>All Types</option>
                <option>Cars</option>
                <option>Bikes</option>
              </select>
            </div>

            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#666",
                  marginBottom: "0.5rem",
                }}
              >
                Location
              </label>

              {/* Use dropdown of available locations; fallback to text input while loading or if empty */}
              {availableLocations.length > 0 ? (
                <select
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "2px solid #eee",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "border-color 0.3s",
                  }}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary-orange)")}
                  onBlur={(e) => (e.target.style.borderColor = "#eee")}
                >
                  <option value="">All Locations</option>
                  {availableLocations.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={loadingLocations ? "Loading locations..." : "Enter location"}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "2px solid #eee",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    transition: "border-color 0.3s",
                  }}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary-orange)")}
                  onBlur={(e) => (e.target.style.borderColor = "#eee")}
                />
              )}
            </div>

            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#666",
                  marginBottom: "0.5rem",
                }}
              >
                Start Date
              </label>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "2px solid #eee",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "border-color 0.3s",
                }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary-orange)")}
                onBlur={(e) => (e.target.style.borderColor = "#eee")}
              />
            </div>

            <button
              onClick={goToSearchWithFilters}
              style={{
                background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
                color: "var(--white)",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 111, 0, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "4rem auto",
          padding: "0 2rem",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: "800",
            color: "var(--dark)",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          Why Choose Mana Ride?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--white)",
                padding: "2rem",
                borderRadius: "var(--border-radius)",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
                borderLeft: "4px solid transparent",
                animation: "slideUp 0.6s ease-out",
                animationDelay: `${idx * 0.1}s`,
                animationFillMode: "both",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)"
                e.currentTarget.style.borderLeftColor = "var(--primary-orange)"
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(255, 111, 0, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.borderLeftColor = "transparent"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  color: "var(--dark)",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
          padding: "4rem 2rem",
          textAlign: "center",
          marginTop: "4rem",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: "800",
            color: "var(--white)",
            marginBottom: "1rem",
          }}
        >
          Ready to Start Your Journey?
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.95)",
            marginBottom: "2rem",
          }}
        >
          Join Hundreds of travelers who trust Mana Ride for their vehicle rentals.
        </p>
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "var(--white)",
            color: "var(--primary-orange)",
            border: "none",
            padding: "1rem 2.5rem",
            fontSize: "1rem",
            fontWeight: "700",
            borderRadius: "var(--border-radius)",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          Sign Up Now
        </button>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "5rem auto",
          padding: "0 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: "800",
            color: "var(--dark)",
            marginBottom: "3rem",
          }}
        >
          How It Works
        </h2>

        <div
          className="d-flex flex-wrap justify-content-center gap-4"
          style={{ rowGap: "2rem" }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              style={{
                background: "var(--white)",
                padding: "2rem",
                borderRadius: "var(--border-radius)",
                width: "300px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)"
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(255, 111, 0, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  color: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "800",
                  fontSize: "1.2rem",
                  margin: "0 auto 1rem",
                }}
              >
                {step.number}
              </div>
              <h4 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>
                {step.title}
              </h4>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        style={{
          background: "var(--white)",
          padding: "5rem 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: "800",
            color: "var(--dark)",
            marginBottom: "3rem",
          }}
        >
          What Our Customers Say
        </h2>

        <div
          className="d-flex flex-wrap justify-content-center gap-4"
          style={{ rowGap: "2rem" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: "var(--light-gray)",
                borderRadius: "var(--border-radius)",
                padding: "2rem",
                maxWidth: "350px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"
                e.currentTarget.style.boxShadow =
                  "0 12px 25px rgba(255, 111, 0, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
              }}
            >
              <p
                style={{
                  fontStyle: "italic",
                  color: "#555",
                  marginBottom: "1rem",
                }}
              >
                "{t.text}"
              </p>
              <div className="d-flex justify-content-center mb-2">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} size={18} color="#ffb400" fill="#ffb400" />
                ))}
              </div>
              <h5 style={{ fontWeight: "700", color: "var(--dark)" }}>
                {t.name}
              </h5>
            </div>
          ))}
        </div>
      </section>
{/* Become a Partner Section */}
<section  id="booking-flow"
  style={{
    maxWidth: "1200px",
    margin: "5rem auto",
    padding: "0 2rem",
    textAlign: "center",
  }}
>
  <h2
    style={{
      fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
      fontWeight: "800",
      color: "var(--dark)",
      marginBottom: "3rem",
    }}
  >
    Become a Partner
  </h2>

  <div
    className="d-flex flex-wrap justify-content-center gap-4"
    style={{ rowGap: "2rem" }}
  >
    {partnerSteps.map((step) => (
      <div
        key={step.number}
        style={{
          background: "var(--white)",
          padding: "2rem",
          borderRadius: "var(--border-radius)",
          width: "300px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)"
          e.currentTarget.style.boxShadow =
            "0 12px 30px rgba(255, 111, 0, 0.2)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            color: "var(--white)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "800",
            fontSize: "1.2rem",
            margin: "0 auto 1rem",
          }}
        >
          {step.number}
        </div>

        <h4 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>
          {step.title}
        </h4>

        <p style={{ color: "#666", fontSize: "0.95rem" }}>{step.text}</p>
      </div>
    ))}
  </div>
</section>

      {/* Partner / App Promo Section */}
      <section
        style={{
          background: "var(--dark)",
          color: "var(--white)",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: "800",
            marginBottom: "1rem",
          }}
        >
          Become a Partner or Download Our App
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            maxWidth: "700px",
            margin: "0 auto 2rem",
          }}
        >
          Are you a vehicle owner? List your car or bike on Mana Ride and earn
          more. Or stay connected on the go with our upcoming mobile app.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <button
            onClick={() => navigate("/register")}
            style={{
              background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
              border: "none",
              color: "var(--white)",
              padding: "0.9rem 2rem",
              borderRadius: "var(--border-radius)",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Become a Partner
          </button>

          <a href="/" download style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "transparent",
                color: "var(--white)",
                border: "2px solid var(--white)",
                padding: "0.9rem 2rem",
                borderRadius: "var(--border-radius)",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Download Mobile App
            </button>
          </a>
        </div>
      </section>
      <BookingFlow/>
    </div>
  )
}
