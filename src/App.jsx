import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Homepage from "./pages/Home";
import EditPage from "./pages/Edit";
import { Heart } from "lucide-react";

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative text-white font-sans">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
        }}
      />

      <div className="relative z-10 container mx-auto p-6">
        <header className="flex justify-between items-center w-full mb-8">
          <div className="flex items-center gap-2">
            <h1
              onClick={() => navigate("/")}
              className="cursor-pointer text-xl font-bold"
            >
              Meme Centre
            </h1>
          </div>
          <nav className="hidden sm:flex items-center gap-3">
            <a
              href="https://buymeacoffee.com/aadi_kush"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"

            >
              <Heart size={16} className="text-pink-500" />
              <span>Sponsor</span>
            </a>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <span>😊</span>
              <span className="text-sm">built by AdityaXdev</span>
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
