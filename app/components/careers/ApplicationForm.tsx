"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Upload, Send, FileText, CheckCircle, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Globe, DollarSign, Calendar } from "lucide-react";

const positions = [
  "Sales Representative",
  "Distribution Coordinator",
  "Warehouse Assistant",
  "Customer Support Agent",
  "Marketing Executive",
  "Administrative Assistant",
];

export default function ApplicationForm() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const staticT = {
    en: {
      badge: "Apply Now",
      title: "Submit Your Application",
      subtitle: "Fill out the form below to apply for an open position at SARL STI.",
      submittedTitle: "Application Submitted!",
      submittedDesc: "Your application has been submitted successfully. Our team will review your application and contact you soon.",
      personalInfo: "Personal Information",
      firstName: "First Name *",
      lastName: "Last Name *",
      email: "Email *",
      phone: "Phone Number *",
      city: "City / Province *",
      nationality: "Nationality",
      professionalInfo: "Professional Information",
      position: "Target Position *",
      selectPosition: "Select a position",
      experience: "Years of Experience *",
      selectExperience: "Select experience level",
      education: "Education Level *",
      selectEducation: "Select education level",
      linkedin: "LinkedIn Profile",
      portfolio: "Portfolio / Website Link",
      salary: "Expected Salary (DZD / Month)",
      availability: "Notice Period / Availability *",
      documents: "Documents",
      uploadCv: "Upload CV (PDF, DOCX) *",
      uploadCover: "Upload Cover Letter (Optional)",
      uploadCert: "Upload Certificates (Optional)",
      chooseFile: "Choose File",
      messageHeader: "Additional Information",
      messageLabel: "Cover Note / Additional Comments",
      agreeLabel: "I confirm that all provided information is accurate and agree to STI storing my application for recruitment purposes.",
      submitBtn: "Submit Application",
      submittingBtn: "Submitting Application...",
    },
    ar: {
      badge: "قدّم الآن",
      title: "إرسال طلب التوظيف",
      subtitle: "يرجى ملء النموذج أدناه للتقديم على إحدى الوظائف الشاغرة لدى شركة STI.",
      submittedTitle: "تم إرسال الطلب بنجاح!",
      submittedDesc: "تم استلام طلبك بنجاح. سيقوم فريق الموارد البشرية بمراجعة ملفك والتواصل معك في أقرب وقت.",
      personalInfo: "المعلومات الشخصية",
      firstName: "الاسم الأول *",
      lastName: "اللقب *",
      email: "البريد الإلكتروني *",
      phone: "رقم الهاتف *",
      city: "المدينة / الولاية *",
      nationality: "الجنسية",
      professionalInfo: "المعلومات المهنية",
      position: "الوظيفة المستهدفة *",
      selectPosition: "اختر الوظيفة",
      experience: "سنوات الخبرة *",
      selectExperience: "اختر مستوى الخبرة",
      education: "المستوى العلمي *",
      selectEducation: "اختر المستوى العلمي",
      linkedin: "رابط حساب لينكد إن",
      portfolio: "رابط معرض الأعمال / الموقع",
      salary: "الراتب المتوقع (دج / شهرياً)",
      availability: "الفترة المتاحة للالتحاق بالعمل *",
      documents: "الوثائق والملفات",
      uploadCv: "رفع السيرة الذاتية (PDF, DOCX) *",
      uploadCover: "رفع رسالة التغطية (اختياري)",
      uploadCert: "رفع الشهادات (اختياري)",
      chooseFile: "اختر ملفاً",
      messageHeader: "معلومات إضافية",
      messageLabel: "ملاحظات إضافية أو رسالة توضيحية",
      agreeLabel: "أؤكد أن جميع المعلومات المقدمة صحيحة وأوافق على الاحتفاظ بملفي لأغراض التوظيف لدى STI.",
      submitBtn: "إرسال طلب التوظيف",
      submittingBtn: "جاري إرسال الطلب...",
    },
    fr: {
      badge: "Postuler Maintenant",
      title: "Soumettre Votre Candidature",
      subtitle: "Remplissez le formulaire ci-dessous pour postuler à un poste chez SARL STI.",
      submittedTitle: "Candidature Envoyée !",
      submittedDesc: "Votre candidature a été envoyée avec succès. Notre équipe RH examinera votre dossier et vous recontactera.",
      personalInfo: "Informations Personnelles",
      firstName: "Prénom *",
      lastName: "Nom *",
      email: "Email *",
      phone: "Numéro de Téléphone *",
      city: "Ville / Wilaya *",
      nationality: "Nationalité",
      professionalInfo: "Informations Professionnelles",
      position: "Poste Visé *",
      selectPosition: "Sélectionnez un poste",
      experience: "Années d'Expérience *",
      selectExperience: "Sélectionnez le niveau d'expérience",
      education: "Niveau d'Études *",
      selectEducation: "Sélectionnez le niveau d'études",
      linkedin: "Profil LinkedIn",
      portfolio: "Lien Portfolio / Site Web",
      salary: "Prétentions Salariales (DZD / Mois)",
      availability: "Préavis / Disponibilité *",
      documents: "Documents",
      uploadCv: "Télécharger CV (PDF, DOCX) *",
      uploadCover: "Télécharger Lettre de Motivation (Optionnel)",
      uploadCert: "Télécharger Certificats (Optionnel)",
      chooseFile: "Choisir un fichier",
      messageHeader: "Informations Complémentaires",
      messageLabel: "Remarques ou Message Complémentaire",
      agreeLabel: "Je confirme que les informations fournies sont exactes et j'accepte le traitement de mes données pour le recrutement.",
      submitBtn: "Soumettre la Candidature",
      submittingBtn: "Envoi en cours...",
    },
  }[currentLocale] || {
    badge: "Apply Now",
    title: "Submit Your Application",
    subtitle: "Fill out the form below to apply for an open position at SARL STI.",
    submittedTitle: "Application Submitted!",
    submittedDesc: "Your application has been submitted successfully. Our team will review your application and contact you soon.",
    personalInfo: "Personal Information",
    firstName: "First Name *",
    lastName: "Last Name *",
    email: "Email *",
    phone: "Phone Number *",
    city: "City / Province *",
    nationality: "Nationality",
    professionalInfo: "Professional Information",
    position: "Target Position *",
    selectPosition: "Select a position",
    experience: "Years of Experience *",
    selectExperience: "Select experience level",
    education: "Education Level *",
    selectEducation: "Select education level",
    linkedin: "LinkedIn Profile",
    portfolio: "Portfolio / Website Link",
    salary: "Expected Salary (DZD / Month)",
    availability: "Notice Period / Availability *",
    documents: "Documents",
    uploadCv: "Upload CV (PDF, DOCX) *",
    uploadCover: "Upload Cover Letter (Optional)",
    uploadCert: "Upload Certificates (Optional)",
    chooseFile: "Choose File",
    messageHeader: "Additional Information",
    messageLabel: "Cover Note / Additional Comments",
    agreeLabel: "I confirm that all provided information is accurate and agree to STI storing my application for recruitment purposes.",
    submitBtn: "Submit Application",
    submittingBtn: "Submitting Application...",
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    nationality: "",
    position: "",
    experience: "",
    education: "",
    linkedin: "",
    portfolio: "",
    salary: "",
    availability: "",
    message: "",
    agree: false,
  });

  const [cvName, setCvName] = useState<string | null>(null);
  const [coverName, setCoverName] = useState<string | null>(null);
  const [certName, setCertName] = useState<string | null>(null);

  const [cvFileObj, setCvFileObj] = useState<{ name: string; url: string } | null>(null);
  const [coverFileObj, setCoverFileObj] = useState<{ name: string; url: string } | null>(null);
  const [certFileObj, setCertFileObj] = useState<{ name: string; url: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hpWebsite, setHpWebsite] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (
    file: File | undefined,
    setName: (name: string | null) => void,
    setObj: (obj: { name: string; url: string } | null) => void
  ) => {
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setObj({ name: file.name, url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        candidate_name: `${formData.firstName} ${formData.lastName}`.trim(),
        cv_file: cvFileObj || cvName,
        cover_file: coverFileObj || coverName,
        cert_file: certFileObj || certName,
        hp_website: hpWebsite,
      };

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.error || "Failed to submit application.");
      }
    } catch {
      setErrorMessage("Network error. Please try submitting again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="apply" className="py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3
              className="text-2xl font-extrabold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {staticT.submittedTitle}
            </h3>
            <p className="text-gray-500">
              {staticT.submittedDesc}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
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

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Anti-Spam Honeypot (Hidden) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="hp_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hpWebsite}
                  onChange={(e) => setHpWebsite(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-2">
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}
              {/* Personal Information */}
              <div>
                <h3
                  className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <User size={20} className="text-red-primary" />
                  {staticT.personalInfo}
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.firstName}</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.lastName}</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.email}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.phone}</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.city}</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.nationality}</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3
                  className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Briefcase size={20} className="text-red-primary" />
                  {staticT.professionalInfo}
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.position}</label>
                    <select
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    >
                      <option value="">{staticT.selectPosition}</option>
                      {positions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.experience}</label>
                    <input
                      type="text"
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.education}</label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.linkedin}</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.portfolio}</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.salary}</label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.availability}</label>
                    <input
                      type="text"
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary"
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h3
                  className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <FileText size={20} className="text-red-primary" />
                  {staticT.documents}
                </h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.uploadCv}</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-red-primary/50 hover:bg-red-primary/5 transition-all duration-300">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 text-center px-2">
                        {cvName || staticT.chooseFile}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">PDF, DOC, DOCX</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], setCvName, setCvFileObj)}
                      />
                    </label>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.uploadCover}</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-red-primary/50 hover:bg-red-primary/5 transition-all duration-300">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 text-center px-2">
                        {coverName || staticT.chooseFile}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">PDF, DOC, DOCX</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], setCoverName, setCoverFileObj)}
                      />
                    </label>
                  </div>

                  {/* Certificates */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.uploadCert}</label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-red-primary/50 hover:bg-red-primary/5 transition-all duration-300">
                      <Upload size={24} className="text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500 text-center px-2">
                        {certName || staticT.chooseFile}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">PDF, DOC, DOCX</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={(e) => handleFileUpload(e.target.files?.[0], setCertName, setCertFileObj)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{staticT.messageHeader}</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary resize-none"
                  placeholder={staticT.messageLabel}
                />
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-red-primary focus:ring-red-primary/20 mt-0.5"
                />
                <span className="text-sm text-gray-500">
                  {staticT.agreeLabel}
                </span>
              </label>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-red-primary text-white font-semibold text-sm rounded-full transition-all duration-300 hover:bg-red-primary/95 hover:shadow-xl hover:shadow-red-primary/25 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{staticT.submittingBtn}</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>{staticT.submitBtn}</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}