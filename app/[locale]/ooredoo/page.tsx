import Navbar from '@/app/components/Navbar';
import Hero from '@/app/components/Hero';
import Partnership from '@/app/components/Partnership';
import Statistics from '@/app/components/Statistics';
import Services from '@/app/components/Services';
import WhyChoose from '@/app/components/WhyChoose';
import Products from '@/app/components/Products';
import Enterprise from '@/app/components/Enterprise';
import Process from '@/app/components/Process';
import Testimonials from '@/app/components/Testimonials';
import TrustedPartners from '@/app/components/TrustedPartners';
import LatestNews from '@/app/components/LatestNews';
import FAQ from '@/app/components/FAQ';
import FinalCTA from '@/app/components/FinalCTA';
import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Partnership />
        <Statistics />
        <Services />
        <WhyChoose />
        <Products />
        <Enterprise />
        <Process />
        <Testimonials />
        <TrustedPartners />
        <LatestNews />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}