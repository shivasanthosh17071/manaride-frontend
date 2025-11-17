"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Heart, CalendarCheck, Edit, Save } from "lucide-react";

export default function CustomerAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo"));
    if (!info || info.role !== "customer") {
      navigate("/login");
      return;
    }
    setUser(info);

    setFormData({
      name: info.name || "",
      mobile: info.mobile || "",
    });
  }, [navigate]);

  if (!user) return null;

  // Save Updated Profile
  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: formData.name,
      mobile: formData.mobile,
    };

    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--light-gray)",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "var(--white)",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        {/* Title + Edit Button */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2
            style={{
              fontWeight: "800",
              fontSize: "1.8rem",
              background: `linear-gradient(90deg, var(--primary-orange), var(--accent-amber))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Customer Profile
          </h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              style={editBtn}
            >
              <Edit size={16} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              style={saveBtn}
            >
              <Save size={16} /> Save
            </button>
          )}
        </div>

        {/* View Mode */}
        {!editMode && (
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <p style={infoRow}><User size={18} /> {user.name || "Not Added"}</p>
            <p style={infoRow}><Mail size={18} /> {user.email || "Not Added"}</p>
            <p style={infoRow}><Phone size={18} /> {user.mobile || "Not Added"}</p>
          </div>
        )}

        {/* Edit Mode */}
        {editMode && (
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
                placeholder="Enter your name"
              />
            </div>

            {/* Mobile */}
            <div>
              <label style={labelStyle}>Mobile Number</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                style={inputStyle}
                placeholder="Enter mobile number"
              />
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <button onClick={() => navigate("/my-bookings")} style={buttonStylePrimary}>
          <CalendarCheck size={18} /> My Bookings
        </button>

        <button onClick={() => navigate("/favourites")} style={buttonStylePrimary}>
          <Heart size={18} /> Saved Vehicles
        </button>
      </div>
    </div>
  );
}

/* Styles */

const infoRow = {
  display: "flex",
  gap: "0.5rem",
  color: "#555",
};

const labelStyle = {
  fontWeight: "600",
  color: "#444",
  marginBottom: "5px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const editBtn = {
  background: "var(--primary-orange)",
  border: "none",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "600",
};

const saveBtn = {
  background: "green",
  border: "none",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "600",
};

const buttonStylePrimary = {
  background: "white",
  border: "2px solid var(--primary-orange)",
  color: "var(--primary-orange)",
  padding: "1rem",
  borderRadius: "10px",
  fontWeight: "700",
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
  cursor: "pointer",
};
