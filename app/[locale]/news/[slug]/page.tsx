import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FinalCTA from "../../../components/FinalCTA";
import { getArticleBySlugServer } from "../../../data/news-server";
import ArticlePageClient from "./ArticlePageClient";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlugServer(slug, locale);
  if (!article) {
    return {
      title: "Article | STI News",
      description: "Smart Technologie Innovation News",
    };
  }
  const seo = article.seo;

  return {
    title: seo?.title || article.title,
    description: seo?.description || article.excerpt,
    keywords: seo?.keywords || article.tags,
    openGraph: {
      title: seo?.title || article.title,
      description: seo?.description || article.excerpt,
      images: [article.heroImage || "/assets/hero.png"],
      type: "article",
      url: `https://sti-dz.com/news/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.title || article.title,
      description: seo?.description || article.excerpt,
      images: [article.heroImage || "/assets/hero.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://sti-dz.com/news/${article.slug}`,
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Params;
}) {
  const { locale, slug } = await params;
  const article = await getArticleBySlugServer(slug, locale);

  if (!article) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "SARL Smart Technologie Innovation",
      logo: {
        "@type": "ImageObject",
        url: "https://sti-dz.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sti-dz.com/news/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <Navbar />
      <main>
        <ArticlePageClient article={article} />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
