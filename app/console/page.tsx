"use client";

import Link from "next/link";
import {
  Layers,
  Package,
  Briefcase,
  FileUser,
  MessageSquare,
  FileText,
  ArrowRight,
  Calendar,
  Building2,
  Phone,
  Mail,
  Clock,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const kpis = [
  {
    title: "Solutions",
    value: "12",
    description: "Active Enterprise Solutions",
    icon: Layers,
    href: "/console/layers",
  },
  {
    title: "Products",
    value: "28",
    description: "Catalog & SIM Products",
    icon: Package,
    href: "/console/inventory",
  },
  {
    title: "Job Offers",
    value: "8",
    description: "Open Career Positions",
    icon: Briefcase,
    href: "/console/openings",
  },
  {
    title: "Applications",
    value: "36",
    description: "Received Candidate CVs",
    icon: FileUser,
    href: "/console/submissions",
  },
  {
    title: "Messages",
    value: "15",
    description: "Unread Inquiries",
    icon: MessageSquare,
    href: "/console/mailbox",
  },
  {
    title: "Quote Requests",
    value: "9",
    description: "Pending Partner Quotes",
    icon: FileText,
    href: "/console/requests",
  },
];

const chartData = [
  { day: "May 24", applications: 4, quotes: 2, messages: 3 },
  { day: "May 25", applications: 6, quotes: 3, messages: 5 },
  { day: "May 26", applications: 8, quotes: 4, messages: 4 },
  { day: "May 27", applications: 5, quotes: 2, messages: 6 },
  { day: "May 28", applications: 7, quotes: 5, messages: 3 },
  { day: "May 29", applications: 9, quotes: 3, messages: 7 },
  { day: "May 30", applications: 6, quotes: 4, messages: 5 },
];

import { useEffect, useState } from "react";
import type { CompanyPreferences } from "../api/preferences/route";

const defaultContactInfo = [
  { icon: Phone, label: "Phone", value: "0550 123 456" },
  { icon: Mail, label: "Email", value: "contact@sti.dz" },
  { icon: Building2, label: "Address", value: "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers" },
  { icon: Clock, label: "Working Hours", value: "Saturday - Thursday, 08:00 AM - 05:00 PM" },
];

const quickActions = [
  { label: "Add Solution", description: "Create enterprise service solution", icon: Layers, href: "/console/layers/create" },
  { label: "Add Product", description: "Add Ooredoo product or SIM", icon: Package, href: "/console/inventory/create" },
  { label: "Post Job Offer", description: "Publish open career role", icon: Briefcase, href: "/console/openings/create" },
  { label: "View Applications", description: "Review candidate applications", icon: FileUser, href: "/console/submissions" },
  { label: "View Messages", description: "Read client contact messages", icon: MessageSquare, href: "/console/mailbox" },
  { label: "View Quotes", description: "Manage wholesale quote requests", icon: FileText, href: "/console/requests" },
];

const recentActivity = [
  { title: "New job application submitted", subtitle: "Sales Representative - Oran", time: "2 min ago" },
  { title: "New quote request", subtitle: "Recharge Credit Distribution", time: "15 min ago" },
  { title: "New message received", subtitle: "Retail Partner Inquiry", time: "1 hour ago" },
  { title: "New product catalog update", subtitle: "Prepaid SIM Card", time: "2 hours ago" },
];

export default function DashboardPage() {
  const [contactList, setContactList] = useState(defaultContactInfo);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data: CompanyPreferences = await res.json();
          const addr = typeof data.address === "string" ? data.address : (data.address?.en || "Lot 24, Zone Industrielle, Bab Ezzouar, Algiers");
          
          let hoursStr = "Saturday - Thursday, 08:00 AM - 05:00 PM";
          if (data.businessHours?.saturday) {
            const openTime = data.businessHours.saturday.open || "08:00";
            const closeTime = data.businessHours.saturday.close || "17:00";
            hoursStr = `Saturday - Thursday, ${openTime} - ${closeTime}`;
          }

          setContactList([
            { icon: Phone, label: "Phone", value: data.phone || "0550 123 456" },
            { icon: Mail, label: "Email", value: data.email || "contact@sti.dz" },
            { icon: Building2, label: "Address", value: addr },
            { icon: Clock, label: "Working Hours", value: hoursStr },
          ]);
        }
      } catch (err) {
        console.error("Failed to load preferences on console dashboard", err);
      }
    }
    loadPrefs();
  }, []);
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-primary mb-1 block">
            Executive Control Panel
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Welcome back, Admin!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of SARL STI Ooredoo Distribution operations & incoming inquiries.
          </p>
        </div>
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-600 shrink-0">
          <Calendar size={15} className="text-red-primary" />
          <span>Active Session</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpis.map((kpi) => (
          <Link
            key={kpi.title}
            href={kpi.href}
            className="group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,16,46,0.08)] hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-primary transition-all duration-300 group-hover:w-full" />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-primary/10 text-red-primary transition-colors group-hover:bg-red-primary group-hover:text-white">
              <kpi.icon size={20} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {kpi.value}
              </div>
              <div className="text-xs font-bold text-gray-900 mb-1">{kpi.title}</div>
              <div className="text-[11px] text-gray-400 leading-tight">{kpi.description}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Chart + Company Info */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Analytics Overview Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                Inquiry & Activity Analytics
              </h2>
              <p className="text-xs text-gray-400">Applications, quotes, and contact message trends</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
              Weekly Overview
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #F3F4F6",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="applications" stroke="#C8102E" strokeWidth={2.5} dot={{ r: 4, fill: "#C8102E" }} name="Applications" />
                <Line type="monotone" dataKey="quotes" stroke="#111827" strokeWidth={2} dot={false} name="Quote Requests" />
                <Line type="monotone" dataKey="messages" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Messages" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company Quick Contact Info */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                Company Details
              </h2>
              <Link href="/console/identity" className="text-xs font-bold text-red-primary hover:underline">
                Edit
              </Link>
            </div>
            <div className="space-y-5">
              {contactList.map((item) => (
                <div key={item.label} className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-red-primary/10 rounded-xl flex items-center justify-center shrink-0 text-red-primary mt-0.5">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{item.label}</div>
                    <div className="text-xs font-semibold text-gray-900 mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Official Ooredoo Distributor</span>
            <span className="font-semibold text-gray-900">Algeria</span>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Quick Actions Grid */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <h2 className="text-lg font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Quick Management Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3.5 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 transition-all duration-300 hover:bg-white hover:border-red-primary/30 hover:shadow-lg hover:shadow-red-primary/5 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-red-primary group-hover:text-white group-hover:border-red-primary transition-all">
                  <action.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-red-primary transition-colors">{action.label}</div>
                  <div className="text-[11px] text-gray-400 truncate">{action.description}</div>
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-red-primary transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Stream */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
              Recent Activity
            </h2>
            <Link href="/console/mailbox" className="text-xs font-bold text-red-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-5">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3.5 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-red-primary mt-2 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-900">{activity.title}</div>
                  <div className="text-[11px] text-gray-500">{activity.subtitle}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}