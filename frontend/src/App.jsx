import HomePage from "./HomePage";
import EncodePage from "./Encode/EncodePage";
import DecodePage from "./Decode/DecodePage";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-[#07101f] text-white font-sans">
      <Routes>
        <Route path="/" element={<HomePage Link={Link} />} />
        <Route path="/encode" element={<EncodePage />} />
        <Route path="/decode" element={<DecodePage />} />
      </Routes>
    </div>
  );
}

export default App;
