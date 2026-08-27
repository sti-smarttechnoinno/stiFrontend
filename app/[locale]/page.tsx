import { Hero } from "@/app/components/sti-home/hero";
import { TrustStrip } from "@/app/components/sti-home/trust-strip";
import { OoredooSection } from "@/app/components/sti-home/ooredoo-section";
import { VivoSection } from "@/app/components/sti-home/vivo-section";
import { ServicesSection } from "@/app/components/sti-home/services-section";
import { WhySti } from "@/app/components/sti-home/why-sti";
import { SpacesNav } from "@/app/components/sti-home/spaces-nav";
import { FaqSection } from "@/app/components/sti-home/faq-section";
import { ContactCta } from "@/app/components/sti-home/contact-cta";
import { SiteFooter } from "@/app/components/sti-home/site-footer";

export default function LocalizedHomePage() {
  return (
    <main className="min-h-screen bg-background pt-9">
      <Hero />
      <TrustStrip />
      <OoredooSection />
      <VivoSection />
      <ServicesSection />
      <WhySti />
      <SpacesNav />
      <FaqSection />
      <ContactCta />
      <SiteFooter />
    </main>
  );
}

