import { useEffect } from "react";
import axios from "axios";
import HomePage from "./HomePage";
import Encode from "./Encode/Encode";
import Decode from "./Decode/Decode";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

function App() {
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      const data = await response.data;
      console.log("Fetched users:", data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#07101f] text-white font-sans">
      <Routes>
        <Route path="/" element={<HomePage Link={Link} />} />
        <Route path="/encode" element={<Encode />} />
        <Route path="/decode" element={<Decode />} />
      </Routes>
    </div>
  );
}

export default App;
