"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft as Toggle2,
  AlertCircle,
  CalendarCheck,
} from "lucide-react"
import { API_URL } from "../config/api"
import "./Dashboard.css"

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [ownerVehicles, setOwnerVehicles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [toastMessage, setToastMessage] = useState("")
  const [editingVehicle, setEditingVehicle] = useState(null)

  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const token = userInfo?.token
  const [loading, setLoading] = useState(false)

  // form state: text fields
  const [formData, setFormData] = useState({
    name: "",
    type: "Car",
    fuel: "Petrol",
    pricePerDay: "",
    location: "",
    description: "",
    image: "",
    phone: userInfo?.mobile || "",
  })

  // files state: store File objects selected by user
  const [files, setFiles] = useState({
    image: null,
    rcBook: null,
    insurance: null,
    pollution: null,
    vehiclePermit: null,
  })

  // previews & existing URLs (when editing, backend returns URLs)
  const [previews, setPreviews] = useState({
    image: "", // dataURL or existing url
    rcBookUrl: "",
    insuranceUrl: "",
    pollutionUrl: "",
    vehiclePermitUrl: "",
  })

  // Fetch owner's vehicles
  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    if (userInfo?.role !== "owner") {
      navigate("/")
      return
    }

    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/vehicles/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.message)
        setOwnerVehicles(data)
      } catch (err) {
        showToast("Failed to load vehicles")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [token, navigate])

  // helper to read file and create preview for image-only inputs
  const handleFileChange = (fieldName, file) => {
    setFiles((prev) => ({ ...prev, [fieldName]: file }))

    if (fieldName === "image" && file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreviews((p) => ({ ...p, image: ev.target.result }))
      }
      reader.readAsDataURL(file)
    } else {
      // for non-image docs we won't generate a dataURL preview; but clear existing URL so owner knows they've selected a new file
      if (file) {
        if (fieldName === "rcBook") setPreviews((p) => ({ ...p, rcBookUrl: "" }))
        if (fieldName === "insurance") setPreviews((p) => ({ ...p, insuranceUrl: "" }))
        if (fieldName === "pollution") setPreviews((p) => ({ ...p, pollutionUrl: "" }))
        if (fieldName === "vehiclePermit") setPreviews((p) => ({ ...p, vehiclePermitUrl: "" }))
      }
    }
  }

  // create or update vehicle (multipart/form-data)
  const handleSubmitForm = async (e) => {
    e.preventDefault()

    try {
      // Validation for required files on create (Option A requirement: image, rcBook, insurance required for create)
      if (!editingVehicle) {
        if (!files.image && !previews.image) {
          throw new Error("Vehicle image is required")
        }
        if (!files.rcBook && !previews.rcBookUrl) {
          throw new Error("RC Book (document) is required")
        }
        if (!files.insurance && !previews.insuranceUrl) {
          throw new Error("Insurance document is required")
        }
      }

      const method = editingVehicle ? "PUT" : "POST"
      const url = editingVehicle
        ? `${API_URL}/vehicles/${editingVehicle._id}`
        : `${API_URL}/vehicles`

      const body = new FormData()
      // append text fields
      body.append("name", formData.name)
      body.append("type", formData.type)
      body.append("fuel", formData.fuel)
      body.append("pricePerDay", formData.pricePerDay)
      body.append("location", formData.location)
      body.append("description", formData.description || "")
      body.append("phone", formData.phone || "")

      // append files if provided
      if (files.image) body.append("image", files.image)
      if (files.rcBook) body.append("rcBook", files.rcBook)
      if (files.insurance) body.append("insurance", files.insurance)
      if (files.pollution) body.append("pollution", files.pollution)
      if (files.vehiclePermit) body.append("vehiclePermit", files.vehiclePermit)

      // NOTE: Do NOT set Content-Type header; browser will set boundary for multipart
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Operation failed")

      if (editingVehicle) {
        setOwnerVehicles((prev) =>
          prev.map((v) => (v._id === editingVehicle._id ? data : v))
        )
        showToast("Vehicle updated successfully!")
      } else {
        setOwnerVehicles((prev) => [data, ...prev])
        showToast("Vehicle added successfully!")
      }

      // reset form and previews/files
      setShowForm(false)
      setEditingVehicle(null)
      setFormData({
        name: "",
        type: "Car",
        fuel: "Petrol",
        pricePerDay: "",
        location: "",
        description: "",
        image: "",
        phone: userInfo?.mobile || "",
      })
      setFiles({
        image: null,
        rcBook: null,
        insurance: null,
        pollution: null,
        vehiclePermit: null,
      })
      setPreviews({
        image: "",
        rcBookUrl: "",
        insuranceUrl: "",
        pollutionUrl: "",
        vehiclePermitUrl: "",
      })
    } catch (err) {
      showToast(err.message || "Upload failed")
    }
  }

  const handleToggleAvailability = async (id) => {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setOwnerVehicles((prev) =>
        prev.map((v) => (v._id === id ? { ...v, status: data.status } : v))
      )
      showToast("Vehicle status updated!")
    } catch (err) {
      showToast("Failed to update status")
    }
  }

  const handleDeleteVehicle = async (id) => {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setOwnerVehicles((prev) => prev.filter((v) => v._id !== id))
      showToast("Vehicle deleted successfully!")
    } catch (err) {
      showToast("Failed to delete vehicle")
    } finally {
      setShowDeleteConfirm(null)
    }
  }

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      name: vehicle.name || "",
      type: vehicle.type || "Car",
      fuel: vehicle.fuel || "Petrol",
      pricePerDay: vehicle.pricePerDay || "",
      location: vehicle.location || "",
      description: vehicle.description || "",
      image: vehicle.image || "",
      phone: vehicle.phone || userInfo?.mobile || "",
    })

    // set previews from existing URLs (if any)
    setPreviews({
      image: vehicle.image || "",
      rcBookUrl: vehicle.rcBook || "",
      insuranceUrl: vehicle.insurance || "",
      pollutionUrl: vehicle.pollution || "",
      vehiclePermitUrl: vehicle.vehiclePermit || "",
    })

    // clear locally selected files (owner may choose to upload new ones)
    setFiles({
      image: null,
      rcBook: null,
      insurance: null,
      pollution: null,
      vehiclePermit: null,
    })

    setShowForm(true)
  }

  const handleAddVehicle = () => {
    setEditingVehicle(null)
    setFormData({
      name: "",
      type: "Car",
      fuel: "Petrol",
      pricePerDay: "",
      location: "",
      description: "",
      image: "",
      phone: userInfo?.mobile || "",
    })
    setFiles({
      image: null,
      rcBook: null,
      insurance: null,
      pollution: null,
      vehiclePermit: null,
    })
    setPreviews({
      image: "",
      rcBookUrl: "",
      insuranceUrl: "",
      pollutionUrl: "",
      vehiclePermitUrl: "",
    })
    setShowForm(true)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const stats = [
    { label: "Total Vehicles", value: ownerVehicles.length, icon: "🚗" },
    {
      label: "Available",
      value: ownerVehicles.filter((v) => v.status === "Available").length,
      icon: "✓",
    },
    {
      label: "Booked",
      value: ownerVehicles.filter((v) => v.status === "Booked").length,
      icon: "📅",
    },
    { label: "Earnings (₹)", value: "-", icon: "💰" },
  ]

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--primary-orange)",
          fontWeight: "600",
          fontSize: "1.2rem",
        }}
      >
        Loading your vehicles...
      </div>
    )
  }

  return (
    <div style={{ background: "var(--light-gray)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--white)",
          // borderBottom: "2px solid var(--primary-orange)",
          padding: "1rem 1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap", // ⭐ Allows stacking on mobile
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(1.2rem, 4vw, 1.8rem)", // ⭐ Responsive text
              fontWeight: "800",
              background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              flex: "1 1 auto", // ⭐ Keeps title full width on small screens
            }}
          >
            Owner Dashboard
          </h1>

          {/* Buttons Wrapper */}
          <div
            style={{
              display: "flex",
              gap: "0.8rem",
              flexWrap: "wrap", // ⭐ Stack buttons if space is small
              justifyContent: "flex-end",
            }}
          >
            {/* View Bookings */}
            <button
              onClick={() => navigate("/owner-bookings")}
              style={{
                background: "var(--light-gray)",
                color: "var(--primary-orange)",
                border: "2px solid var(--primary-orange)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "clamp(0.75rem, 2.8vw, 0.9rem)", // ⭐ Responsive font
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                width: "fit-content",
              }}
            >
              <CalendarCheck size={18} />
              View Bookings
            </button>

            {/* Logout (commented out in original) */}
            {/* <button ...>Logout</button> */}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
            color: "#fff",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* CONTENT START */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                borderLeft: "4px solid var(--primary-orange)",
              }}
            >
              <p style={{ color: "#999" }}>{s.label}</p>
              <h3 style={{ fontWeight: "800", fontSize: "1.8rem" }}>{s.value}</h3>
            </div>
          ))}
        </div>

        {/* Add Vehicle Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--dark)" }}>
            Your Vehicles ({ownerVehicles.length})
          </h2>
          <button
            onClick={handleAddVehicle}
            style={{
              background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
              color: "var(--white)",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Plus size={18} /> Add Vehicle
          </button>
        </div>

        {/* Vehicles table */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--light-gray)", borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: "1.2rem", textAlign: "left" }}>Vehicle</th>
                  <th style={{ padding: "1.2rem", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "1.2rem", textAlign: "left" }}>Price/Day</th>
                  <th style={{ padding: "1.2rem", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "1.2rem", textAlign: "left" }}>Approval</th>
                  <th style={{ padding: "1.2rem", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {ownerVehicles.map((vehicle, idx) => (
                  <tr
                    key={vehicle._id}
                    style={{
                      borderBottom: "1px solid #eee",
                      animation: `slideUp 0.6s ease-out ${idx * 0.05}s both`,
                    }}
                  >
                    <td style={{ padding: "1.2rem", fontWeight: "600", color: "#333", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        style={{ width: "50px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                      />
                      {vehicle.name}
                    </td>
                    <td style={{ padding: "1.2rem", color: "#666" }}>{vehicle.type}</td>
                    <td style={{ padding: "1.2rem", color: "#666" }}>₹{vehicle.pricePerDay}</td>
                    <td style={{ padding: "1.2rem" }}>
                      <span
                        style={{
                          background: vehicle.status === "Available" ? "#d4f8d4" : "#f0f0f0",
                          color: vehicle.status === "Available" ? "#2d7d2d" : "#999",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                        }}
                      >
                        {vehicle.status}
                      </span>
                    </td>

                    <td style={{ padding: "1.2rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        <span
                          style={{
                            background:
                              vehicle.reviewStatus === "approved"
                                ? "#d4f8d4"
                                : vehicle.reviewStatus === "rejected"
                                ? "#fdd8d8"
                                : "#fff3cd",
                            color:
                              vehicle.reviewStatus === "approved"
                                ? "#2d7d2d"
                                : vehicle.reviewStatus === "rejected"
                                ? "#c86464"
                                : "#d4a500",
                            padding: "0.4rem 0.8rem",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            textTransform: "capitalize",
                            textAlign: "center",
                          }}
                        >
                          {vehicle.reviewStatus || "pending"}
                        </span>

                        {vehicle.reviewStatus === "rejected" && vehicle.reason && (
                          <small style={{ color: "#c86464", fontSize: "0.8rem" }}>{vehicle.reason}</small>
                        )}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "1.2rem",
                        textAlign: "center",
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => handleToggleAvailability(vehicle._id)}
                        style={{
                          background: "rgba(255,111,0,0.1)",
                          color: "var(--primary-orange)",
                          border: "none",
                          padding: "0.5rem",
                          borderRadius: "6px",
                        }}
                      >
                        <Toggle2 size={16} />
                      </button>
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        style={{
                          background: "rgba(100,150,200,0.1)",
                          color: "#6496c8",
                          border: "none",
                          padding: "0.5rem",
                          borderRadius: "6px",
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(vehicle._id)}
                        style={{
                          background: "rgba(200,100,100,0.1)",
                          color: "#c86464",
                          border: "none",
                          padding: "0.5rem",
                          borderRadius: "6px",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS BELOW */}
      {/* --- Add/Edit Modal --- */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "18px",
              padding: "1.8rem",
              width: "95%",
              maxWidth: "520px",
              maxHeight: "90vh", // ⭐ scroll enabled
              overflowY: "auto", // ⭐ scroll if content large
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
              animation: "fadeIn 0.3s ease", // ⭐ smooth animation
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.3rem, 4vw, 1.7rem)", // responsive title
                fontWeight: "800",
                marginBottom: "1.3rem",
                background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
              }}
            >
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>

            <form
              onSubmit={handleSubmitForm}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* INPUT */}

              <div>
                <label style={{ fontWeight: 600 }}>Vehicle Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Toyota Fortuner"
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    borderRadius: "10px",
                    border: "2px solid #ddd",
                    marginTop: "0.3rem",
                  }}
                />
              </div>

              {/* IMAGE file (replaces Image URL) */}
              <div>
                <label style={{ fontWeight: 600 }}>
                  Image {editingVehicle ? "(keep existing or upload new)" : "(required)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("image", e.target.files?.[0] || null)}
                  style={{
                    width: "100%",
                    padding: "0.4rem 0.3rem",
                    borderRadius: "10px",
                    border: "2px solid #ddd",
                    marginTop: "0.3rem",
                  }}
                />
                {/* small preview for image (Option B) */}
                {previews.image ? (
                  <img
                    src={previews.image}
                    alt="preview"
                    style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8 }}
                  />
                ) : editingVehicle && previews.image ? (
                  <img
                    src={previews.image}
                    alt="existing"
                    style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8 }}
                  />
                ) : (
                  <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>No image selected</div>
                )}
              </div>

              {/* GRID FIELDS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={{ fontWeight: 600 }}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                    }}
                  >
                    <option>Car</option>
                    <option>Bike</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 600 }}>Fuel</label>
                  <select
                    value={formData.fuel}
                    onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                    }}
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                  </select>
                </div>
              </div>

              {/* PRICE + LOCATION */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={{ fontWeight: 600 }}>Price/Day (₹)</label>
                  <input
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerDay: e.target.value })
                    }
                    required
                    placeholder="1500"
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600 }}>Location</label>

                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "0.9rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select Location</option>

                    <option value="Abids">Abids</option>
                    <option value="Ameerpet">Ameerpet</option>
                    <option value="Adibatla">Adibatla</option>
                    <option value="Alwal">Alwal</option>
                    <option value="Attapur">Attapur</option>
                    <option value="Bachupally">Bachupally</option>
                    <option value="Banjara Hills">Banjara Hills</option>
                    <option value="Bandlaguda">Bandlaguda</option>
                    <option value="Barkatpura">Barkatpura</option>
                    <option value="Begumpet">Begumpet</option>
                    <option value="BHEL">BHEL</option>
                    <option value="Boduppal">Boduppal</option>
                    <option value="Bowenpally">Bowenpally</option>
                    <option value="Chanda Nagar">Chanda Nagar</option>
                    <option value="Charminar">Charminar</option>
                    <option value="Chintal">Chintal</option>
                    <option value="Dilsukhnagar">Dilsukhnagar</option>
                    <option value="ECIL">ECIL</option>
                    <option value="Erragadda">Erragadda</option>
                    <option value="Falaknuma">Falaknuma</option>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Gajularamaram">Gajularamaram</option>
                    <option value="Gandipet">Gandipet</option>
                    <option value="Ghatkesar">Ghatkesar</option>
                    <option value="Gowlipura">Gowlipura</option>
                    <option value="Habsiguda">Habsiguda</option>
                    <option value="Hafeezpet">Hafeezpet</option>
                    <option value="Himayatnagar">Himayatnagar</option>
                    <option value="Hitech City">Hitech City</option>
                    <option value="Hyderguda">Hyderguda</option>
                    <option value="Jubilee Hills">Jubilee Hills</option>
                    <option value="Jeedimetla">Jeedimetla</option>
                    <option value="Kachiguda">Kachiguda</option>
                    <option value="Karkhana">Karkhana</option>
                    <option value="Karmanghat">Karmanghat</option>
                    <option value="Kondapur">Kondapur</option>
                    <option value="Kukatpally">Kukatpally</option>
                    <option value="KPHB">KPHB</option>
                    <option value="Kompally">Kompally</option>
                    <option value="LB Nagar">LB Nagar</option>
                    <option value="Lalgadi Malakpet">Lalgadi Malakpet</option>
                    <option value="Madhapur">Madhapur</option>
                    <option value="Malkajgiri">Malkajgiri</option>
                    <option value="Mallepally">Mallepally</option>
                    <option value="Manikonda">Manikonda</option>
                    <option value="Miyapur">Miyapur</option>
                    <option value="Mehdipatnam">Mehdipatnam</option>
                    <option value="Moosapet">Moosapet</option>
                    <option value="Nacharam">Nacharam</option>
                    <option value="Nampally">Nampally</option>
                    <option value="Narayanaguda">Narayanaguda</option>
                    <option value="Narsingi">Narsingi</option>
                    <option value="Nizampet">Nizampet</option>
                    <option value="Old City">Old City</option>
                    <option value="Padmarao Nagar">Padmarao Nagar</option>
                    <option value="Patancheru">Patancheru</option>
                    <option value="Pocharam">Pocharam</option>
                    <option value="Punjagutta">Punjagutta</option>
                    <option value="Raidurgam">Raidurgam</option>
                    <option value="Ramnagar">Ramnagar</option>
                    <option value="Sanath Nagar">Sanath Nagar</option>
                    <option value="Sainikpuri">Sainikpuri</option>
                    <option value="Sangareddy Road">Sangareddy Road</option>
                    <option value="Saroornagar">Saroornagar</option>
                    <option value="Secunderabad">Secunderabad</option>
                    <option value="Serilingampally">Serilingampally</option>
                    <option value="Shamshabad">Shamshabad</option>
                    <option value="Sikandrabad">Sikandrabad</option>
                    <option value="Somajiguda">Somajiguda</option>
                    <option value="Tarnaka">Tarnaka</option>
                    <option value="Tolichowki">Tolichowki</option>
                    <option value="Uppal">Uppal</option>
                    <option value="Vanasthalipuram">Vanasthalipuram</option>
                    <option value="Warfangal Highway">Warfangal Highway</option>
                    <option value="Yousufguda">Yousufguda</option>
                  </select>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label style={{ fontWeight: 600 }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of your vehicle..."
                  style={{
                    width: "100%",
                    padding: "1rem",
                    border: "2px solid #ddd",
                    borderRadius: "10px",
                    minHeight: "90px",
                    resize: "none",
                    marginTop: "0.3rem",
                  }}
                ></textarea>
              </div>

              {/* DOCUMENTS: RC, Insurance, Pollution, Permit */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={{ fontWeight: 600 }}>RC Book {editingVehicle ? "(existing allowed)" : "(required)"}</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("rcBook", e.target.files?.[0] || null)}
                    style={{
                      width: "100%",
                      padding: "0.4rem 0.3rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                    }}
                  />
                  {previews.rcBookUrl ? (
                    <div style={{ marginTop: 8 }}>
                      <a href={previews.rcBookUrl} target="_blank" rel="noreferrer">View existing RC document</a>
                    </div>
                  ) : files.rcBook ? (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>{files.rcBook.name}</div>
                  ) : (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>No RC selected</div>
                  )}
                </div>

                <div>
                  <label style={{ fontWeight: 600 }}>Insurance {editingVehicle ? "(existing allowed)" : "(required)"}</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("insurance", e.target.files?.[0] || null)}
                    style={{
                      width: "100%",
                      padding: "0.4rem 0.3rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                    }}
                  />
                  {previews.insuranceUrl ? (
                    <div style={{ marginTop: 8 }}>
                      <a href={previews.insuranceUrl} target="_blank" rel="noreferrer">View existing Insurance doc</a>
                    </div>
                  ) : files.insurance ? (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>{files.insurance.name}</div>
                  ) : (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>No insurance selected</div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={{ fontWeight: 600 }}>Pollution (PUC) (optional)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("pollution", e.target.files?.[0] || null)}
                    style={{
                      width: "100%",
                      padding: "0.4rem 0.3rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                    }}
                  />
                  {previews.pollutionUrl ? (
                    <div style={{ marginTop: 8 }}>
                      <a href={previews.pollutionUrl} target="_blank" rel="noreferrer">View existing Pollution doc</a>
                    </div>
                  ) : files.pollution ? (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>{files.pollution.name}</div>
                  ) : (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>No pollution doc</div>
                  )}
                </div>

                <div>
                  <label style={{ fontWeight: 600 }}>Vehicle Permit (optional)</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange("vehiclePermit", e.target.files?.[0] || null)}
                    style={{
                      width: "100%",
                      padding: "0.4rem 0.3rem",
                      borderRadius: "10px",
                      border: "2px solid #ddd",
                      marginTop: "0.3rem",
                    }}
                  />
                  {previews.vehiclePermitUrl ? (
                    <div style={{ marginTop: 8 }}>
                      <a href={previews.vehiclePermitUrl} target="_blank" rel="noreferrer">View existing Permit</a>
                    </div>
                  ) : files.vehiclePermit ? (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>{files.vehiclePermit.name}</div>
                  ) : (
                    <div style={{ marginTop: 8, color: "#888", fontSize: 13 }}>No permit uploaded</div>
                  )}
                </div>
              </div>
<small style={{ color: "#888", fontSize: "0.8rem" }}>
  Allowed formats: JPG, JPEG, PNG, PDF (if not uploading correctly, once recheck)
</small>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, var(--primary-orange), var(--accent-amber))`,
                    color: "var(--white)",
                    border: "none",
                    padding: "0.9rem",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  {editingVehicle ? "Update Vehicle" : "Add Vehicle"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    background: "#f2f2f2",
                    border: "none",
                    padding: "0.9rem",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <AlertCircle size={40} style={{ color: "#be0000ff", marginBottom: "1rem" }} />
            <h2>Delete Vehicle?</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => handleDeleteVehicle(showDeleteConfirm)}
                style={{
                  flex: 1,
                  background: "#bb0000ff",
                  color: "#fff",
                  border: "none",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  fontWeight: "700",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1,
                  background: "var(--light-gray)",
                  border: "none",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  fontWeight: "700",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
