export interface SolutionData {
  slug: string;
  name: string;
  shortName: string;
  badge: string;
  title: string;
  description: string[];
  highlights?: string[];
  features: { icon: string; title: string; description: string }[];
  benefits: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  illustration: "recharge" | "sim" | "wholesale" | "retail" | "partnership" | "support";
  translations?: Record<string, any>;
}
