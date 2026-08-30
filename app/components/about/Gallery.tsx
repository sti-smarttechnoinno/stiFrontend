"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ZoomIn, FileText } from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';
import type { ApiNewsItem } from '@/app/api/news/route';

interface GalleryImageItem {
  src: string;
  alt: string;
  title: string;
  category: string;
  span: string;
}

const fallbackImages: GalleryImageItem[] = [
  { src: "/assets/hero.webp", alt: "STI Office Space", title: "SARL STI Distribution Hub", category: "Company Infrastructure", span: "col-span-1 row-span-2" },
  { src: "/assets/logo.png", alt: "STI Executive Team", title: "Official Ooredoo Partnership", category: "Corporate News", span: "col-span-1 row-span-1" },
  { src: "/assets/hero.webp", alt: "Commercial Support", title: "Commercial Operations", category: "Distribution", span: "col-span-1 row-span-1" },
  { src: "/assets/logo.png", alt: "Logistics Center", title: "National Logistics Center", category: "Supply Chain", span: "col-span-1 row-span-2" },
  { src: "/assets/hero.webp", alt: "Telecom Network", title: "Enterprise Solutions & Recharge", category: "Services", span: "col-span-1 row-span-1" },
  { src: "/assets/logo.png", alt: "Customer Support", title: "Partner & Customer Helpdesk", category: "Support", span: "col-span-1 row-span-1" },
];

export default function Gallery() {
  const pathname = usePathname();
  const currentLocale = (pathname.split("/")[1] || "en") as "en" | "ar" | "fr";

  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryImageItem | null>(null);

  const t = useTranslations();
  const galT = t.aboutPage.gallery;

  useEffect(() => {
    async function loadNewsGallery() {
      setLoading(true);
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const newsData: ApiNewsItem[] = await res.json();
          if (Array.isArray(newsData) && newsData.length > 0) {
            const spans = [
              "col-span-1 row-span-2",
              "col-span-1 row-span-1",
              "col-span-1 row-span-1",
              "col-span-1 row-span-2",
              "col-span-1 row-span-1",
              "col-span-1 row-span-1",
            ];

            const newsImages: GalleryImageItem[] = [];

            newsData.forEach((item: any) => {
              const langData = item.translations?.[currentLocale] || item.translations?.en || {};
              const title = langData.title || item.slug || "STI News Article";
              const category = item.category || "Company News";

              // 1. Primary Hero Image
              const heroImg = item.heroImage || item.hero_image;
              if (heroImg && typeof heroImg === "string" && heroImg.trim()) {
                newsImages.push({
                  src: heroImg.trim(),
                  alt: title,
                  title: title,
                  category: category,
                  span: "",
                });
              }

              // 2. Extract embedded <img> tags from content if present
              const contentHtml = langData.content || "";
              if (contentHtml && contentHtml.includes("<img")) {
                const imgMatches = contentHtml.matchAll(/src=["']([^"']+)["']/gi);
                for (const match of imgMatches) {
                  if (match && match[1]) {
                    const embeddedSrc = match[1].trim();
                    if (embeddedSrc && !newsImages.some((i) => i.src === embeddedSrc)) {
                      newsImages.push({
                        src: embeddedSrc,
                        alt: title,
                        title: title,
                        category: category,
                        span: "",
                      });
                    }
                  }
                }
              }
            });

            // Assign spans to news images
            const formattedImages = newsImages.map((img, idx) => ({
              ...img,
              span: spans[idx % spans.length],
            }));

            if (formattedImages.length > 0) {
              setImages(formattedImages);
            } else {
              setImages(fallbackImages);
            }
          } else {
            setImages(fallbackImages);
          }
        } else {
          setImages(fallbackImages);
        }
      } catch (err) {
        console.error("Failed to load news images for gallery:", err);
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    }

    loadNewsGallery();
  }, [currentLocale]);

  const displayImages = images.length > 0 ? images : fallbackImages;

  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {galT.badge}
          </span>
          <h2
            className="mb-4 text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {galT.title}
          </h2>
          <p className="mx-auto max-w-xl text-gray-500 text-sm">
            {galT.subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 size={32} className="animate-spin text-red-primary" />
            <span className="text-xs font-semibold">Loading news gallery images...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 auto-rows-[200px] lg:auto-rows-[240px]">
            {displayImages.map((img, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-gray-100 border border-gray-100 ${img.span}`}
                onClick={() => setLightbox(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-5">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-primary text-white self-start mb-1.5 shadow-sm">
                    {img.category}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {img.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-white/80">
                    <ZoomIn size={12} />
                    <span>Click to view full image</span>
                  </div>
                </div>
              </motion.figure>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
              className="absolute right-6 top-6 rtl:right-auto rtl:left-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 z-10 cursor-pointer"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[85vh] max-w-4xl w-full flex flex-col items-center justify-center bg-gray-950/80 p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain shadow-lg"
              />
              <div className="mt-4 text-center px-4">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-primary text-white mb-2">
                  {lightbox.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white max-w-xl mx-auto leading-relaxed">
                  {lightbox.title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
