import { useState, useEffect } from "react";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import Chat from "./Chat";
import MoodTracker from "./MoodTracker";
import Journal from "./Journal";
import MoodAnalytics from "./MoodAnalytics";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [stats, setStats] = useState({
    moods: 0,
    journals: 0,
    chats: 0,
  });

  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "mood", label: "Mood", icon: "mood" },
    { id: "analytics", label: "Analytics", icon: "analytics" },
    { id: "journal", label: "Journal", icon: "journal" },
    { id: "chat", label: "Support", icon: "chat" },
  ];

  // Load stats from Firestore
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        // Count moods
        const moodsQuery = query(collection(db, "moods"), where("userId", "==", user.uid));
        const moodsSnapshot = await getDocs(moodsQuery);
        
        // Count journals
        const journalsQuery = query(collection(db, "journals"), where("userId", "==", user.uid));
        const journalsSnapshot = await getDocs(journalsQuery);
        
        // Count chat messages (only user messages)
        const chatsQuery = query(
          collection(db, "chats"),
          where("userId", "==", user.uid),
          where("sender", "==", "user")
        );
        const chatsSnapshot = await getDocs(chatsQuery);

        setStats({
          moods: moodsSnapshot.size,
          journals: journalsSnapshot.size,
          chats: chatsSnapshot.size,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };

    loadStats();
  }, [user, activeTab]); // Reload stats when switching tabs

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
      analytics: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
        return <HomeView user={user} setActiveTab={setActiveTab} stats={stats} />;
      case "mood":
        return <MoodTracker />;
      case "analytics":
        return <MoodAnalytics />;
      case "journal":
        return <Journal />;
      case "chat":
        return <Chat />;
      default:
        return <HomeView user={user} setActiveTab={setActiveTab} stats={stats} />;
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
function HomeView({ user, setActiveTab, stats }) {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      // Get all user's data
      const moodsQuery = query(collection(db, "moods"), where("userId", "==", user.uid));
      const journalsQuery = query(collection(db, "journals"), where("userId", "==", user.uid));
      const chatsQuery = query(collection(db, "chats"), where("userId", "==", user.uid));

      // Get snapshots
      const [moodsSnapshot, journalsSnapshot, chatsSnapshot] = await Promise.all([
        getDocs(moodsQuery),
        getDocs(journalsQuery),
        getDocs(chatsQuery)
      ]);

      // Delete all documents
      const deletePromises = [];
      moodsSnapshot.docs.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));
      journalsSnapshot.docs.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));
      chatsSnapshot.docs.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));

      await Promise.all(deletePromises);
      
      setShowConfirmDialog(false);
      alert("All data cleared successfully!");
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Error clearing data. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

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
        <StatCard 
          title="Mood Entries" 
          value={stats.moods} 
          subtitle={stats.moods === 0 ? "Begin tracking today" : "entries logged"} 
        />
        <StatCard 
          title="Journal Entries" 
          value={stats.journals} 
          subtitle={stats.journals === 0 ? "Start writing" : "thoughts captured"} 
        />
        <StatCard 
          title="Chat Messages" 
          value={stats.chats} 
          subtitle={stats.chats === 0 ? "Get support anytime" : "messages sent"} 
        />
      </div>

      {/* Clear All Data Section */}
      {(stats.moods > 0 || stats.journals > 0 || stats.chats > 0) && (
        <div className="mt-16 bg-white/30 backdrop-blur-sm rounded-3xl p-8 border border-[#e8e8df]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-light text-[#4a5a49] mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#6b7f6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Data
              </h3>
              <p className="text-[#6b7f6a] text-sm font-light">
                Clear all your stored data for a fresh start
              </p>
            </div>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="bg-white/60 hover:bg-red-50 text-[#9a9186] hover:text-red-600 px-6 py-2 rounded-2xl font-light transition-all duration-300 border border-[#e8e8df] hover:border-red-200"
            >
              Clear All Data
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-[#4a5a49] mb-2">Clear All Data?</h3>
              <p className="text-[#6b7f6a] font-light text-sm leading-relaxed">
                This will permanently delete all your mood entries, journal entries, and chat messages. 
                This action cannot be undone.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleClearAllData}
                disabled={isClearing}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-2xl font-light hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClearing ? "Clearing..." : "Yes, Clear Everything"}
              </button>
              <button
                onClick={() => setShowConfirmDialog(false)}
                disabled={isClearing}
                className="w-full bg-white border-2 border-[#c5d0c4] text-[#4a5a49] py-3 rounded-2xl font-light hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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