import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Text from "../components/Text";
import { Download, Type, Trash2, ArrowLeft, Palette, Upload, Plus, Settings, X } from "lucide-react";

const EditPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [texts, setTexts] = useState([
    { id: 1, text: "Text Position 1", fontSize: 40, color: "#FFFFFF", fontFamily: "Impact", position: "top" },
    { id: 2, text: "Text Position 2", fontSize: 40, color: "#FFFFFF", fontFamily: "Impact", position: "bottom" },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [customImage, setCustomImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(params.get("url"));

  const memeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Available fonts for selection
  const availableFonts = [
    { name: "Impact", value: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Comic Sans", value: "'Comic Sans MS', cursive, sans-serif" },
    { name: "Times New Roman", value: "'Times New Roman', Times, serif" },
    { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Courier New", value: "'Courier New', Courier, monospace" },
    { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { name: "Lucida Console", value: "'Lucida Console', Monaco, monospace" },
    { name: "Tahoma", value: "Tahoma, Geneva, sans-serif" }
  ];

  useEffect(() => {
    if (customImage) {
      setCurrentImage(customImage);
    }
  }, [customImage]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addText = () => {
    setTexts([...texts, { 
      id: Date.now(), 
      text: "New Text", 
      fontSize: 40, 
      color: "#FFFFFF", 
      fontFamily: "Impact",
      position: "center"
    }]);
  };

  const updateText = (id, newText) => {
    setTexts(texts.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const updateFontSize = (id, size) => {
    setTexts(texts.map(t => t.id === id ? { ...t, fontSize: size } : t));
  };

  const updateColor = (id, color) => {
    setTexts(texts.map(t => t.id === id ? { ...t, color: color } : t));
  };

  const updateFontFamily = (id, fontFamily) => {
    setTexts(texts.map(t => t.id === id ? { ...t, fontFamily: fontFamily } : t));
  };

  const deleteText = (id) => {
    setTexts(texts.filter(t => t.id !== id));
  };

  const saveMeme = async () => {
    if (!memeRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const memeContainer = memeRef.current;
      const rect = memeContainer.getBoundingClientRect();

      canvas.width = rect.width;
      canvas.height = rect.height;

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        texts.forEach((textItem) => {
          const textElement = memeContainer.querySelector(`[data-text-id="${textItem.id}"]`);
          if (textElement) {
            const textRect = textElement.getBoundingClientRect();
            const containerRect = memeContainer.getBoundingClientRect();

            // Calculate relative position within the meme container
            const relativeX = (textRect.left - containerRect.left + textRect.width / 2) / containerRect.width;
            const relativeY = (textRect.top - containerRect.top + textRect.height / 2) / containerRect.height;

            // Apply relative position to canvas
            const x = relativeX * canvas.width;
            const y = relativeY * canvas.height;

            const fontFamily = availableFonts.find(f => f.name === textItem.fontFamily)?.value || "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
            
            ctx.font = `${textItem.fontSize || 40}px ${fontFamily}`;
            ctx.fillStyle = textItem.color || '#FFFFFF';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.strokeText(textItem.text, x, y);
            ctx.fillText(textItem.text, x, y);
          }
        });

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'meme.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 'image/png');
      };

      img.src = currentImage;
    } catch (error) {
      console.error('Error saving meme:', error);
      alert('Failed to save meme. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20 lg:hidden">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md border border-white/20 text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Meme Display Area */}
      <div className="flex-grow flex items-center justify-center p-2 sm:p-4 lg:p-8 bg-black order-2 lg:order-1">
        <div ref={memeRef} className="relative w-full max-w-lg aspect-square overflow-hidden">
          <img src={currentImage} alt="Meme template" className="w-full h-full object-contain" />
          {texts.map((textItem, index) => (
            <Text
              key={textItem.id}
              textItem={textItem}
              onDelete={deleteText}
              defaultStyle={
                textItem.position === "top"
                  ? { top: "10%", left: "50%" }
                  : textItem.position === "bottom"
                  ? { top: "85%", left: "50%" }
                  : { top: "50%", left: "50%" }
              }
            />
          ))}
        </div>
      </div>

      {/* Controls Area */}
      <div className="w-full lg:w-80 bg-white/5 p-3 sm:p-6 flex flex-col gap-4 order-1 lg:order-2">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white">Edit Your Meme</h2>

        {/* Top Row Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <Upload size={20} />
            <span className="text-xs">Upload Image</span>
          </button>
          
          <button 
            onClick={addText}
            className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <Plus size={20} />
            <span className="text-xs">+ Add Text</span>
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <Settings size={20} />
            <span className="text-xs">Draw</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Text Input Fields */}
        <div className="flex flex-col gap-3">
          {texts.map((textItem, index) => (
            <div key={textItem.id} className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
              <input
                type="text"
                value={textItem.text}
                onChange={(e) => updateText(textItem.id, e.target.value)}
                className="flex-grow bg-black/20 p-2 rounded-lg border border-white/20 focus:outline-none text-white text-sm"
                placeholder={`Text position ${index + 1}`}
              />
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <button onClick={saveMeme} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-4 rounded-lg transition-colors text-sm">
            <Download size={20} />
            Download
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Text Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {texts.map((textItem) => (
              <div key={textItem.id} className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-semibold mb-3">"{textItem.text}"</h4>
                
                {/* Font Size */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Font Size: {textItem.fontSize}px</label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="2"
                    value={textItem.fontSize}
                    onChange={(e) => updateFontSize(textItem.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Font Family */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Font Family</label>
                  <select
                    value={textItem.fontFamily}
                    onChange={(e) => updateFontFamily(textItem.id, e.target.value)}
                    className="w-full bg-gray-600 p-2 rounded-lg border border-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableFonts.map((font) => (
                      <option key={font.value} value={font.name} className="bg-gray-700 text-white">
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Selection */}
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textItem.color}
                      onChange={(e) => updateColor(textItem.id, e.target.value)}
                      className="w-12 h-10 rounded-lg border border-gray-500 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={textItem.color}
                      onChange={(e) => updateColor(textItem.id, e.target.value)}
                      className="flex-grow bg-gray-600 p-2 rounded-lg border border-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => deleteText(textItem.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors text-sm"
                >
                  Delete Text
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPage;
