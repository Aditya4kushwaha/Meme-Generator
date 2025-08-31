import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Homepage from "./pages/Home";
import EditPage from "./pages/Edit";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full relative text-white font-sans">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto p-3 sm:p-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 sm:mb-10 px-3 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10">
          {/* Logo */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform">
                Meme Centre
              </h1>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto mt-3 sm:mt-0`}>
            <a
              href="https://buymeacoffee.com/aadi_kush"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500/80 to-pink-600/80 hover:from-pink-500 hover:to-pink-600 rounded-xl shadow-md font-semibold transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Heart size={16} className="text-white" />
              <span>Sponsor</span>
            </a>

            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors shadow-sm text-sm sm:text-base w-full sm:w-auto justify-center">
              <span>😊</span>
              <span className="text-xs sm:text-sm opacity-90">built by AdityaXdev</span>
            </div>
          </nav>
        </header>

        
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/edit" element={<EditPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
