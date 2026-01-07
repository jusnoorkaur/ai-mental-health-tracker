import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const moodOptions = [
    { emoji: "😊", label: "Great", color: "from-[#8b9c8a] to-[#a8b5a7]" },
    { emoji: "🙂", label: "Good", color: "from-[#9aa99a] to-[#b5c2b4]" },
    { emoji: "😐", label: "Okay", color: "from-[#c5d0c4] to-[#d4d9d3]" },
    { emoji: "😔", label: "Sad", color: "from-[#a89f8e] to-[#b8af9e]" },
    { emoji: "😞", label: "Down", color: "from-[#9a9186] to-[#aaa196]" },
  ];

  // Load moods from Firestore in real-time
  useEffect(() => {
    if (!user) return;

    const moodsQuery = query(
      collection(db, "moods"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(moodsQuery, (snapshot) => {
      const moodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort on client side instead
      moodData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
      setMoods(moodData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMoodClick = async (mood) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "moods"), {
        userId: user.uid,
        mood: mood.emoji,
        label: mood.label,
        timestamp: new Date(),
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error adding mood:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-[#4a5a49] mb-2">Mood Tracker</h2>
        <p className="text-[#6b7f6a] font-light">How are you feeling right now?</p>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {moodOptions.map((mood) => (
          <button
            key={mood.label}
            className={`bg-gradient-to-br ${mood.color} bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#6b7f6a]/10 border border-[#e8e8df]`}
            onClick={() => handleMoodClick(mood)}
          >
            <div className="text-5xl mb-3">{mood.emoji}</div>
            <div className="font-light text-[#4a5a49]">{mood.label}</div>
          </button>
        ))}
      </div>

      {/* Mood History */}
      <div className="mt-12">
        <h3 className="text-2xl font-light text-[#4a5a49] mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-[#6b7f6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Mood History
        </h3>
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 max-h-96 overflow-y-auto border border-[#e8e8df]">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#6b7f6a] font-light">Loading your moods...</p>
            </div>
          ) : moods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">😊</p>
              <p className="text-[#6b7f6a] font-light mb-2">No moods logged yet</p>
              <p className="text-[#9aa99a] text-sm font-light">Click on a mood above to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {moods.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow border border-[#e8e8df]"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{entry.mood}</span>
                    <div>
                      <span className="font-light text-[#4a5a49]">{entry.label}</span>
                    </div>
                  </div>
                  <span className="text-[#9aa99a] text-sm font-light">{entry.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;