import { useEffect, useState } from "react";
import MemeCard from "../components/Card";
import { GetAllMemes } from "../api/meme";

const Homepage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    GetAllMemes().then((memes) => setData(memes.data.memes));
  }, []);
  return (
    <div className="row">
      {data.map((el) => (
        <MemeCard img={el.url} title = {el.name} />
      ))}
    </div>
  );
};

export default Homepage;
