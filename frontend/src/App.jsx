import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Properties from "./pages/Properties.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import AddEditProperty from "./pages/AddEditProperty.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/properties/new"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <AddEditProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/properties/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <AddEditProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default App;
