import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
function HomePage({ Link }) {
  return (
    <div>
      <Navbar />
      <Hero Link={Link} />
      <HowItWorks />
      <About />
      <FAQ />
      <Footer />
    </div>
  );
}

export default HomePage;
