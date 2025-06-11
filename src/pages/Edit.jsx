import { useState, createRef } from "react";
import { useSearchParams } from "react-router-dom";
import Text from "../components/Text";
import { exportComponentAsJPEG } from "react-component-export-image";

const EditPage = () => {
  const [params] = useSearchParams();
  const [count, setCount] = useState(0);

  const memeRef = createRef();

  const addText = () => {
    setCount(count + 1);
  };

  return (
    <div style={{text : "white"}}>
      <div style={{width : "700px", border : "1px solid"}} ref={memeRef} className="meme mt-5 mb-5">
        <img src={params.get("url")} alt="" style={{ width: "250px" }} />
        {Array(count)
          .fill(0)
          .map((e) => (
            <Text />
          ))}
      </div>
      <button
        onClick={addText}
        style={{ margin: "10px"}}
      >
        Add Text
      </button>
      <button onClick={(e) => exportComponentAsJPEG(memeRef)}>Save</button>
    </div>
  );
};

export default EditPage;
