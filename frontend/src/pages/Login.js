import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleGoogle = async () => {
    setErr("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e?.code === "auth/popup-blocked" || e?.code === "auth/operation-not-supported-in-this-environment") {
        try { 
          await signInWithRedirect(auth, googleProvider); 
        } catch (e2) { 
          setErr(e2.message); 
        }
      } else {
        setErr(e.message);
      }
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f0] via-[#e8e8df] to-[#d4d4c8] p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#8b9c8a]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a8b5a7]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <svg className="w-16 h-16 text-[#6b7f6a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <h1 className="text-4xl font-light text-[#4a5a49] mb-3 tracking-wide">
            SereneAI
          </h1>
          <p className="text-[#6b7f6a] text-sm uppercase tracking-widest">
            Your Mental Wellness Companion
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#6b7f6a]/10 p-10">
          <h2 className="text-2xl font-light mb-8 text-center text-[#4a5a49]">
            {isSignup ? "Begin Your Journey" : "Welcome Back"}
          </h2>

          {err && (
            <div className="bg-red-50/80 border border-red-200/50 text-red-700 text-sm p-4 rounded-2xl mb-6 backdrop-blur-sm">
              {err}
            </div>
          )}

          <form onSubmit={handleEmail} className="space-y-5">
            <input
              className="w-full border border-[#c5d0c4] bg-white/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#8b9c8a]/50 focus:border-transparent transition text-[#4a5a49] placeholder-[#9aa99a]"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full border border-[#c5d0c4] bg-white/50 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#8b9c8a]/50 focus:border-transparent transition text-[#4a5a49] placeholder-[#9aa99a]"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-gradient-to-r from-[#6b7f6a] to-[#8b9c8a] text-white rounded-2xl py-4 font-light text-lg tracking-wide hover:shadow-xl hover:shadow-[#6b7f6a]/20 transition-all duration-300">
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c5d0c4]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-[#9aa99a] font-light">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleGoogle} 
            className="w-full bg-white/70 border border-[#c5d0c4] text-[#4a5a49] rounded-2xl py-4 font-light hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>

          <p className="text-center mt-8 text-sm text-[#9aa99a] font-light">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              className="text-[#6b7f6a] font-normal hover:underline" 
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}