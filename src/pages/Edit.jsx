import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Text from "../components/Text";
import { Download, Type, Trash2 } from "lucide-react";

const EditPage = () => {
  const [params] = useSearchParams();
  const [texts, setTexts] = useState([
    { id: 1, text: "Top Text", fontSize: 40 },
    { id: 2, text: "Bottom Text", fontSize: 40 },
  ]);

  const memeRef = useRef(null);
  const inputsContainerRef = useRef(null);

  useEffect(() => {
    if (inputsContainerRef.current) {
      const container = inputsContainerRef.current;
      container.scrollTop = container.scrollHeight;
      const lastInput = container.querySelector("input:last-of-type");
      if (lastInput) lastInput.focus();
    }
  }, [texts.length]);

  const addText = () => {
    setTexts([...texts, { id: Date.now(), text: "New Text", fontSize: 40 }]);
  };

  const updateText = (id, newText) => {
    setTexts(texts.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const updateFontSize = (id, size) => {
    setTexts(texts.map(t => t.id === id ? { ...t, fontSize: size } : t));
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

            const x = textRect.left - containerRect.left + textRect.width / 2;
            const y = textRect.top - containerRect.top + textRect.height / 2;

            ctx.font = `${textItem.fontSize || 40}px Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif`;
            ctx.fillStyle = 'white';
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

      img.src = params.get("url");
    } catch (error) {
      console.error('Error saving meme:', error);
      alert('Failed to save meme. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row" style={{ minHeight: "calc(100vh - 80px)" }}>
      <div className="flex-grow flex items-center justify-center p-2 sm:p-4 lg:p-8 bg-black order-2 lg:order-1">
        <div ref={memeRef} className="relative w-full max-w-lg aspect-square overflow-hidden">
          <img src={params.get("url")} alt="Meme template" className="w-full h-full object-contain" />
          {texts.map((textItem, index) => (
            <Text
              key={textItem.id}
              textItem={textItem}
              onDelete={deleteText}
              defaultStyle={
                index === 0
                  ? { top: "10%", left: "50%" }
                  : index === 1
                  ? { top: "85%", left: "50%" }
                  : { top: "50%", left: "50%" }
              }
            />
          ))}
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white/5 p-3 sm:p-6 flex flex-col gap-4 order-1 lg:order-2">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white">Edit Your Meme</h2>

        <div ref={inputsContainerRef} className="flex flex-col gap-4 flex-grow overflow-y-auto">
          {texts.map((textItem) => (
            <div key={textItem.id} className="flex flex-col gap-2 bg-white/10 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={textItem.text}
                  onChange={(e) => updateText(textItem.id, e.target.value)}
                  className="flex-grow bg-black/20 p-2 rounded-lg border border-white/20 focus:outline-none text-white text-sm sm:text-base"
                />
                <button onClick={() => deleteText(textItem.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg">
                  <Trash2 size={20} />
                </button>
              </div>
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
          ))}
        </div>

        <button onClick={addText} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
          <Type size={20} />
          Add Text Box
        </button>

        <button onClick={saveMeme} className="cursor-pointer w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 font-semibold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
          <Download size={20} />
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPage;
