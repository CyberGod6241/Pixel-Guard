import { useEffect } from "react";
import axios from "axios";
import HomePage from "./HomePage";
import EncodePage from "./Encode/EncodePage";
import DecodePage from "./Decode/DecodePage";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

function App() {
  //Encoding test
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [encoding, setEncoding] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const handleEncode = async () => {
      // 1. Create the 'suitcase'
      const formData = new FormData();

      //2. Add the image file to the suitcase
      const imageFile = new File([image], "test-image.png", {
        type: "image/png",
      });
      formData.append("image", imageFile);
      // 3. Add the text message to the suitcase
      formData.append("message", message);
      try {
        const response = await axios.post(
          "http://localhost:8080/encode",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        const data = await response.data;
        console.log("Success", data);
      } catch (error) {
        console.error("Error encoding image:", error);
      }
    };
    if (encoding) handleEncode();
  }, [image, message, encoding]);

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
