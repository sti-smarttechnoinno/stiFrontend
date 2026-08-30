"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  User,
  Clock,
  MessageCircle,
  Link2,
  Check,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  PackageCheck,
  Headphones,
  TrendingUp,
  Quote,
  Share2,
} from "lucide-react";
import { NewsArticle, convertApiItemToNewsArticle, getRelatedArticles, getAdjacentArticles, localizeCategory } from '@/app/data/news-articles';
import NewsletterSection from '@/app/components/news/NewsletterSection';
import { useTranslations } from '@/app/[locale]/use-translations';

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

function formatPublishedDate(dateStr: string = "", locale: string = "fr") {
  if (!dateStr) return "";
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    const lang = locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US";
    return new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" }).format(new Date(parsed));
  }
  const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthsFr = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
  const monthsAr = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  
  let formatted = dateStr;
  for (let i = 0; i < 12; i++) {
    const reg = new RegExp(`\\b${monthsEn[i]}[a-z]*\\b`, 'i');
    if (reg.test(formatted)) {
      if (locale === "fr") formatted = formatted.replace(reg, monthsFr[i]);
      if (locale === "ar") formatted = formatted.replace(reg, monthsAr[i]);
    }
  }
  return formatted;
}

function formatReadingTime(timeStr: string = "", minReadLabel: string = "min read", locale: string = "fr") {
  const num = (timeStr || "").match(/\d+/)?.[0] || "3";
  if (locale === "ar") {
    if (num === "1") return "دقيقة واحدة للقراءة";
    if (num === "2") return "دقيقتان للقراءة";
    return `${num} ${minReadLabel}`;
  }
  return `${num} ${minReadLabel}`;
}

function parseMarkdownContent(content: string = "") {
  const sections: { type: string; content: string; level?: number }[] = [];
  const lines = (content || "").split("\n");
  let currentParagraph = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph });
        currentParagraph = "";
      }
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph });
        currentParagraph = "";
      }
      sections.push({ type: "h2", content: trimmed.slice(3), level: 2 });
    } else if (trimmed.startsWith("### ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph });
        currentParagraph = "";
      }
      sections.push({ type: "h3", content: trimmed.slice(4), level: 3 });
    } else if (trimmed.startsWith("- ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph });
        currentParagraph = "";
      }
      sections.push({ type: "bullet", content: trimmed.slice(2) });
    } else {
      currentParagraph += (currentParagraph ? " " : "") + trimmed;
    }
  }
  if (currentParagraph) {
    sections.push({ type: "paragraph", content: currentParagraph });
  }
  return sections;
}

function slugify(text: string) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArticlePageClient({
  article,
  relatedArticles = [],
  prev: initialPrev = null,
  next: initialNext = null,
}: {
  article: NewsArticle;
  relatedArticles?: NewsArticle[];
  prev?: NewsArticle | null;
  next?: NewsArticle | null;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";
  const detailT = (t as any).articleDetail || {};
  const [related, setRelated] = useState<NewsArticle[]>(relatedArticles);
  const [prev, setPrev] = useState<NewsArticle | null>(initialPrev);
  const [next, setNext] = useState<NewsArticle | null>(initialNext);

  useEffect(() => {
    if (relatedArticles && relatedArticles.length > 0) {
      setRelated(relatedArticles);
    }
    setPrev(initialPrev);
    setNext(initialNext);
  }, [relatedArticles, initialPrev, initialNext]);

  useEffect(() => {
    if (related.length === 0) {
      fetch("/api/news")
        .then((res) => res.json())
        .then((data: any[]) => {
          if (Array.isArray(data)) {
            const published = data.filter((a) => a.status === "Published" || !a.status);
            const converted = published.map((a) => convertApiItemToNewsArticle(a, currentLocale));
            const otherArticles = converted.filter(
              (a) => a.slug !== article?.slug && String(a.id) !== String(article?.id)
            );
            const sameCategory = otherArticles.filter(
              (a) => a.category && article?.category && a.category.toLowerCase().trim() === article.category.toLowerCase().trim()
            );
            const diffCategory = otherArticles.filter(
              (a) => !a.category || !article?.category || a.category.toLowerCase().trim() !== article.category.toLowerCase().trim()
            );
            const computedRelated = [...sameCategory, ...diffCategory].slice(0, 3);
            setRelated(computedRelated);

            const currIndex = converted.findIndex((a) => a.slug === article?.slug || String(a.id) === String(article?.id));
            if (currIndex > 0) setPrev(converted[currIndex - 1]);
            if (currIndex >= 0 && currIndex < converted.length - 1) setNext(converted[currIndex + 1]);
          }
        })
        .catch((err) => console.error("Failed to fetch related news", err));
    }
  }, [article?.slug, currentLocale, related.length]);

  const [copied, setCopied] = useState(false);
  const [activeToc, setActiveToc] = useState("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = parseMarkdownContent(article?.content || "");
  const h2Sections = sections.filter((s) => s.type === "h2");

  useEffect(() => {
    const handleScroll = () => {
      const headings = contentRef.current?.querySelectorAll("h2[id]");
      if (!headings) return;
      let current = "";
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 140) {
          current = heading.id;
        }
      });
      if (current) setActiveToc(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; 
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(article?.title || "");

  const safeHeroImage = article?.heroImage && article.heroImage.trim() !== "" ? article.heroImage : "/assets/hero.png";
  const safeTags = Array.isArray(article?.tags) ? article.tags : [];

  const publishedDateFormatted = formatPublishedDate(article?.publishedAt, currentLocale);
  const readingTimeFormatted = formatReadingTime(
    article?.readingTime,
    detailT.min_read || (currentLocale === "ar" ? "دقائق للقراءة" : currentLocale === "fr" ? "min de lecture" : "min read"),
    currentLocale
  );

  const isDefaultAuthor =
    !article?.author ||
    article.author.toLowerCase().includes("sti") ||
    article.author.toLowerCase().includes("équipe") ||
    article.author.includes("فريق");

  const authorName = isDefaultAuthor
    ? detailT.author_default || "STI Communications Team"
    : article.author;

  const isDefaultRole =
    !article?.authorRole ||
    article.authorRole.toLowerCase().includes("smart") ||
    article.authorRole.includes("سمارت");

  const authorRoleName = isDefaultRole
    ? detailT.author_role_default || "Smart Technologie Innovation"
    : article.authorRole;

  const isDefaultBio =
    !article?.authorBio ||
    article.authorBio.toLowerCase().includes("communications team") ||
    article.authorBio.toLowerCase().includes("communication officielle") ||
    article.authorBio.includes("فريق الاتصال والإعلام");

  const authorBioName = isDefaultBio
    ? detailT.author_bio_default || "Official communications team at SARL Smart Technologie Innovation."
    : article.authorBio;

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/news/categories")
      .then((res) => res.json())
      .then((cats) => {
        if (Array.isArray(cats)) setCategories(cats);
      })
      .catch(() => {});
  }, []);

  const categoryName = localizeCategory(article?.category, currentLocale, categories);

  return (
    <article className="relative bg-white">
      {/* Background decoration grid */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D71920 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Hero Header Area */}
      <div className="relative bg-gradient-to-b from-gray-50 via-white to-white pt-28 sm:pt-36 pb-12 border-b border-gray-100/50">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex-wrap">
            <Link href={`/${currentLocale}/ooredoo`} className="hover:text-red-primary transition-colors">
              {currentLocale === "ar" ? "الرئيسية" : currentLocale === "fr" ? "Accueil" : "Home"}
            </Link>
            <ChevronRight size={12} className="text-gray-300 rtl:rotate-180" />
            <Link href={`/${currentLocale}/ooredoo/news`} className="hover:text-red-primary transition-colors">
              {currentLocale === "ar" ? "الأخبار" : currentLocale === "fr" ? "Actualités" : "News"}
            </Link>
            <ChevronRight size={12} className="text-gray-300 rtl:rotate-180" />
            <span className="text-gray-500">{categoryName}</span>
            <ChevronRight size={12} className="text-gray-300 rtl:rotate-180" />
            <span className="text-red-primary truncate max-w-[200px] sm:max-w-none">
              {article?.title}
            </span>
          </nav>

          <div className="max-w-[900px]">
            {/* Category Tag */}
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
              {categoryName}
            </span>

            {/* Main Headline */}
            <h1
              className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {article?.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-500 max-w-3xl mb-8">
              {article?.excerpt}
            </p>

            {/* Author Meta Row */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-6">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-semibold text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-300" />
                  {publishedDateFormatted}
                </span>
                <span className="h-3 w-px bg-gray-200 hidden sm:inline" />
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} className="text-gray-300" />
                  {authorName}
                </span>
                <span className="h-3 w-px bg-gray-200 hidden sm:inline" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-300" />
                  {readingTimeFormatted}
                </span>
              </div>

              {/* Share Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-2 rtl:mr-0 rtl:ml-2">
                  {detailT.share || "Share:"}
                </span>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-red-primary hover:text-red-primary hover:-translate-y-0.5"
                  title="Share on LinkedIn"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-red-primary hover:text-red-primary hover:-translate-y-0.5"
                  title="Share on Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-red-primary hover:text-red-primary hover:-translate-y-0.5"
                  title="Share on WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-red-primary hover:text-red-primary hover:-translate-y-0.5"
                  title="Copy link"
                >
                  {copied ? <Check size={15} className="text-green-500 animate-scale" /> : <Link2 size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Hero Banner Image */}
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 mt-12 mb-16">
        <div className="relative h-[280px] sm:h-[400px] md:h-[500px] lg:h-[580px] w-full overflow-hidden rounded-3xl shadow-xl shadow-gray-100/50">
          <img
            src={safeHeroImage}
            alt={article?.title || "News"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Two Column Layout: Content & Sidebar */}
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
          {/* Main Article Body Column */}
          <div ref={contentRef} className="max-w-[800px]">
            {sections.map((section, i) => {
              if (section.type === "h2") {
                const id = slugify(section.content);
                return (
                  <h2
                    key={i}
                    id={id}
                    className="mb-5 mt-12 text-2xl sm:text-3xl font-extrabold text-gray-900 scroll-mt-28"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {section.content}
                  </h2>
                );
              }
              if (section.type === "h3") {
                return (
                  <h3
                    key={i}
                    className="mb-4 mt-8 text-xl font-bold text-gray-900"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {section.content}
                  </h3>
                );
              }
              if (section.type === "bullet") {
                return (
                  <div key={i} className="mb-3.5 flex items-start gap-3 pl-1 rtl:pl-0 rtl:pr-1">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-primary" />
                    <span className="text-sm sm:text-base leading-relaxed text-gray-600 font-medium">{section.content}</span>
                  </div>
                );
              }
              return (
                <p key={i} className="mb-6 text-sm sm:text-base leading-relaxed text-gray-600 font-medium">
                  {section.content}
                </p>
              );
            })}

            {/* Highlighted Quote Callout */}
            <div className="my-12 rounded-3xl border-l-4 border-red-primary rtl:border-l-0 rtl:border-r-4 bg-gray-50/50 p-8 shadow-sm">
              <Quote size={32} className="mb-4 text-red-primary/10 rtl:rotate-180" />
              <blockquote className="mb-4 text-base sm:text-lg font-bold leading-relaxed text-gray-900 italic" style={{ fontFamily: "var(--font-manrope)" }}>
                {detailT.quote || "“Our priority is to provide partners with reliable access to our products while maintaining a high standard of service.”"}
              </blockquote>
              <cite className="text-xs font-extrabold uppercase tracking-widest text-red-primary not-italic">
                {detailT.quote_author || "— STI Management"}
              </cite>
            </div>

            {/* Supporting Partner Feature Grid */}
            <div className="my-14 border-t border-gray-100 pt-10">
              <h2
                className="mb-4 text-2xl font-extrabold text-gray-900"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {detailT.partner_section_title || "Supporting Retail & Wholesale Partners"}
              </h2>
              <p className="mb-8 text-sm sm:text-base leading-relaxed text-gray-500 font-medium">
                {detailT.partner_section_desc || "STI supports retailers, wholesalers, and business partners throughout Algeria with reliable access to official Ooredoo products, competitive pricing, and dedicated professional support."}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: BadgeCheck,
                    title: detailT.features?.official_products || "Official Products",
                    desc: detailT.features?.official_products_desc || "100% official Ooredoo products.",
                  },
                  {
                    icon: PackageCheck,
                    title: detailT.features?.reliable_availability || "Reliable Availability",
                    desc: detailT.features?.reliable_availability_desc || "Consistent access to essential products.",
                  },
                  {
                    icon: Headphones,
                    title: detailT.features?.professional_support || "Professional Support",
                    desc: detailT.features?.professional_support_desc || "Dedicated assistance for business partners.",
                  },
                  {
                    icon: TrendingUp,
                    title: detailT.features?.business_growth || "Business Growth",
                    desc: detailT.features?.business_growth_desc || "Solutions designed for professional partners.",
                  },
                ].map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-50/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-primary/8 text-red-primary">
                      <feat.icon size={20} />
                    </div>
                    <h4 className="mb-1.5 text-sm font-bold text-gray-900">{feat.title}</h4>
                    <p className="text-xs leading-relaxed text-gray-500 font-medium">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <div className="my-14 border-t border-gray-100 pt-10">
                <h2
                  className="mb-6 text-2xl font-extrabold text-gray-900"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {detailT.gallery || "Gallery"}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {article.gallery.map((img, i) => (
                    <div key={i} className="group">
                      <div className="relative mb-3 h-48 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                        <Image
                          src={img.src}
                          alt={img.caption}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                      <p className="text-xs text-gray-400 font-semibold">{img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author Profile Block */}
            <div className="my-14 rounded-3xl border border-gray-100 bg-gray-50/30 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden p-2">
                  <Image src="/assets/logo.png" alt="STI" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{authorName}</h4>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-primary">
                    {authorRoleName}
                  </p>
                  <p className="text-xs leading-relaxed text-gray-500 font-medium">
                    {authorBioName}
                  </p>
                </div>
              </div>
            </div>

            {/* Prev / Next Pagination Controls */}
            {(prev || next) && (
              <div className="my-14 grid gap-4 sm:grid-cols-2 border-t border-gray-100 pt-8">
                {prev ? (
                  <Link
                    href={`/${currentLocale}/ooredoo/news/${prev.slug || prev.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-red-primary hover:shadow-md hover:scale-[1.01]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-red-primary group-hover:text-white rtl:rotate-180">
                      <ArrowLeft size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {currentLocale === "ar" ? "المقال السابق" : currentLocale === "fr" ? "Article précédent" : "Previous Article"}
                      </span>
                      <span className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-red-primary transition-colors">
                        {prev.title}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/${currentLocale}/ooredoo/news/${next.slug || next.id}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-red-primary hover:shadow-md hover:scale-[1.01]"
                  >
                    <div className="min-w-0 text-left rtl:text-right">
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {currentLocale === "ar" ? "المقال التالي" : currentLocale === "fr" ? "Article suivant" : "Next Article"}
                      </span>
                      <span className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-red-primary transition-colors">
                        {next.title}
                      </span>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-red-primary group-hover:text-white rtl:rotate-180">
                      <ArrowRight size={16} />
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {/* Table of Contents */}
              {h2Sections.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                  <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    {detailT.table_of_contents || "In This Article"}
                  </h4>
                  <ul className="space-y-1">
                    {h2Sections.map((section, i) => {
                      const id = slugify(section.content);
                      const isActive = activeToc === id;
                      return (
                        <li key={id}>
                          <button
                            onClick={() => scrollToSection(id)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left rtl:text-right text-xs transition-all ${
                              isActive
                                ? "bg-red-primary/5 font-bold text-red-primary"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                            }`}
                          >
                            <span className={`text-[10px] font-extrabold ${isActive ? "text-red-primary" : "text-gray-300"}`}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate">{section.content}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Quick Article Specs */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  {detailT.information || "Information"}
                </h4>
                <div className="space-y-3.5">
                  {[
                    { label: detailT.category || "Category", value: categoryName, red: true },
                    { label: detailT.published || "Published", value: publishedDateFormatted },
                    { label: detailT.author || "Author", value: authorName },
                    { label: detailT.read_time || "Read Time", value: readingTimeFormatted },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-400">{item.label}</span>
                      <span className={`font-bold ${item.red ? "text-red-primary" : "text-gray-800"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  {detailT.tags || "Tags"}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {safeTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-gray-100 bg-gray-50/50 px-2.5 py-1 text-[10px] font-bold text-gray-500 transition-all hover:border-red-primary hover:text-red-primary cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile TOC Accordion Panel */}
      {h2Sections.length > 0 && (
        <div className="mx-auto max-w-[800px] px-4 pb-8 lg:hidden">
          <button
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
              {detailT.table_of_contents || "In This Article"}
            </span>
            <ChevronRight
              size={16}
              className={`text-gray-400 transition-transform ${mobileTocOpen ? "rotate-90" : ""}`}
            />
          </button>
          {mobileTocOpen && (
            <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg">
              <ul className="space-y-1">
                {h2Sections.map((section, i) => {
                  const id = slugify(section.content);
                  return (
                    <li key={id}>
                      <button
                        onClick={() => {
                          scrollToSection(id);
                          setMobileTocOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left rtl:text-right text-xs font-semibold text-gray-600 hover:text-red-primary hover:bg-gray-50"
                      >
                        <span className="text-[10px] font-extrabold text-gray-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {section.content}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Related News Carousel/Grid Section */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-gray-50/40 py-24">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-red-primary">
                  {currentLocale === "ar" ? "المزيد من الأخبار" : currentLocale === "fr" ? "Plus d'actualités" : "More News"}
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-gray-900"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {currentLocale === "ar" ? "أخبار ذات صلة" : currentLocale === "fr" ? "Actualités connexes" : "Related News"}
                </h2>
              </div>
              <Link
                href={`/${currentLocale}/ooredoo/news`}
                className="hidden items-center gap-1.5 text-xs font-bold text-red-primary transition-colors hover:text-red-accent sm:inline-flex"
              >
                <span>{currentLocale === "ar" ? "عرض جميع الأخبار" : currentLocale === "fr" ? "Toutes les actualités" : "View all news"}</span>
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.id || rel.slug}
                  href={`/${currentLocale}/ooredoo/news/${rel.slug || rel.id}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.06)] hover:-translate-y-1"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={rel.heroImage && rel.heroImage.trim() !== "" ? rel.heroImage : "/assets/hero.png"}
                        alt={rel.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold text-red-primary shadow-sm uppercase tracking-widest backdrop-blur-sm">
                        {rel.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        {rel.publishedAt} • {rel.readingTime}
                      </div>
                      <h3
                        className="mb-2 text-base font-bold text-gray-900 line-clamp-2 group-hover:text-red-primary transition-colors duration-300"
                        style={{ fontFamily: "var(--font-manrope)" }}
                      >
                        {rel.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-gray-500 line-clamp-2 font-medium">{rel.excerpt}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-primary group-hover:underline">
                      {currentLocale === "ar" ? "قراءة المقال" : currentLocale === "fr" ? "Lire l'article" : "Read Article"}{" "}
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link
                href={`/${currentLocale}/ooredoo/news`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-primary"
              >
                <span>{currentLocale === "ar" ? "عرض جميع الأخبار" : currentLocale === "fr" ? "Toutes les actualités" : "View all news"}</span>
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Newsletter Signup Form */}
      <NewsletterSection />
    </article>
  );
}
