import Nav from "../components/Nav";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Download from "../components/Download";
import IosInstall from "../components/IosInstall";
import Setup from "../components/Setup";
import Faq from "../components/Faq";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Download />
        <IosInstall />
        <Setup />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
