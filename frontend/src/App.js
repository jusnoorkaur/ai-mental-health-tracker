import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CrisisResources from "./components/CrisisResources";
import { useState, useEffect } from "react";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout } = useAuth();
  const [showCrisisResources, setShowCrisisResources] = useState(false);

  // Listen for crisis resources event from other components
  useEffect(() => {
    const handleOpenCrisis = () => setShowCrisisResources(true);
    window.addEventListener('openCrisisResources', handleOpenCrisis);
    return () => window.removeEventListener('openCrisisResources', handleOpenCrisis);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f0] via-[#e8e8df] to-[#d4d4c8]">
      {/* Navigation Bar */}
      {user && (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-[#e8e8df]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo - Original Style */}
              <a 
                href="/dashboard" 
                className="flex items-center space-x-3 hover:opacity-80 transition"
              >
                <svg className="w-10 h-10 text-[#6b7f6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14c0 0 1.5 2 4 2s4-2 4-2" />
                </svg>
                <h1 className="text-2xl font-light text-[#4a5a49] tracking-wide">
                  SereneAI
                </h1>
              </a>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white px-6 py-2 rounded-full font-light hover:shadow-lg hover:shadow-[#6b7f6a]/20 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>

      {/* Floating Crisis Button - Always Visible When Logged In */}
      {user && (
        <button
          onClick={() => setShowCrisisResources(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 font-light flex items-center space-x-2 z-50 hover:scale-105"
          title="Crisis Resources"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="hidden sm:inline">Need Help Now?</span>
          <span className="sm:hidden">Help</span>
        </button>
      )}

      {/* Crisis Resources Modal */}
      <CrisisResources 
        isOpen={showCrisisResources} 
        onClose={() => setShowCrisisResources(false)} 
      />
    </div>
  );
}

export default App;