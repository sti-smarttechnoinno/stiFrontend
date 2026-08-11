"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I apply for a position at STI?",
    answer:
      "You can apply by filling out the application form on this page. Upload your CV, cover letter (optional), and any relevant certificates. Our team will review your application and contact you if you're a good fit.",
  },
  {
    question: "Which file formats are accepted for documents?",
    answer:
      "We accept PDF, DOC, and DOCX formats for CVs, cover letters, and certificates. Please ensure your files are clearly labeled with your full name.",
  },
  {
    question: "Can I apply without previous telecom experience?",
    answer:
      "Yes! We welcome candidates at all experience levels. Some positions are specifically designed for entry-level candidates, and we provide comprehensive training and mentorship programs.",
  },
  {
    question: "How long does the recruitment process take?",
    answer:
      "Our typical recruitment process takes 2-3 weeks from application to final decision. This includes CV review, interviews, and final evaluation.",
  },
  {
    question: "Will I receive confirmation after submitting my application?",
    answer:
      "Yes, you will receive confirmation acknowledging receipt of your application. Our HR team will then review your application and contact you for next steps.",
  },
];

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 py-5 transition-colors">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span
          className="text-base sm:text-lg font-bold text-gray-900 pr-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 text-red-primary"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pt-3">
              <p className="text-sm sm:text-base leading-relaxed text-gray-500">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { usePathname } from "next/navigation";

export default function CareerFAQ() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const staticT = {
    en: {
      badge: "Career Support",
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions about our recruitment process.",
      faqs: [
        {
          question: "How do I apply for a position at STI?",
          answer: "You can apply by filling out the application form on this page. Upload your CV, cover letter (optional), and any relevant certificates. Our team will review your application and contact you if you're a good fit.",
        },
        {
          question: "Which file formats are accepted for documents?",
          answer: "We accept PDF, DOC, and DOCX formats for CVs, cover letters, and certificates. Please ensure your files are clearly labeled with your full name.",
        },
        {
          question: "Can I apply without previous telecom experience?",
          answer: "Yes! We welcome candidates at all experience levels. Some positions are specifically designed for entry-level candidates, and we provide comprehensive training and mentorship programs.",
        },
        {
          question: "How long does the recruitment process take?",
          answer: "Our typical recruitment process takes 2-3 weeks from application to final decision. This includes CV review, interviews, and final evaluation.",
        },
        {
          question: "Will I receive confirmation after submitting my application?",
          answer: "Yes, you will receive confirmation acknowledging receipt of your application. Our HR team will then review your application and contact you for next steps.",
        },
      ],
    },
    ar: {
      badge: "دعم التوظيف",
      title: "الأسئلة الشائعة حول التوظيف",
      subtitle: "إليك إجابات على الأسئلة الأكثر تكراراً حول مسار ومراحل التوظيف لدينا.",
      faqs: [
        {
          question: "كيف يمكنني التقديم على وظيفة في STI؟",
          answer: "يمكنك التقديم عن طريق ملء نموذج التقديم في هذه الصفحة وإرفاق سيرتك الذاتية. سيقوم فريقنا بمراجعة ملفك والتواصل معك.",
        },
        {
          question: "ما هي صيغ الملفات المقبولة لإرفاق الوثائق؟",
          answer: "نقبل صيغ PDF و DOC و DOCX للسيرة الذاتية والشهادات. يرجى التأكد من تسمية الملفات باسمك الكامل.",
        },
        {
          question: "هل يمكنني التقديم بدون خبرة سابقة في قطاع الاتصالات؟",
          answer: "نعم! نرحب بالكفاءات من جميع مستويات الخبرة، ونوفر برامج تدريبية وتأهيلية لمختلف الوظائف.",
        },
        {
          question: "كم تستغرق عملية التوظيف؟",
          answer: "تستغرق عملية التوظيف عادة من أسبوعين إلى 3 أسابيع تشمل دراسة الملفات، المقابلات، والتقييم النهائي.",
        },
        {
          question: "هل سأتلقى تأكيداً بعد إرسال طلبي؟",
          answer: "نعم، ستظهر لك رسالة تأكيد باستلام الطلب بنجاح، وستتواصل معك إدارة الموارد البشرية للمراحل القادمة.",
        },
      ],
    },
    fr: {
      badge: "Support Carrières",
      title: "Foire Aux Questions",
      subtitle: "Trouvez les réponses aux questions fréquentes sur notre processus de recrutement.",
      faqs: [
        {
          question: "Comment postuler pour un poste chez STI ?",
          answer: "Vous pouvez postuler en remplissant le formulaire de candidature sur cette page et en joignant votre CV.",
        },
        {
          question: "Quels formats de fichier sont acceptés ?",
          answer: "Nous acceptons les formats PDF, DOC et DOCX pour vos documents et CV.",
        },
        {
          question: "Puis-je postuler sans expérience dans les télécoms ?",
          answer: "Oui ! Nous accueillons tous les niveaux d'expérience et proposons des programmes de formation adaptés.",
        },
        {
          question: "Combien de temps dure le processus de recrutement ?",
          answer: "Notre processus dure généralement 2 à 3 semaines, entre l'étude du CV, les entretiens et la décision finale.",
        },
        {
          question: "Vais-je recevoir une confirmation après l'envoi ?",
          answer: "Oui, une confirmation s'affiche dès l'envoi. Notre équipe RH vous recontactera pour les étapes suivantes.",
        },
      ],
    },
  }[currentLocale] || {
    badge: "Career Support",
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our recruitment process.",
    faqs: [
      {
        question: "How do I apply for a position at STI?",
        answer: "You can apply by filling out the application form on this page. Upload your CV, cover letter (optional), and any relevant certificates. Our team will review your application and contact you if you're a good fit.",
      },
      {
        question: "Which file formats are accepted for documents?",
        answer: "We accept PDF, DOC, and DOCX formats for CVs, cover letters, and certificates. Please ensure your files are clearly labeled with your full name.",
      },
      {
        question: "Can I apply without previous telecom experience?",
        answer: "Yes! We welcome candidates at all experience levels. Some positions are specifically designed for entry-level candidates, and we provide comprehensive training and mentorship programs.",
      },
      {
        question: "How long does the recruitment process take?",
        answer: "Our typical recruitment process takes 2-3 weeks from application to final decision. This includes CV review, interviews, and final evaluation.",
      },
      {
        question: "Will I receive confirmation after submitting my application?",
        answer: "Yes, you will receive confirmation acknowledging receipt of your application. Our HR team will then review your application and contact you for next steps.",
      },
    ],
  };

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {staticT.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {staticT.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {staticT.subtitle}
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          {staticT.faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => toggleFaq(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}