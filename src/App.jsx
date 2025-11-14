import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Search from "./pages/Search"
import VehicleDetails from "./pages/VehicleDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"
import OwnerDashboard from "./pages/OwnerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import "./App.css"
import MyBookings from "./pages/CustomerBookings"
import OwnerBookings from "./pages/OwnerBookings"
import OwnerAccount from "./pages/OwnerAccount"
import CustomerAccount from "./pages/CustomerAccount"
import ScrollToTop from "./components/ScrollToTop"

export default function App() {
  return (
    <Router> <ScrollToTop behavior="smooth" /> 
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/vehicle/:id" element={<VehicleDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/owner-bookings" element={<OwnerBookings />} />
          <Route path="/owner-account" element={<OwnerAccount />} />
          <Route path="/customer-profile" element={<CustomerAccount />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
