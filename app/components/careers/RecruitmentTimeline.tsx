"use client";

import { usePathname } from "next/navigation";
import { ClipboardList, FileSearch, MessageSquare, CheckCircle, PartyPopper } from "lucide-react";
import { useScrollReveal } from "../../hooks";

const stepIcons = [
  <ClipboardList size={22} />,
  <FileSearch size={22} />,
  <MessageSquare size={22} />,
  <CheckCircle size={22} />,
  <PartyPopper size={22} />
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
      <p className="max-w-[200px] text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default function RecruitmentTimeline() {
  const { ref, visible } = useScrollReveal();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const staticT = {
    en: {
      badge: "Hiring Process",
      title: "Our Recruitment Process",
      subtitle: "A transparent and straightforward journey to joining SARL STI.",
      steps: [
        { num: "01", title: "Submit Application", description: "Send your CV and application." },
        { num: "02", title: "CV Review", description: "Our HR team evaluates your profile." },
        { num: "03", title: "Interview", description: "Discuss your skills with our hiring team." },
        { num: "04", title: "Final Evaluation", description: "Assessment and offer preparation." },
        { num: "05", title: "Welcome to STI", description: "Onboarding and joining the team!" },
      ],
    },
    ar: {
      badge: "مسار التوظيف",
      title: "مراحل التوظيف لدينا",
      subtitle: "رحلة شفافة ومبسطة للانضمام إلى فريق شركة STI.",
      steps: [
        { num: "01", title: "تقديم الطلب", description: "إرسال السيرة الذاتية وطلب التوظيف." },
        { num: "02", title: "دراسـة الملف", description: "تقييم ملفك من قبل فريق الموارد البشرية." },
        { num: "03", title: "المقابلة الشخصية", description: "مناقشة مؤهلاتك ومهاراتك مع فريق التوظيف." },
        { num: "04", title: "التقييم النهائي", description: "التقييم الشامل وإعداد عرض العمل." },
        { num: "05", title: "مرحباً بك في STI", description: "الانضمام للفريق وبداية العمل!" },
      ],
    },
    fr: {
      badge: "Processus de Recrutement",
      title: "Notre Processus de Recrutement",
      subtitle: "Un parcours transparent et simple pour rejoindre SARL STI.",
      steps: [
        { num: "01", title: "Candidature", description: "Envoyez votre CV et votre demande." },
        { num: "02", title: "Étude du Dossier", description: "Évaluation de votre profil par notre équipe RH." },
        { num: "03", title: "Entretien", description: "Échangez sur vos compétences avec l'équipe." },
        { num: "04", title: "Évaluation Finale", description: "Évaluation globale et offre d'emploi." },
        { num: "05", title: "Bienvenue chez STI", description: "Intégration et prise de poste !" },
      ],
    },
  }[currentLocale] || {
    badge: "Hiring Process",
    title: "Our Recruitment Process",
    subtitle: "A transparent and straightforward journey to joining SARL STI.",
    steps: [
      { num: "01", title: "Submit Application", description: "Send your CV and application." },
      { num: "02", title: "CV Review", description: "Our HR team evaluates your profile." },
      { num: "03", title: "Interview", description: "Discuss your skills with our hiring team." },
      { num: "04", title: "Final Evaluation", description: "Assessment and offer preparation." },
      { num: "05", title: "Welcome to STI", description: "Onboarding and joining the team!" },
    ],
  };

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
          {/* Timeline Connector Line */}
          <div className="absolute top-10 left-[10%] right-[10%] hidden h-[2px] bg-gradient-to-r from-red-primary/20 via-red-primary/50 to-red-primary/20 lg:block z-0" />

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {staticT.steps.map((step, i) => (
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