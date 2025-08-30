import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Homepage from "./pages/Home";
import EditPage from "./pages/Edit";
import { Heart } from "lucide-react";

function App() {
  const navigate = useNavigate();

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
      <div className="relative z-10 container mx-auto p-6">
        {/* Header */}
        <header className="flex justify-between items-center w-full mb-10 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <h1 className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform">
              Meme Centre
            </h1>
          </div>

        
          <nav className="hidden sm:flex items-center gap-4">
            <a
              href="https://buymeacoffee.com/aadi_kush"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/80 to-pink-600/80 hover:from-pink-500 hover:to-pink-600 rounded-xl shadow-md font-semibold transition-all"
            >
              <Heart size={16} className="text-white" />
              <span>Sponsor</span>
            </a>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors shadow-sm">
              <span>😊</span>
              <span className="text-sm opacity-90">built by AdityaXdev</span>
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
