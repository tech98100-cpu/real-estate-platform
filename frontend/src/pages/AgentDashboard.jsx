import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, MessageSquare, Pencil, Trash2, Home } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const statusColor = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const AgentDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [tab, setTab] = useState("listings");

  const load = () => {
    api.get("/properties/agent/mine").then((res) => setProperties(res.data)).catch(() => {});
    api.get("/inquiries/agent").then((res) => setInquiries(res.data)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property listing?")) return;
    await api.delete(`/properties/${id}`);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Agent Dashboard</h1>
          <p className="text-ink/50">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/agent/properties/new"
          className="flex items-center gap-2 bg-ink hover:bg-gold hover:text-ink text-offwhite font-semibold px-5 py-3 rounded-full transition-colors text-sm"
        >
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <p className="text-ink/50 text-xs uppercase font-semibold">Total Listings</p>
          <p className="font-display text-3xl font-bold text-ink mt-1">{properties.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <p className="text-ink/50 text-xs uppercase font-semibold">Total Views</p>
          <p className="font-display text-3xl font-bold text-ink mt-1">{totalViews}</p>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 p-5">
          <p className="text-ink/50 text-xs uppercase font-semibold">Inquiries Received</p>
          <p className="font-display text-3xl font-bold text-ink mt-1">{inquiries.length}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("listings")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "listings" ? "bg-ink text-offwhite" : "bg-white text-ink/60 border border-black/10"
          }`}
        >
          <Home size={14} /> My Listings
        </button>
        <button
          onClick={() => setTab("inquiries")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab === "inquiries" ? "bg-ink text-offwhite" : "bg-white text-ink/60 border border-black/10"
          }`}
        >
          <MessageSquare size={14} /> Inquiries
        </button>
      </div>

      {tab === "listings" && (
        properties.length === 0 ? (
          <p className="text-ink/50 bg-white rounded-2xl border border-black/5 p-10 text-center">
            You haven't added any properties yet.
          </p>
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-offwhite text-ink/50 text-xs uppercase">
                <tr>
                  <th className="text-left px-5 py-3">Property</th>
                  <th className="text-left px-5 py-3">Price</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3"><Eye size={14} className="inline" /></th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p._id} className="border-t border-black/5">
                    <td className="px-5 py-4 flex items-center gap-3">
                      <img src={p.images?.[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-medium text-ink">{p.title}</span>
                    </td>
                    <td className="px-5 py-4 text-ink/70">Rs {new Intl.NumberFormat("en-PK").format(p.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full ${statusColor[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{p.views}</td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/agent/properties/${p._id}/edit`} className="inline-block mr-3 text-ink/50 hover:text-gold-dark">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="text-ink/50 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === "inquiries" && (
        inquiries.length === 0 ? (
          <p className="text-ink/50 bg-white rounded-2xl border border-black/5 p-10 text-center">
            No inquiries received yet.
          </p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq._id} className="bg-white rounded-xl border border-black/5 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-ink">{inq.property?.title}</p>
                  <span className="text-xs font-semibold capitalize px-3 py-1 rounded-full bg-gold/20 text-gold-dark">
                    {inq.status}
                  </span>
                </div>
                <p className="text-sm text-ink/70">{inq.message}</p>
                <p className="text-xs text-ink/40 mt-2">From: {inq.name} · {inq.email} {inq.phone && `· ${inq.phone}`}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default AgentDashboard;
