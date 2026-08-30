import { redirect } from "next/navigation";

type Params = Promise<{ locale: string }>;

export default async function NewsRedirectPage({ params }: { params: Params }) {
  const { locale } = await params;
  redirect(`/${locale || "fr"}/ooredoo/news`);
}
