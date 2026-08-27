"use client";

import { motion } from "framer-motion";
import {
  CreditCard, Wallet, Package, Store, Users, Headphones,
  Zap, ShieldCheck, Clock, BadgeCheck, TrendingUp, Truck,
  RefreshCw, Smartphone, CheckCircle, Star, Award, Globe,
  Phone, Mail, MessageSquare
} from "lucide-react";
import { useTranslations } from '@/app/[locale]/use-translations';

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard size={28} />,
  Wallet: <Wallet size={28} />,
  Package: <Package size={28} />,
  Store: <Store size={28} />,
  Users: <Users size={28} />,
  Headphones: <Headphones size={28} />,
  Zap: <Zap size={28} />,
  ShieldCheck: <ShieldCheck size={28} />,
  Clock: <Clock size={28} />,
  BadgeCheck: <BadgeCheck size={28} />,
  TrendingUp: <TrendingUp size={28} />,
  Truck: <Truck size={28} />,
  RefreshCw: <RefreshCw size={28} />,
  Smartphone: <Smartphone size={28} />,
  CheckCircle: <CheckCircle size={28} />,
  Star: <Star size={28} />,
  Award: <Award size={28} />,
  Globe: <Globe size={28} />,
  Phone: <Phone size={28} />,
  Mail: <Mail size={28} />,
  MessageSquare: <MessageSquare size={28} />,
};

export function getIcon(name: string): React.ReactNode {
  return iconMap[name] || <Package size={28} />;
}

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function FeaturesSection({ features }: { features: FeatureProps[] }) {
  const t = useTranslations();

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-gray-50">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-red-primary">
            {(t as any).solutionDetail?.key_features_badge || "Key Features"}
          </span>
          <h2
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {(t as any).solutionDetail?.key_features_title || "Key Features"}
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-500">
            {(t as any).solutionDetail?.key_features_subtitle || "Everything you need for successful telecom distribution"}
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="show"
          animate="show"
          className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <motion.article
              key={`${f.title}-${i}`}
              variants={item}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(200,16,46,0.08)] hover:-translate-y-1"
            >
              {/* Red accent line */}
              <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-500 group-hover:w-full" />

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-primary/8 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
                {getIcon(f.icon)}
              </div>
              <h3
                className="mb-3 text-lg font-bold text-gray-900"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{f.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
