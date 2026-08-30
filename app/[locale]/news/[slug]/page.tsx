import { redirect } from "next/navigation";

type Params = Promise<{ locale: string; slug: string }>;

export default async function NewsArticleRedirectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  redirect(`/${locale || "fr"}/ooredoo/news/${slug}`);
}
