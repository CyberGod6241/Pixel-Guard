import { useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

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
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
