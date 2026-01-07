import React, { useState } from "react";

function Journal() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");

  const handleAddEntry = () => {
    if (text.trim()) {
      setEntries([{ text, date: new Date().toLocaleString() }, ...entries]);
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAddEntry();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-[#4a5a49] mb-2">Daily Journal</h2>
        <p className="text-[#6b7f6a] font-light">Express your thoughts and feelings</p>
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
          {entries.length === 0 ? (
            <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-16 text-center border border-[#e8e8df]">
              <svg className="w-16 h-16 text-[#8b9c8a] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-[#6b7f6a] font-light mb-2">No journal entries yet</p>
              <p className="text-[#9aa99a] text-sm font-light">Start writing to capture your thoughts</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={index}
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
    </div>
  );
}

export default Journal;