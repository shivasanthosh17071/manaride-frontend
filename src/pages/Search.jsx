"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import VehicleCard from "../components/VehicleCard"
import { API_URL } from "../config/api"
import { useLocation } from "react-router-dom"

export default function Search() {
  const routerLocation = useLocation()

  const [filters, setFilters] = useState({
    type: "All",
    location: "",
    fuel: "All",
    priceRange: 5000,
    status: "All",
    date: "",
  })

  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("default")
  const [availableLocations, setAvailableLocations] = useState([])

  // Mobile modal states
  const [isMobile, setIsMobile] = useState(false)
  const [mobileFilterModal, setMobileFilterModal] = useState(false)

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  // Fetch Locations once
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const res = await fetch(`${API_URL}/vehicles/locations/all`)
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setAvailableLocations(data)
      } catch (err) {
        console.error("Failed to fetch locations", err)
      }
    }
    loadLocations()
  }, [])

  // Read query params from Home page search bar
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search)

    const newFilters = { ...filters }

    if (params.get("type")) newFilters.type = params.get("type")
    if (params.get("location")) newFilters.location = params.get("location")
    if (params.get("date")) newFilters.date = params.get("date")

    setFilters(newFilters)
  }, [routerLocation.search])

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true)

      const query = new URLSearchParams(filters).toString()

      const res = await fetch(`${API_URL}/vehicles?${query}`)
      const data = await res.json()

      if (res.ok) {
        let sortedData = [...data]

        if (sortBy === "priceLowHigh")
          sortedData.sort((a, b) => a.pricePerDay - b.pricePerDay)
        else if (sortBy === "priceHighLow")
          sortedData.sort((a, b) => b.pricePerDay - a.pricePerDay)
        else if (sortBy === "newest")
          sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setVehicles(sortedData)
      } else {
        console.error("Fetch error:", data.message)
      }
    } catch (err) {
      console.error("Server error", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [filters, sortBy])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Reusable Filter Section
  const filtersSection = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Vehicle Type */}
      <div>
        <label style={{ fontWeight: "600", marginBottom: "0.8rem", display: "block" }}>
          Vehicle Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            border: "2px solid #eee",
            borderRadius: "8px",
          }}
        >
          <option>All</option>
          <option>Car</option>
          <option>Bike</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div>
        <label style={{ fontWeight: "600", marginBottom: "0.8rem", display: "block" }}>
          Fuel Type
        </label>
        <select
          value={filters.fuel}
          onChange={(e) => handleFilterChange("fuel", e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            border: "2px solid #eee",
            borderRadius: "8px",
          }}
        >
          <option>All</option>
          <option>Petrol</option>
          <option>Diesel</option>
          <option>Electric</option>
        </select>
      </div>

      {/* Availability */}
      <div>
        <label style={{ fontWeight: "600", marginBottom: "0.8rem", display: "block" }}>
          Availability
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            border: "2px solid #eee",
            borderRadius: "8px",
          }}
        >
          <option>All</option>
          <option>Available</option>
          <option>Booked</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label style={{ fontWeight: "600", marginBottom: "0.8rem", display: "block" }}>
          Location
        </label>

        <select
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            border: "2px solid #eee",
            borderRadius: "8px",
          }}
        >
          <option value="">All Locations</option>
          {availableLocations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "600",
          }}
        >
          Max Price
          <span style={{ color: "var(--primary-orange)" }}>₹{filters.priceRange}</span>
        </label>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={filters.priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
          style={{ width: "100%", accentColor: "var(--primary-orange)" }}
        />
      </div>

      {/* Clear Filters */}
      <button
        onClick={() =>
          setFilters({
            type: "All",
            location: "",
            fuel: "All",
            priceRange: 5000,
            status: "All",
            date: "",
          })
        }
        style={{
          background: "#f0f0f0",
          border: "none",
          padding: "0.8rem",
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Clear Filters
      </button>
    </div>
  )

  return (
    <div style={{ background: "var(--light-gray)", minHeight: "100vh", paddingBottom: "4rem" }}>
      <div
        className="search-container"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "2rem",
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside
            className="filters-sidebar"
            style={{
              width: "100%",
              background: "var(--white)",
              borderRadius: "var(--border-radius)",
              padding: "1.5rem",
              height: "fit-content",
              position: "sticky",
              top: "80px",
              animation: "slideInLeft 0.6s ease-out",
            }}
          >
            {filtersSection()}
          </aside>
        )}

        {/* Main */}
        <main>
          {/* Header */}
          <div
            className="sort-section"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h2 style={{ fontWeight: "700", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Available Vehicles
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "35%",
                  padding: "0.6rem 1rem",
                  borderRadius: "8px",
                  border: "2px solid #eee",
                }}
              >
                <option value="default">Sort By</option>
                <option value="priceLowHigh">Price: Low → High</option>
                <option value="priceHighLow">Price: High → Low</option>
                <option value="newest">Newest</option>
              </select>

              {/* Count */}
              <span
                style={{
                  fontSize: "12px",
                  background: "var(--white)",
                  padding: "0rem 0.6rem",
                  borderRadius: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  color: "#666",
                }}
              >
                {loading ? "Loading..." : `${vehicles.length}-vehicles`}
              </span>

              {/* Mobile filter button */}
              {isMobile && (
                <button
                  onClick={() => setMobileFilterModal(true)}
                  style={{
                    background: "var(--primary-orange)",
                    border: "none",
                    padding: "0.6rem 0.9rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                  }}
                >
                  <Filter size={18} />
                  Filters
                </button>
              )}
            </div>
          </div>

          {/* Vehicles Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
              Loading vehicles...
            </div>
          ) : vehicles.length > 0 ? (
            <div
              className="vehicles-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              {vehicles.map((v, idx) => (
                <div key={v._id} style={{ animation: `slideUp 0.6s ease-out ${idx * 0.05}s both` }}>
                  <VehicleCard vehicle={v} />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "var(--white)",
                padding: "4rem 2rem",
                borderRadius: "var(--border-radius)",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: "3rem" }}>🚗</div>
              <h3 style={{ fontWeight: "700", marginTop: "1rem" }}>No Vehicles Found</h3>
              <p style={{ color: "#666" }}>Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL */}
      {isMobile && mobileFilterModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setMobileFilterModal(false)}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "400px",
              background: "white",
              borderRadius: "15px",
              padding: "1.5rem",
              animation: "popupFade 0.3s ease",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontWeight: "700", marginBottom: "1rem" }}>Filters</h3>

            {filtersSection()}

            <button
              onClick={() => setMobileFilterModal(false)}
              style={{
                border: "none",
                marginTop: "1.2rem",
                background: "var(--primary-orange)",
                color: "#fff",
                padding: "0.9rem",
                borderRadius: "10px",
                width: "100%",
                fontWeight: "700",
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
