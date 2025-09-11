import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Search, ImagePlus } from 'lucide-react';

// --- API Helper ---
// This function fetches the meme templates.
const GetAllMemes = async () => {
  try {
    const response = await fetch("https://api.imgflip.com/get_memes");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Could not fetch memes:", error);
    return { success: false, data: { memes: [] } };
  }
};

// --- MemeCard Component ---
// This component displays a single meme template.
const MemeCard = ({ img, title }) => {
  const navigate = useNavigate();
  const handleEditClick = () => navigate(`/edit?url=${encodeURIComponent(img)}`);

  return (
    <div
      onClick={handleEditClick}
      className="bg-white/5 rounded-xl overflow-hidden group relative border border-white/10 hover:border-purple-500 transition-all duration-300 cursor-pointer flex flex-col w-full max-w-sm"
    >
      <img src={img} alt={title} className="w-full h-48 object-cover" loading="lazy" />
      <div className="p-4 flex-grow flex items-center justify-center">
        <h3 className="text-base font-semibold text-white text-center leading-tight">
          {title}
        </h3>
      </div>
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-lg font-semibold pointer-events-none">
          <Edit size={20} />
          Edit Meme
        </div>
      </div>
    </div>
  );
};

// --- UploadCard Component ---
// This component provides an option for users to upload their own image.
const UploadCard = () => {
    const navigate = useNavigate();
    const handleUploadClick = () => navigate('/edit');

    return (
        <div
            onClick={handleUploadClick}
            className="bg-white/5 rounded-xl group relative border border-dashed border-white/20 hover:border-purple-500 transition-all duration-300 cursor-pointer flex flex-col w-full max-w-sm items-center justify-center min-h-[280px]"
        >
            <div className="flex flex-col items-center gap-4 text-gray-400 group-hover:text-white transition-colors">
                <ImagePlus size={48} />
                <span className="font-semibold text-lg text-center">Use Your Own Image</span>
            </div>
        </div>
    );
};


// --- Homepage Component ---
// The main landing page, displaying meme templates and the search bar.
const Homepage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to manage the search input
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    GetAllMemes().then((memes) => {
      // More robust check for API response
      if (memes?.success && Array.isArray(memes.data.memes)) {
        setData(memes.data.memes);
      }
      setLoading(false);
    });
  }, []);

  // Logic to filter memes based on the search term
  const filteredMemes = data.filter(meme =>
    meme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <main className="flex-grow flex flex-col items-center justify-center text-center my-8 sm:my-16 px-4">
        <h2 className="text-4xl sm:text-7xl font-bold tracking-tight leading-tight">
          Generate memes
        </h2>
        <h2 className="text-5xl sm:text-8xl font-extrabold my-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight">
          easily
        </h2>
        <div className="relative mt-8 w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          {/* Input is now a controlled component for search */}
          <input
            type="text"
            placeholder="Search template"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </main>

      {loading ? (
        <p className="text-center text-xl text-gray-300 px-4">Loading Memes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center px-4">
          {/* New card for uploading custom images */}
          <UploadCard />
          {/* Maps over the new 'filteredMemes' array */}
          {filteredMemes.map((el) => (
            <MemeCard key={el.id} img={el.url} title={el.name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;
