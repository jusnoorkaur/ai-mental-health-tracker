import React from "react";

function CrisisResources({ isOpen, onClose }) {
  if (!isOpen) return null;

  const resources = [
    {
      name: "988 Suicide & Crisis Lifeline",
      description: "24/7 free and confidential support",
      phone: "988",
      text: "Text 988",
      icon: "📞",
      color: "from-red-500 to-red-600"
    },
    {
      name: "Crisis Text Line",
      description: "Text support for any crisis",
      phone: "",
      text: "Text HOME to 741741",
      icon: "💬",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "SAMHSA National Helpline",
      description: "Treatment referral and information",
      phone: "1-800-662-4357",
      text: "",
      icon: "🏥",
      color: "from-green-500 to-green-600"
    },
    {
      name: "Veterans Crisis Line",
      description: "Support for veterans and their families",
      phone: "988 (Press 1)",
      text: "Text 838255",
      icon: "🎖️",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "The Trevor Project",
      description: "LGBTQ+ youth crisis support",
      phone: "1-866-488-7386",
      text: "Text START to 678678",
      icon: "🌈",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-3xl p-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-light text-[#4a5a49] mb-2">Crisis Resources</h2>
            <p className="text-[#6b7f6a] font-light">You are not alone. Help is available 24/7.</p>
          </div>
          <button onClick={onClose} className="text-[#6b7f6a] hover:text-[#4a5a49] transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 bg-red-50 border-l-4 border-red-500 mx-6 mt-6 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800 mb-1">If you are in immediate danger:</h3>
              <p className="text-red-700 font-light mb-2">Call 911 or go to your nearest emergency room.</p>
              <p className="text-red-600 text-sm font-light">Your safety is the top priority.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {resources.map((resource, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">{resource.icon}</span>
                    <h3 className="text-xl font-light text-[#4a5a49]">{resource.name}</h3>
                  </div>
                  <p className="text-[#6b7f6a] font-light mb-4">{resource.description}</p>
                  <div className="space-y-2">
                    {resource.phone && (
                      <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`} className={`inline-flex items-center bg-gradient-to-r ${resource.color} text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-light mr-3`}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call: {resource.phone}
                      </a>
                    )}
                    {resource.text && (
                      <span className="inline-flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-light">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {resource.text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gradient-to-br from-[#f5f5f0] to-[#e8e8df] border-t border-gray-200">
          <h3 className="text-lg font-light text-[#4a5a49] mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-[#6b7f6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Additional Support
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-[#4a5a49] font-medium mb-1">Online Chat Support</p>
              <p className="text-[#6b7f6a] font-light">Visit suicidepreventionlifeline.org/chat</p>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-[#4a5a49] font-medium mb-1">Find Local Resources</p>
              <p className="text-[#6b7f6a] font-light">Call 211 for community services</p>
            </div>
          </div>
        </div>

        <div className="p-6 text-center border-t border-gray-200">
          <p className="text-[#6b7f6a] font-light mb-4">💚 Remember: Reaching out for help is a sign of strength, not weakness.</p>
          <button onClick={onClose} className="bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white px-8 py-3 rounded-2xl hover:shadow-xl hover:shadow-[#6b7f6a]/20 transition-all duration-300 font-light">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrisisResources;