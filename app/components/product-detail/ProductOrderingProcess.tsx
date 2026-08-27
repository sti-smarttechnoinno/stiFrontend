"use client";

import { ClipboardList, FileCheck, Boxes, Package, Handshake } from "lucide-react";
import { useScrollReveal } from "../../hooks";
import { useTranslations } from '@/app/[locale]/use-translations';

const stepIcons = [
  <ClipboardList size={22} />,
  <FileCheck size={22} />,
  <Boxes size={22} />,
  <Package size={22} />,
  <Handshake size={22} />
];

function StepCard({ num, icon, title, description, index }: { num: string; icon: React.ReactNode; title: string; description: string; index: number }) {
  const { ref, visible } = useScrollReveal(0.2);

  return (
    <div
      ref={ref}
      className={`relative z-10 flex flex-col items-center text-center transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="relative mb-6">
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-100 bg-white text-red-primary shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          {icon}
        </div>
        <span className="absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-red-primary text-[11px] font-bold text-white shadow-sm">
          {num}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="max-w-[220px] text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

import { usePathname } from "next/navigation";

const stepsData = {
  en: [
    { num: "01", title: "Order Request", description: "Submit your order request through our streamlined process." },
    { num: "02", title: "Confirmation", description: "Our team confirms and validates your order details." },
    { num: "03", title: "Preparation", description: "Products are carefully prepared and quality verified." },
    { num: "04", title: "Collection", description: "Collect your order or receive prompt delivery." },
    { num: "05", title: "Partner Support", description: "Continuous assistance and support after purchase." },
  ],
  ar: [
    { num: "01", title: "تقديم الطلب", description: "أرسل طلب التزود بالمنتجات عبر نموذج الطلب السريع." },
    { num: "02", title: "التأكيد والمراجعة", description: "يقوم فريقنا بمراجعة وتأكيد تفاصيل الطلبية." },
    { num: "03", title: "التجهيز والمطابقة", description: "تجهيز المنتجات والتحقق الدقيق من جودتها." },
    { num: "04", title: "الاستلام والتوصيل", description: "استلم طلبيتك أو استفد من خدمة التوصيل السريع." },
    { num: "05", title: "الدعم والتأطير", description: "متابعة ودعم مستمر لشركائنا بعد عملية الشراء." },
  ],
  fr: [
    { num: "01", title: "Demande de Commande", description: "Soumettez votre demande via notre processus simplifié." },
    { num: "02", title: "Confirmation", description: "Notre équipe valide les détails de votre commande." },
    { num: "03", title: "Préparation", description: "Les produits sont préparés et vérifiés avec soin." },
    { num: "04", title: "Réception & Livraison", description: "Récupérez votre commande ou bénéficiez d'une livraison rapide." },
    { num: "05", title: "Support Partenaire", description: "Assistance et accompagnement continu après l'achat." },
  ],
};

export default function ProductOrderingProcess() {
  const { ref, visible } = useScrollReveal();
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const staticT = {
    en: {
      badge: "Process",
      title: "How It Works",
      subtitle: "Simple steps from order to delivery",
    },
    ar: {
      badge: "مراحل الطلب",
      title: "كيفية الطلب والتزود",
      subtitle: "خطوات بسيطة وسلسة من الطلب إلى الاستلام",
    },
    fr: {
      badge: "Procédure",
      title: "Comment Ça Marche",
      subtitle: "Étapes simples de la commande à la livraison",
    },
  }[currentLocale] || {
    badge: "Process",
    title: "How It Works",
    subtitle: "Simple steps from order to delivery",
  };

  const steps = stepsData[currentLocale] || stepsData.en;

  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {staticT.badge}
          </span>
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            {staticT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500">
            {staticT.subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Connector Line - Perfectly centered through middle of icons */}
          <div className="absolute top-10 left-[10%] right-[10%] hidden h-[2px] bg-gradient-to-r from-red-primary/20 via-red-primary/50 to-red-primary/20 lg:block z-0" />

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <StepCard
                key={step.title}
                num={step.num}
                icon={stepIcons[i % stepIcons.length]}
                title={step.title}
                description={step.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}