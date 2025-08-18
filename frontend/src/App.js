import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between">
          <h1 className="text-xl font-bold">AI Mental Health Tracker</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
            <Link to="/journal" className="hover:text-blue-500">Journal</Link>
            <Link to="/chat" className="hover:text-blue-500">AI Chat</Link>
          </div>
        </nav>

        {/* Pages */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return <h2 className="text-2xl font-semibold">Welcome to AI Mental Health Tracker</h2>;
}

function Dashboard() {
  return <h2 className="text-2xl font-semibold">Dashboard Page</h2>;
}

function Journal() {
  return <h2 className="text-2xl font-semibold">Journal Page</h2>;
}

function Chat() {
  return <h2 className="text-2xl font-semibold">AI Chat Page</h2>;
}

export default App;
