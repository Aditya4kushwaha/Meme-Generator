// src/pages/Edit.jsx
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Text from "../components/Text";
import {
  Download,
  Upload,
  Plus,
  Settings,
  X,
  ArrowLeft,
} from "lucide-react";

const EditPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [texts, setTexts] = useState([
    {
      id: 1,
      text: "Text Position 1",
      fontSize: 40,
      color: "#FFFFFF",
      fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      position: "top",
    },
    {
      id: 2,
      text: "Text Position 2",
      fontSize: 40,
      color: "#FFFFFF",
      fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      position: "bottom",
    },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTextId, setEditingTextId] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const memeRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const url = params.get("url");
    if (url) {
      setImageSrc(url);
    }
  }, [params]);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Sorry, there was an error uploading that file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const addText = () => {
    setTexts([
      ...texts,
      {
        id: Date.now(),
        text: "New Text",
        fontSize: 40,
        color: "#FFFFFF",
        fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
        position: "center",
      },
    ]);
  };

  const updateText = (id, newText) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  const updateFontSize = (id, size) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, fontSize: size } : t)));
  };

  const updateColor = (id, color) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, color: color } : t)));
  };

  const updateFontFamily = (id, fontFamily) => {
    setTexts(texts.map((t) => (t.id === id ? { ...t, fontFamily: fontFamily } : t)));
  };

  const deleteText = (id) => {
    setTexts(texts.filter((t) => t.id !== id));
  };

  const openSettingsFor = (id) => {
    setEditingTextId(id);
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setEditingTextId(null);
  };

  const generateMemeCanvas = () => {
    return new Promise((resolve, reject) => {
      if (!memeRef.current || !imageSrc) {
        reject(new Error("Image or meme container not found."));
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const memeContainer = memeRef.current;
      const rect = memeContainer.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasAspectRatio = canvas.width / canvas.height;
        let renderWidth, renderHeight, offsetX, offsetY;

        if (imageAspectRatio > canvasAspectRatio) {
          renderWidth = canvas.width;
          renderHeight = canvas.width / imageAspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - renderHeight) / 2;
        } else {
          renderHeight = canvas.height;
          renderWidth = canvas.height * imageAspectRatio;
          offsetX = (canvas.width - renderWidth) / 2;
          offsetY = 0;
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

        texts.forEach((textItem) => {
          const textElement = memeContainer.querySelector(
            `[data-text-id="${textItem.id}"]`
          );
          if (textElement) {
            const textRect = textElement.getBoundingClientRect();
            const containerRect = memeContainer.getBoundingClientRect();
            const x = textRect.left - containerRect.left + textRect.width / 2;
            const y = textRect.top - containerRect.top + textRect.height / 2;

            ctx.font = `${textItem.fontSize || 40}px ${textItem.fontFamily}`;
            ctx.fillStyle = textItem.color || "#FFFFFF";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.strokeText(textItem.text, x, y);
            ctx.fillText(textItem.text, x, y);
          }
        });
        resolve(canvas);
      };
      img.onerror = (err) => reject(err);
      img.src = imageSrc;
    });
  };

  const downloadMeme = async () => {
    try {
      const canvas = await generateMemeCanvas();
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "meme.png"; // ✅ always saves as meme.png
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Error downloading meme:", error);
      alert("Failed to download meme. Please try again.");
    }
  };

  const textToEdit = texts.find((t) => t.id === editingTextId);

  return (
    <div className="w-full flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* Back button */}
      {/* <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md border border-white/20 text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div> */}

      {/* Meme Canvas */}
      <div className="flex-grow flex items-center justify-center p-2 sm:p-4 lg:p-8 bg-black order-2 lg:order-1">
        <div
          ref={memeRef}
          className="relative w-full max-w-lg aspect-square overflow-hidden bg-black/20 flex items-center justify-center rounded-lg border border-dashed border-white/20"
        >
          {imageSrc ? (
            <>
              <img src={imageSrc} alt="Meme template" className="w-full h-full object-contain" />
              {texts.map((textItem) => (
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
            </>
          ) : (
            <div className="text-center text-gray-400 p-8">
              <h3 className="text-xl font-semibold">Meme Centre</h3>
              <p className="text-sm">Select a template or upload your own image to start creating.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white/5 p-3 sm:p-6 flex flex-col gap-4 order-1 lg:order-2">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white">Edit Your Meme</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Upload image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <Upload size={20} />
            <span className="text-xs">Upload Image</span>
          </button>

          {/* Add text */}
          <button
            onClick={addText}
            className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <Plus size={20} />
            <span className="text-xs">+ Add Text</span>
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

        {/* Text editor list */}
        <div className="flex flex-col gap-3">
          {texts.map((textItem, index) => (
            <div
              key={textItem.id}
              className="flex items-center gap-2 bg-white/10 p-3 rounded-lg"
            >
              <input
                type="text"
                value={textItem.text}
                onChange={(e) => updateText(textItem.id, e.target.value)}
                className="flex-grow bg-black/20 p-2 rounded-lg border border-white/20 focus:outline-none text-white text-sm"
                placeholder={`Text position ${index + 1}`}
              />
              <button
                onClick={() => openSettingsFor(textItem.id)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Download button */}
        <div className="flex flex-col gap-3 mt-auto">
          <button
            onClick={downloadMeme}
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-4 rounded-lg transition-colors text-sm"
          >
            <Download size={20} />
            Download
          </button>
        </div>
      </div>

      {/* Text settings modal */}
      {showSettings && textToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Edit Text</h3>
              <button
                onClick={closeSettings}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-white font-semibold mb-3">
                "{textToEdit.text}"
              </h4>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">
                  Font Size: {textToEdit.fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="2"
                  value={textToEdit.fontSize}
                  onChange={(e) =>
                    updateFontSize(textToEdit.id, parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">
                  Font Family
                </label>
                <select
                  value={textToEdit.fontFamily}
                  onChange={(e) =>
                    updateFontFamily(textToEdit.id, e.target.value)
                  }
                  className="w-full bg-gray-600 p-2 rounded-lg border border-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableFonts.map((font) => (
                    <option
                      key={font.value}
                      value={font.value}
                      className="bg-gray-700 text-white"
                    >
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textToEdit.color}
                    onChange={(e) =>
                      updateColor(textToEdit.id, e.target.value)
                    }
                    className="w-12 h-10 rounded-lg border border-gray-500 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={textToEdit.color}
                    onChange={(e) =>
                      updateColor(textToEdit.id, e.target.value)
                    }
                    className="flex-grow bg-gray-600 p-2 rounded-lg border border-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  deleteText(textToEdit.id);
                  closeSettings();
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors text-sm"
              >
                Delete Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPage;
