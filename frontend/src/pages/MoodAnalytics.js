import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";

function MoodAnalytics() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7"); // 7, 30, or "all"
  const { user } = useAuth();

  // Mood value mapping for calculations
  const moodValues = {
    "😊": { label: "Great", value: 5, color: "#8b9c8a" },
    "🙂": { label: "Good", value: 4, color: "#9aa99a" },
    "😐": { label: "Okay", value: 3, color: "#c5d0c4" },
    "😔": { label: "Sad", value: 2, color: "#a89f8e" },
    "😞": { label: "Down", value: 1, color: "#9a9186" },
  };

  // Load moods from Firestore
  useEffect(() => {
    if (!user) return;

    const loadMoods = async () => {
      try {
        const moodsQuery = query(
          collection(db, "moods"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(moodsQuery);
        const moodData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort by timestamp
        moodData.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis());
        setMoods(moodData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading moods:", error);
        setLoading(false);
      }
    };

    loadMoods();
  }, [user]);

  // Filter moods by time range
  const getFilteredMoods = () => {
    if (timeRange === "all") return moods;
    
    const daysAgo = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    return moods.filter(
      (mood) => mood.timestamp?.toDate() >= cutoffDate
    );
  };

  const filteredMoods = getFilteredMoods();

  // Prepare data for line chart
  const getLineChartData = () => {
    return filteredMoods.map((mood, index) => ({
      name: mood.timestamp?.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mood: moodValues[mood.mood]?.value || 3,
      emoji: mood.mood,
    }));
  };

  // Prepare data for pie chart
  const getPieChartData = () => {
    const distribution = {};
    
    filteredMoods.forEach((mood) => {
      const label = moodValues[mood.mood]?.label || "Unknown";
      distribution[label] = (distribution[label] || 0) + 1;
    });

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
      color: Object.values(moodValues).find((m) => m.label === name)?.color || "#c5d0c4",
    }));
  };

  // Calculate statistics
  const getStats = () => {
    if (filteredMoods.length === 0) {
      return {
        average: 0,
        bestDay: "N/A",
        totalEntries: 0,
        trend: "neutral",
      };
    }

    const values = filteredMoods.map((m) => moodValues[m.mood]?.value || 3);
    const average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

    // Find best day
    const bestMood = filteredMoods.reduce((best, current) =>
      (moodValues[current.mood]?.value || 0) > (moodValues[best.mood]?.value || 0)
        ? current
        : best
    );
    const bestDay = bestMood.timestamp?.toDate().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
    const secondHalf = values.slice(midpoint).reduce((a, b) => a + b, 0) / (values.length - midpoint);
    const trend = secondHalf > firstHalf + 0.3 ? "improving" : secondHalf < firstHalf - 0.3 ? "declining" : "stable";

    return {
      average,
      bestDay,
      totalEntries: filteredMoods.length,
      trend,
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[#6b7f6a] font-light">Loading your analytics...</p>
      </div>
    );
  }

  if (filteredMoods.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-[#8b9c8a] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-xl font-light text-[#4a5a49] mb-2">No Mood Data Yet</h3>
        <p className="text-[#6b7f6a] font-light mb-6">
          Start tracking your moods to see analytics and insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light text-[#4a5a49] mb-2">Mood Analytics</h2>
          <p className="text-[#6b7f6a] font-light">Your emotional wellness insights</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-full p-2 border border-[#e8e8df]">
          {[
            { value: "7", label: "7 Days" },
            { value: "30", label: "30 Days" },
            { value: "all", label: "All Time" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-full font-light transition-all ${
                timeRange === range.value
                  ? "bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white"
                  : "text-[#6b7f6a] hover:bg-white/50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Average Mood"
          value={stats.average}
          subtitle="out of 5.0"
          icon="😊"
        />
        <StatCard
          title="Best Day"
          value={stats.bestDay}
          subtitle="highest mood"
          icon="🌟"
        />
        <StatCard
          title="Total Entries"
          value={stats.totalEntries}
          subtitle="moods tracked"
          icon="📊"
        />
        <StatCard
          title="Trend"
          value={stats.trend === "improving" ? "↗️" : stats.trend === "declining" ? "↘️" : "→"}
          subtitle={stats.trend}
          icon="📈"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-[#e8e8df]">
          <h3 className="text-xl font-light text-[#4a5a49] mb-6">Mood Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getLineChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8df" />
              <XAxis
                dataKey="name"
                stroke="#6b7f6a"
                style={{ fontSize: "12px", fontWeight: "300" }}
              />
              <YAxis
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#6b7f6a"
                style={{ fontSize: "12px", fontWeight: "300" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e8e8df",
                  borderRadius: "12px",
                  fontWeight: "300",
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#6b7f6a"
                strokeWidth={3}
                dot={{ fill: "#6b7f6a", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-[#e8e8df]">
          <h3 className="text-xl font-light text-[#4a5a49] mb-6">Mood Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPieChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getPieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e8e8df",
                  borderRadius: "12px",
                  fontWeight: "300",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-3xl p-8 border border-[#e8e8df]">
        <h3 className="text-xl font-light text-[#4a5a49] mb-4 flex items-center">
          <svg className="w-6 h-6 mr-3 text-[#6b7f6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Insights
        </h3>
        <div className="space-y-3">
          {stats.trend === "improving" && (
            <p className="text-[#4a5a49] font-light">
              📈 Your mood has been <span className="text-[#6b7f6a] font-normal">improving</span> recently. Keep up whatever you're doing - it's working!
            </p>
          )}
          {stats.trend === "declining" && (
            <p className="text-[#4a5a49] font-light">
              📉 Your mood has been <span className="text-[#6b7f6a] font-normal">declining</span> lately. Consider reaching out to someone you trust or exploring coping strategies.
            </p>
          )}
          {stats.trend === "stable" && (
            <p className="text-[#4a5a49] font-light">
              ➡️ Your mood has been <span className="text-[#6b7f6a] font-normal">stable</span> recently. Consistency is great for emotional wellness.
            </p>
          )}
          <p className="text-[#4a5a49] font-light">
            💚 You've tracked <span className="text-[#6b7f6a] font-normal">{stats.totalEntries} moods</span> - awareness is the first step to wellbeing.
          </p>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-3xl p-6 text-center border border-[#e8e8df]">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-[#8b9c8a] text-xs uppercase tracking-wider mb-2 font-light">
        {title}
      </p>
      <p className="text-3xl font-light text-[#4a5a49] mb-1">{value}</p>
      <p className="text-[#9aa99a] text-sm font-light">{subtitle}</p>
    </div>
  );
}

export default MoodAnalytics;