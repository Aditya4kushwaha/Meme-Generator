import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

const MemeCard = ({ img, title }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit?url=${img}`);
  };

  return (
    <div
      onClick={handleEditClick}
      className="bg-white/5 rounded-xl overflow-hidden group relative border border-white/10 hover:border-purple-500 transition-all duration-300 cursor-pointer flex flex-col w-full max-w-sm"
    >
      <img src={img} alt={title} className="w-full h-32 sm:h-48 object-cover" />

      <div className="p-3 sm:p-4 flex-grow flex items-center justify-center">
        <h3 className="text-sm sm:text-lg font-semibold text-white text-center leading-tight">
          {title}
        </h3>
      </div>

      <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 rounded-lg font-semibold pointer-events-none text-sm sm:text-base">
          <Edit size={18} className="sm:w-5 sm:h-5" />
          Edit Meme
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
