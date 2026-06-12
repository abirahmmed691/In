import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import TrustStats from '../components/TrustStats';
import FeaturedBrands from '../components/FeaturedBrands';
import Payouts from '../components/Payouts';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-theme-surface">
      <Navbar />
      <main>
        <Hero />
        <FeaturedBrands />
        <HowItWorks />
        <Features />
        <TrustStats />
        <Payouts />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
