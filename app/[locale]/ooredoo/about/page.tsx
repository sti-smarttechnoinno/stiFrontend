import type { Metadata } from "next";
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Hero from '@/app/components/about/Hero';
import CompanyStory from '@/app/components/about/CompanyStory';
import WhyChoose from '@/app/components/WhyChoose';
import Timeline from '@/app/components/about/Timeline';
import Leadership from '@/app/components/about/Leadership';
import Statistics from '@/app/components/about/Statistics';
import Expertise from '@/app/components/about/Expertise';
import Partnership from '@/app/components/about/Partnership';
import Process from '@/app/components/about/Process';
import Gallery from '@/app/components/about/Gallery';
import Testimonials from '@/app/components/about/Testimonials';
import FAQ from '@/app/components/FAQ';
import FinalCTA from '@/app/components/FinalCTA';

export const metadata: Metadata = {
  title: "About STI | Official Ooredoo Distributor Algeria",
  description:
    "Learn more about SARL Smart Technologie Innovation (STI), official Ooredoo distributor providing innovative telecommunications, enterprise connectivity, SIM management and digital services throughout Algeria.",
  keywords: [
    "STI",
    "Ooredoo Distributor",
    "Telecommunication Algeria",
    "SIM Distribution",
    "Enterprise Connectivity",
    "Telecom Company Algeria",
  ],
  openGraph: {
    title: "About STI",
    description:
      "Learn more about SARL Smart Technologie Innovation (STI), official Ooredoo distributor providing innovative telecommunications throughout Algeria.",
    images: ["/assets/hero.png"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CompanyStory />
        <WhyChoose />
        <Timeline />
        <Leadership />
        <Statistics />
        <Expertise />
        <Partnership />
        <Process />
        <Gallery />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}