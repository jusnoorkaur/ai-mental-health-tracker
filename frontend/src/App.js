import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f0] via-[#e8e8df] to-[#d4d4c8]">
        <div className="text-center">
          <svg className="w-16 h-16 text-[#6b7f6a] animate-pulse mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
          <p className="text-[#6b7f6a] font-light">Loading SereneAI...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {user && (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#e8e8df]">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-70 transition">
              <svg className="w-8 h-8 text-[#6b7f6a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              <h1 className="text-2xl font-light text-[#4a5a49] tracking-wide">
                SereneAI
              </h1>
            </Link>
            <div className="flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="text-[#6b7f6a] hover:text-[#4a5a49] font-light transition"
              >
                Dashboard
              </Link>
              <button 
                onClick={logout} 
                className="bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white px-6 py-2 rounded-full font-light hover:shadow-lg hover:shadow-[#6b7f6a]/20 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}