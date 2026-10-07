import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Design } from "./components/design/Design";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Development } from "./components/projects/Development";
import { Skills } from "./components/Skills";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  useReveal();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Experience />
        <Development />
        <Design />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
