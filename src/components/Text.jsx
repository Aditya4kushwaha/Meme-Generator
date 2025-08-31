import Draggable from "react-draggable";
import { XCircle } from "lucide-react";

const Text = ({ textItem, onDelete, defaultStyle }) => {
  const { id, text, fontSize, color, fontFamily } = textItem;

  // Map font names to CSS font-family values
  const getFontFamily = (fontName) => {
    const fontMap = {
      "Impact": "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      "Arial": "Arial, sans-serif",
      "Comic Sans": "'Comic Sans MS', cursive, sans-serif",
      "Times New Roman": "'Times New Roman', Times, serif",
      "Verdana": "Verdana, Geneva, sans-serif",
      "Georgia": "Georgia, serif",
      "Courier New": "'Courier New', Courier, monospace",
      "Trebuchet MS": "'Trebuchet MS', sans-serif",
      "Lucida Console": "'Lucida Console', Monaco, monospace",
      "Tahoma": "Tahoma, Geneva, sans-serif"
    };
    return fontMap[fontName] || "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
  };

  const memeTextStyle = {
    fontFamily: getFontFamily(fontFamily),
    color: color || "#FFFFFF",
    letterSpacing: "1px",
    textShadow:
      "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000",
    textAlign: "center",
    whiteSpace: "normal", // Allow text to wrap
    wordWrap: "break-word", // Break long words if needed
    maxWidth: "80vw", // Limit width on mobile
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
