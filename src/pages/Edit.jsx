import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Text from "../components/Text";
import { exportComponentAsJPEG } from "react-component-export-image";
import { Download, Type, Trash2 } from "lucide-react";

const EditPage = () => {
  const [params] = useSearchParams();
  const [texts, setTexts] = useState([
    { id: 1, text: "Top Text" },
    { id: 2, text: "Bottom Text" },
  ]);

  const memeRef = useRef(null);
  const inputsContainerRef = useRef(null);

  useEffect(() => {
    if (inputsContainerRef.current) {
      const container = inputsContainerRef.current;
      container.scrollTop = container.scrollHeight;
      const lastInput = container.querySelector("input:last-of-type");
      if (lastInput) {
        lastInput.focus();
      }
    }
  }, [texts.length]);

  const addText = () => {
    setTexts([...texts, { id: Date.now(), text: "New Text" }]);
  };

  const updateText = (id, newText) => {
    const newTexts = texts.map((textItem) => {
      if (textItem.id === id) {
        return { ...textItem, text: newText };
      }
      return textItem;
    });
    setTexts(newTexts);
  };

  const deleteText = (id) => {
    setTexts(texts.filter((text) => text.id !== id));
  };

  return (
    <div
      className="w-full flex flex-col md:flex-row"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      {/* Left Side: Meme Preview */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8 bg-black">
        <div
          ref={memeRef}
          className="relative w-full max-w-lg aspect-square overflow-hidden"
        >
          <img
            src={params.get("url")}
            alt="Meme template"
            className="w-full h-full object-contain"
          />
          {texts.map((textItem, index) => (
            <Text
              key={textItem.id}
              textItem={textItem}
              onUpdate={updateText}
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

      {/* Right Side: Controls Panel */}
      <div className="w-full md:w-80 bg-white/5 p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white">
          Edit Your Meme
        </h2>

        <div
          ref={inputsContainerRef}
          className="flex flex-col gap-4 flex-grow overflow-y-auto"
        >
          {texts.map((textItem) => (
            <div key={textItem.id} className="flex items-center gap-2">
              <input
                type="text"
                value={textItem.text}
                onChange={(e) => updateText(textItem.id, e.target.value)}
                className="flex-grow bg-white/10 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
              <button
                onClick={() => deleteText(textItem.id)}
                className="p-3 text-red-500 hover:bg-red-500/20 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addText}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <Type size={20} />
          Add Text Box
        </button>

        <button
          onClick={() => exportComponentAsJPEG(memeRef)}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <Download size={20} />
          Save & Export
        </button>
      </div>
    </div>
  );
};

export default EditPage;
