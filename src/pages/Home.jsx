import { useEffect, useState } from "react";
import MemeCard from "../components/Card";
import { GetAllMemes } from "../api/meme";
import { ArrowRight, Search, Upload } from "lucide-react";

const Homepage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetAllMemes().then((memes) => {
      if (memes && memes.data && Array.isArray(memes.data.memes)) {
        setData(memes.data.memes);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full">
      <main className="flex-grow flex flex-col items-center justify-center text-center my-16">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Generate memes 
        </h2>
        <h2 className="text-6xl md:text-8xl font-extrabold my-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight">
          easily
        </h2>

        <div className="relative mt-8 w-full max-w-lg">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search template"
            className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-16 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
      </main>

      {loading ? (
        <p className="text-center text-xl text-gray-300">Loading Memes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {data.map((el) => (
            <MemeCard key={el.id} img={el.url} title={el.name} />
          ))}
        </div>
      )}

      <footer className="text-center mt-12"></footer>
    </div>
  );
};

export default Homepage;
