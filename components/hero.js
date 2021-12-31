import CTA from "./cta";
import Features from "./features";
import Header from "./header";
import MainHero from "./mainhero";
import Footer from "./footer";
import HowItWorks from "./works";

export default function Hero() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <MainHero />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
