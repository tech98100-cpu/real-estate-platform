import { useEffect, useState } from "react";
import { Users, Building2, Clock, MessageSquare, Check, X, Trash2 } from "lucide-react";
import api from "../api/axios.js";

const statusColor = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("properties");

  const load = () => {
    api.get("/admin/stats").then((res) => setStats(res.data)).catch(() => {});
    api.get("/admin/properties").then((res) => setProperties(res.data)).catch(() => {});
    api.get("/admin/users").then((res) => setUsers(res.data)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/properties/${id}/status`, { status });
    setProperties((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Remove this listing permanently?")) return;
    await api.delete(`/admin/properties/${id}`);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Remove this user permanently?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-1">Admin Dashboard</h1>
      <p className="text-ink/50 mb-8">Platform-wide overview and moderation</p>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-black/5 p-5">
            <Users size={18} className="text-gold-dark mb-2" />
            <p className="text-ink/50 text-xs uppercase font-semibold">Total Users</p>
            <p className="font-display text-2xl font-bold text-ink">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-5">
            <Building2 size={18} className="text-gold-dark mb-2" />
            <p className="text-ink/50 text-xs uppercase font-semibold">Total Properties</p>
            <p className="font-display text-2xl font-bold text-ink">{stats.totalProperties}</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-5">
            <Clock size={18} className="text-gold-dark mb-2" />
            <p className="text-ink/50 text-xs uppercase font-semibold">Pending Review</p>
            <p className="font-display text-2xl font-bold text-ink">{stats.pendingProperties}</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 p-5">
            <MessageSquare size={18} className="text-gold-dark mb-2" />
            <p className="text-ink/50 text-xs uppercase font-semibold">Total Inquiries</p>
            <p className="font-display text-2xl font-bold text-ink">{stats.totalInquiries}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("properties")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "properties" ? "bg-ink text-offwhite" : "bg-white text-ink/60 border border-black/10"
          }`}
        >
          Properties
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "users" ? "bg-ink text-offwhite" : "bg-white text-ink/60 border border-black/10"
          }`}
        >
          Users
        </button>
      </div>

      {tab === "properties" && (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-offwhite text-ink/50 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Property</th>
                <th className="text-left px-5 py-3">Agent</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-t border-black/5">
                  <td className="px-5 py-4 font-medium text-ink">{p.title}</td>
                  <td className="px-5 py-4 text-ink/60">{p.agent?.name}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${statusColor[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    {p.status !== "approved" && (
                      <button onClick={() => updateStatus(p._id, "approved")} className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                        <Check size={12} /> Approve
                      </button>
                    )}
                    {p.status !== "rejected" && (
                      <button onClick={() => updateStatus(p._id, "rejected")} className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                        <X size={12} /> Reject
                      </button>
                    )}
                    <button onClick={() => deleteProperty(p._id)} className="inline-flex items-center text-ink/40 hover:text-red-600 px-1">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-offwhite text-ink/50 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-black/5">
                  <td className="px-5 py-4 font-medium text-ink">{u.name}</td>
                  <td className="px-5 py-4 text-ink/60">{u.email}</td>
                  <td className="px-5 py-4 capitalize text-ink/60">{u.role}</td>
                  <td className="px-5 py-4 text-right">
                    {u.role !== "admin" && (
                      <button onClick={() => deleteUser(u._id)} className="text-ink/40 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
