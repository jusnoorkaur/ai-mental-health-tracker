import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Chat from "./Chat";
import MoodTracker from "./MoodTracker";
import Journal from "./Journal";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "mood", label: "Mood", icon: "mood" },
    { id: "journal", label: "Journal", icon: "journal" },
    { id: "chat", label: "Support", icon: "chat" },
  ];

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      mood: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      journal: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      chat: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    };
    return icons[iconName];
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeView user={user} setActiveTab={setActiveTab} />;
      case "mood":
        return <MoodTracker />;
      case "journal":
        return <Journal />;
      case "chat":
        return <Chat />;
      default:
        return <HomeView user={user} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f0] via-[#e8e8df] to-[#d4d4c8] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-[#8b9c8a]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#a8b5a7]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-[#8b9c8a] text-sm uppercase tracking-widest mb-3">Mental Wellness</p>
          <h1 className="text-4xl md:text-5xl font-light text-[#4a5a49] mb-4">
            Welcome back, {user?.displayName || user?.email?.split("@")[0] || "Friend"}
          </h1>
          <p className="text-[#6b7f6a] text-lg font-light">How are you feeling today?</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-full shadow-lg shadow-[#6b7f6a]/10 p-2 flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-light transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white shadow-md"
                    : "text-[#6b7f6a] hover:bg-white/50"
                }`}
              >
                {getIcon(tab.icon)}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#6b7f6a]/10 p-8 md:p-12 min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Home View Component
function HomeView({ user, setActiveTab }) {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-[#4a5a49] mb-6">
          Your Mental Wellness Hub
        </h2>
        <p className="text-[#6b7f6a] text-lg font-light leading-relaxed">
          Take time with yourself, know about yourself, learn about yourself — 
          the biggest healing begins with self-connection.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <ActionCard
          icon="mood"
          title="Track Your Mood"
          description="Log how you're feeling and identify patterns over time"
          onClick={() => setActiveTab("mood")}
        />
        <ActionCard
          icon="journal"
          title="Journal Your Thoughts"
          description="Express your thoughts and feelings in a safe space"
          onClick={() => setActiveTab("journal")}
        />
        <ActionCard
          icon="chat"
          title="AI Support"
          description="Get guidance and support from our AI companion"
          onClick={() => setActiveTab("chat")}
        />
      </div>

      {/* Stats Overview */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <StatCard title="Mood Entries" value="0" subtitle="Begin tracking today" />
        <StatCard title="Journal Entries" value="0" subtitle="Start writing" />
        <StatCard title="Chat Sessions" value="0" subtitle="Get support anytime" />
      </div>
    </div>
  );
}

// Action Card Component
function ActionCard({ icon, title, description, onClick }) {
  const getIcon = (iconName) => {
    const icons = {
      mood: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      journal: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      chat: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    };
    return icons[iconName];
  };

  return (
    <button
      onClick={onClick}
      className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-[#6b7f6a]/10 transition-all duration-300 p-8 text-left hover:scale-105 group border border-[#e8e8df]"
    >
      <div className="text-[#6b7f6a] mb-6 group-hover:text-[#4a5a49] transition-colors">
        {getIcon(icon)}
      </div>
      <h3 className="text-xl font-light text-[#4a5a49] mb-3">{title}</h3>
      <p className="text-[#6b7f6a] text-sm font-light leading-relaxed">{description}</p>
    </button>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-3xl p-8 text-center border border-[#e8e8df]">
      <p className="text-[#8b9c8a] text-sm uppercase tracking-wider mb-3 font-light">{title}</p>
      <p className="text-5xl font-light text-[#4a5a49] mb-2">{value}</p>
      <p className="text-[#9aa99a] text-sm font-light">{subtitle}</p>
    </div>
  );
}