import { useState } from "react";
import HomePage from "./HomePage";
import EncodePage from "./Encode/EncodePage";
import DecodePage from "./Decode/DecodePage";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [encoding, setEncoding] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-screen bg-[#07101f] text-white font-sans">
      <Routes>
        <Route path="/" element={<HomePage Link={Link} />} />
        <Route
          path="/encode"
          element={
            <EncodePage
              image={image}
              setImage={setImage}
              message={message}
              setMessage={setMessage}
              progress={progress}
              setProgress={setProgress}
              encoding={encoding}
              setEncoding={setEncoding}
              done={done}
              setDone={setDone}
            />
          }
        />
        <Route path="/decode" element={<DecodePage />} />
      </Routes>
    </div>
  );
}

export default App;
