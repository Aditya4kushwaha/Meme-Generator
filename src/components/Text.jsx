import Draggable from "react-draggable";
import { XCircle } from "lucide-react";

const Text = ({ textItem, onDelete, defaultStyle }) => {
  const { id, text, fontSize } = textItem;

  const memeTextStyle = {
    fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
    color: "white",
    letterSpacing: "1px",
    textShadow:
      "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000",
    textAlign: "center",
    whiteSpace: "nowrap",
    fontSize: fontSize || 40, 
  };

  return (
    <Draggable bounds="parent">
      <div
        className="absolute cursor-move group"
        style={{
          ...defaultStyle,
          transform: "translate(-50%, -50%)",
        }}
        data-text-id={id}
      >
        <div className="relative p-2">
          <h1 className="font-bold" style={memeTextStyle}>
            {text}
          </h1>
          <button
            onClick={() => onDelete(id)}
            className="absolute -top-3 -right-3 w-8 h-8 sm:w-6 sm:h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
            title="Delete text"
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default Text;
