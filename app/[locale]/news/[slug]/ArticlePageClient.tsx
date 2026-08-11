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
import { NewsArticle, getRelatedArticles, getAdjacentArticles } from "../../../data/news-articles";
import NewsletterSection from "../../../components/news/NewsletterSection";

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

function parseMarkdownContent(content: string) {
  const sections: { type: string; content: string; level?: number }[] = [];
  const lines = content.split("\n");
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
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ArticlePageClient({ article }: { article: NewsArticle }) {
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "en";
  const { prev, next } = getAdjacentArticles(article.slug);
  const related = getRelatedArticles(article.slug, 3);

  const [copied, setCopied] = useState(false);
  const [activeToc, setActiveToc] = useState("");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = parseMarkdownContent(article.content);
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
  const shareText = encodeURIComponent(article.title);

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
            <Link href={`/${currentLocale}`} className="hover:text-red-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <Link href={`/${currentLocale}/news`} className="hover:text-red-primary transition-colors">
              News
            </Link>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-gray-500">{article.category}</span>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-red-primary truncate max-w-[200px] sm:max-w-none">
              {article.title}
            </span>
          </nav>

          <div className="max-w-[900px]">
            {/* Category Tag */}
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
              {article.category}
            </span>

            {/* Main Headline */}
            <h1
              className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-gray-900"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg leading-relaxed text-gray-500 max-w-3xl mb-8">
              {article.excerpt}
            </p>

            {/* Author Meta Row */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-6">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-semibold text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-300" />
                  {article.publishedAt}
                </span>
                <span className="h-3 w-px bg-gray-200 hidden sm:inline" />
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} className="text-gray-300" />
                  {article.author}
                </span>
                <span className="h-3 w-px bg-gray-200 hidden sm:inline" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-300" />
                  {article.readingTime}
                </span>
              </div>

              {/* Share Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mr-2">Share:</span>
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
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1320px) 100vw, 1320px"
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
                  <div key={i} className="mb-3.5 flex items-start gap-3 pl-1">
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
            <div className="my-12 rounded-3xl border-l-4 border-red-primary bg-gray-50/50 p-8 shadow-sm">
              <Quote size={32} className="mb-4 text-red-primary/10" />
              <blockquote className="mb-4 text-base sm:text-lg font-bold leading-relaxed text-gray-900 italic" style={{ fontFamily: "var(--font-manrope)" }}>
                &ldquo;Our priority is to provide partners with reliable access to official Ooredoo products
                while maintaining a high standard of service.&rdquo;
              </blockquote>
              <cite className="text-xs font-extrabold uppercase tracking-widest text-red-primary not-italic">— STI Management</cite>
            </div>

            {/* Supporting Partner Feature Grid */}
            <div className="my-14 border-t border-gray-100 pt-10">
              <h2
                className="mb-4 text-2xl font-extrabold text-gray-900"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Supporting Retail &amp; Wholesale Partners
              </h2>
              <p className="mb-8 text-sm sm:text-base leading-relaxed text-gray-500 font-medium">
                STI supports retailers, wholesalers, and business partners throughout Algeria with reliable
                access to official Ooredoo products, competitive pricing, and dedicated professional support.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: BadgeCheck,
                    title: "Official Products",
                    desc: "100% official Ooredoo products.",
                  },
                  {
                    icon: PackageCheck,
                    title: "Reliable Availability",
                    desc: "Consistent access to essential products.",
                  },
                  {
                    icon: Headphones,
                    title: "Professional Support",
                    desc: "Dedicated assistance for business partners.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Business Growth",
                    desc: "Solutions designed for professional partners.",
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
                  Gallery
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
                  <h4 className="text-sm font-bold text-gray-900">{article.author}</h4>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-primary">{article.authorRole}</p>
                  <p className="text-xs leading-relaxed text-gray-500 font-medium">{article.authorBio}</p>
                </div>
              </div>
            </div>

            {/* Prev / Next Pagination Controls */}
            <div className="my-14 grid gap-4 sm:grid-cols-2 border-t border-gray-100 pt-8">
              {prev ? (
                <Link
                  href={`/${currentLocale}/news/${prev.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-red-primary hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-red-primary group-hover:text-white">
                    <ArrowLeft size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Previous Article
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
                  href={`/${currentLocale}/news/${next.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-red-primary hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="min-w-0 text-left">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Next Article
                    </span>
                    <span className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-red-primary transition-colors">
                      {next.title}
                    </span>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-red-primary group-hover:text-white">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {/* Table of Contents */}
              {h2Sections.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
                  <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-gray-900">In This Article</h4>
                  <ul className="space-y-1">
                    {h2Sections.map((section, i) => {
                      const id = slugify(section.content);
                      const isActive = activeToc === id;
                      return (
                        <li key={id}>
                          <button
                            onClick={() => scrollToSection(id)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-all ${
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
                <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-gray-900">Information</h4>
                <div className="space-y-3.5">
                  {[
                    { label: "Category", value: article.category, red: true },
                    { label: "Published", value: article.publishedAt },
                    { label: "Author", value: article.author },
                    { label: "Read Time", value: article.readingTime },
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
                <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-900">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
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
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">In This Article</span>
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
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-semibold text-gray-600 hover:text-red-primary hover:bg-gray-50"
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
      <section className="border-t border-gray-100 bg-gray-50/40 py-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-red-primary">
                More News
              </span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-gray-900"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Related News
              </h2>
            </div>
            <Link
              href={`/${currentLocale}/news`}
              className="hidden items-center gap-1.5 text-xs font-bold text-red-primary transition-colors hover:text-red-accent sm:inline-flex"
            >
              <span>View all news</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/${currentLocale}/news/${rel.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.06)] hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={rel.heroImage}
                      alt={rel.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                    Read Article <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href={`/${currentLocale}/news`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-primary"
            >
              <span>View all news</span>
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Newsletter Signup Form */}
      <NewsletterSection />
    </article>
  );
}
