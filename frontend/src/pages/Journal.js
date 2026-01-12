import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function Journal() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const { user } = useAuth();

  // Load journal entries from Firestore in real-time
  useEffect(() => {
    if (!user) return;

    const entriesQuery = query(
      collection(db, "journals"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(entriesQuery, (snapshot) => {
      const journalData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort on client side instead
      journalData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
      setEntries(journalData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddEntry = async () => {
    if (!text.trim() || !user) return;

    try {
      await addDoc(collection(db, "journals"), {
        userId: user.uid,
        text: text,
        timestamp: new Date(),
        date: new Date().toLocaleString(),
      });
      setText("");
    } catch (error) {
      console.error("Error adding journal entry:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAddEntry();
    }
  };

  const handleAnalyzeJournal = async () => {
    if (entries.length === 0) {
      alert("You need at least one journal entry to analyze!");
      return;
    }

    setAnalyzing(true);
    setShowAnalysis(true);

    try {
      // Get last 5 journal entries for analysis
      const recentEntries = entries.slice(0, 5).map(entry => entry.text).join("\n\n---\n\n");

      // Create analysis prompt
      const prompt = `You are a compassionate mental health companion. Analyze these recent journal entries and provide:

1. Key emotional themes you notice
2. Positive patterns or growth areas
3. Gentle suggestions for wellbeing
4. One encouraging insight

Keep your response warm, supportive, and under 200 words.

Journal Entries:
${recentEntries}`;

      // Call backend API
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const data = await response.json();
      setAnalysis(data.response);
    } catch (error) {
      console.error("Error analyzing journal:", error);
      setAnalysis("I'm having trouble analyzing your journal right now. Please try again in a moment.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light text-[#4a5a49] mb-2">Daily Journal</h2>
          <p className="text-[#6b7f6a] font-light">Express your thoughts and feelings</p>
        </div>
        
        {/* Analyze Button */}
        {entries.length > 0 && (
          <button
            onClick={handleAnalyzeJournal}
            className="bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white px-6 py-3 rounded-2xl hover:shadow-xl hover:shadow-[#6b7f6a]/20 transition-all duration-300 font-light flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Analyze My Journal</span>
          </button>
        )}
      </div>

      {/* Journal Entry Input */}
      <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-3xl p-8 border border-[#e8e8df]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write your thoughts here..."
          className="w-full h-48 p-5 rounded-2xl border border-[#c5d0c4] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b9c8a]/50 focus:border-transparent resize-none text-[#4a5a49] placeholder-[#9aa99a] font-light leading-relaxed"
        />
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-[#9aa99a] font-light">
            {text.length} characters · Press Ctrl+Enter to save
          </p>
          <button
            onClick={handleAddEntry}
            disabled={!text.trim()}
            className="bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white px-8 py-3 rounded-2xl hover:shadow-xl hover:shadow-[#6b7f6a]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-light"
          >
            Save Entry
          </button>
        </div>
      </div>

      {/* Journal Entries List */}
      <div>
        <h3 className="text-2xl font-light text-[#4a5a49] mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-[#6b7f6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Your Entries
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-16 text-center border border-[#e8e8df]">
              <p className="text-[#6b7f6a] font-light">Loading your entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-16 text-center border border-[#e8e8df]">
              <svg className="w-16 h-16 text-[#8b9c8a] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-[#6b7f6a] font-light mb-2">No journal entries yet</p>
              <p className="text-[#9aa99a] text-sm font-light">Start writing to capture your thoughts</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/50 backdrop-blur-sm rounded-3xl hover:shadow-xl hover:shadow-[#6b7f6a]/10 transition-shadow p-8 border border-[#e8e8df]"
              >
                <p className="text-[#4a5a49] whitespace-pre-wrap mb-6 font-light leading-relaxed">{entry.text}</p>
                <div className="flex items-center justify-between text-sm text-[#9aa99a] font-light">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {entry.date}
                  </span>
                  <span className="bg-white/60 text-[#6b7f6a] px-4 py-1 rounded-full text-xs">
                    {entry.text.split(" ").length} words
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-light text-[#4a5a49] mb-2">Journal Insights</h3>
                <p className="text-[#6b7f6a] text-sm font-light">AI analysis of your recent entries</p>
              </div>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-[#6b7f6a] hover:text-[#4a5a49] transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 bg-[#6b7f6a] rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-[#6b7f6a] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-[#6b7f6a] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-[#6b7f6a] font-light">Analyzing your journal entries...</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#f5f5f0] to-[#e8e8df] rounded-2xl p-6">
                <p className="text-[#4a5a49] font-light leading-relaxed whitespace-pre-wrap">
                  {analysis}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAnalysis(false)}
                className="bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white px-8 py-3 rounded-2xl hover:shadow-xl hover:shadow-[#6b7f6a]/20 transition-all duration-300 font-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Journal;