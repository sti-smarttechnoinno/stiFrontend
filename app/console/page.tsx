"use client";

import { useEffect, useState } from "react";
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
  RefreshCw,
  Loader2,
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
import type { CompanyPreferences } from "../api/preferences/route";

const defaultContactInfo = [
  { icon: Phone, label: "Phone", value: "0552 02 35 36" },
  { icon: Mail, label: "Email", value: "servicevente@sti.dz" },
  { icon: Building2, label: "Address", value: "Setif, Algeria" },
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

function formatTimeAgo(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) return "Recently";
  const diffMs = Date.now() - timestamp;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [contactList, setContactList] = useState(defaultContactInfo);

  const [kpiCounts, setKpiCounts] = useState({
    solutions: 0,
    products: 0,
    jobs: 0,
    submissions: 0,
    messages: 0,
    unreadMessages: 0,
    requests: 0,
    pendingRequests: 0,
  });

  const [recentActivities, setRecentActivities] = useState<
    Array<{
      title: string;
      subtitle: string;
      time: string;
      timestamp: number;
      href: string;
    }>
  >([]);

  const [chartData, setChartData] = useState<
    Array<{
      day: string;
      applications: number;
      quotes: number;
      messages: number;
    }>
  >([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [solRes, prodRes, jobsRes, subRes, msgRes, reqRes, prefRes] = await Promise.all([
        fetch("/api/solutions").catch(() => null),
        fetch("/api/products").catch(() => null),
        fetch("/api/jobs").catch(() => null),
        fetch("/api/submissions").catch(() => null),
        fetch("/api/messages").catch(() => null),
        fetch("/api/requests").catch(() => null),
        fetch("/api/preferences").catch(() => null),
      ]);

      const solutions = solRes && solRes.ok ? await solRes.json() : [];
      const products = prodRes && prodRes.ok ? await prodRes.json() : [];
      const jobs = jobsRes && jobsRes.ok ? await jobsRes.json() : [];
      const submissions = subRes && subRes.ok ? await subRes.json() : [];
      const messages = msgRes && msgRes.ok ? await msgRes.json() : [];
      const requests = reqRes && reqRes.ok ? await reqRes.json() : [];

      const solArr = Array.isArray(solutions) ? solutions : [];
      const prodArr = Array.isArray(products) ? products : [];
      const jobsArr = Array.isArray(jobs) ? jobs : [];
      const subArr = Array.isArray(submissions) ? submissions : [];
      const msgArr = Array.isArray(messages) ? messages : [];
      const reqArr = Array.isArray(requests) ? requests : [];

      const unreadMsgs = msgArr.filter((m: any) => m.status === "Unread").length;
      const pendingReqs = reqArr.filter((r: any) => r.status === "Pending").length;

      setKpiCounts({
        solutions: solArr.length,
        products: prodArr.length,
        jobs: jobsArr.length,
        submissions: subArr.length,
        messages: msgArr.length,
        unreadMessages: unreadMsgs,
        requests: reqArr.length,
        pendingRequests: pendingReqs,
      });

      // Preferences handling
      if (prefRes && prefRes.ok) {
        const data: CompanyPreferences = await prefRes.json();
        const addr =
          typeof data.address === "string"
            ? data.address
            : data.address?.en || "Setif, Algeria";

        let hoursStr = "Saturday - Thursday, 08:00 AM - 05:00 PM";
        if (data.businessHours?.saturday) {
          const openTime = data.businessHours.saturday.open || "08:00";
          const closeTime = data.businessHours.saturday.close || "17:00";
          hoursStr = `Saturday - Thursday, ${openTime} - ${closeTime}`;
        }

        setContactList([
          { icon: Phone, label: "Phone", value: data.phone || "0552 02 35 36" },
          { icon: Mail, label: "Email", value: data.email || "servicevente@sti.dz" },
          { icon: Building2, label: "Address", value: addr },
          { icon: Clock, label: "Working Hours", value: hoursStr },
        ]);
      }

      // Build Recent Activity Feed from real items
      const activities: Array<{
        title: string;
        subtitle: string;
        time: string;
        timestamp: number;
        href: string;
      }> = [];

      subArr.slice(0, 5).forEach((sub: any) => {
        const t = sub.created_at ? new Date(sub.created_at).getTime() : Number(sub.id) || Date.now();
        const cand = sub.candidate_name || sub.candidate || "New Candidate";
        activities.push({
          title: "New Job Application",
          subtitle: `${cand} (${sub.position || "General"})`,
          time: formatTimeAgo(t),
          timestamp: t,
          href: "/console/submissions",
        });
      });

      reqArr.slice(0, 5).forEach((req: any) => {
        const t = req.created_at ? new Date(req.created_at).getTime() : Number(req.id) || Date.now();
        activities.push({
          title: "New Quote Request",
          subtitle: `${req.business_name || "Partner"} - ${req.business_type || "Business"}`,
          time: formatTimeAgo(t),
          timestamp: t,
          href: "/console/requests",
        });
      });

      msgArr.slice(0, 5).forEach((msg: any) => {
        const t = msg.created_at ? new Date(msg.created_at).getTime() : Number(msg.id) || Date.now();
        activities.push({
          title: "New Contact Message",
          subtitle: `${msg.name || "Client"}: "${msg.subject || "Inquiry"}"`,
          time: formatTimeAgo(t),
          timestamp: t,
          href: "/console/mailbox",
        });
      });

      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivities(activities.slice(0, 6));

      // Build Weekly Trend Chart Data (Last 7 Days)
      const days: Array<{ day: string; applications: number; quotes: number; messages: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const dateISO = d.toISOString().split("T")[0];

        const appsOnDay = subArr.filter(
          (s: any) => s.created_at && s.created_at.startsWith(dateISO)
        ).length;
        const quotesOnDay = reqArr.filter(
          (r: any) => r.created_at && r.created_at.startsWith(dateISO)
        ).length;
        const msgsOnDay = msgArr.filter(
          (m: any) => m.created_at && m.created_at.startsWith(dateISO)
        ).length;

        days.push({
          day: dayLabel,
          applications: appsOnDay,
          quotes: quotesOnDay,
          messages: msgsOnDay,
        });
      }
      setChartData(days);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const kpis = [
    {
      title: "Solutions",
      value: loading ? "..." : String(kpiCounts.solutions),
      description: "Active Enterprise Solutions",
      icon: Layers,
      href: "/console/layers",
    },
    {
      title: "Products",
      value: loading ? "..." : String(kpiCounts.products),
      description: "Catalog & SIM Products",
      icon: Package,
      href: "/console/inventory",
    },
    {
      title: "Job Offers",
      value: loading ? "..." : String(kpiCounts.jobs),
      description: "Open Career Positions",
      icon: Briefcase,
      href: "/console/openings",
    },
    {
      title: "Applications",
      value: loading ? "..." : String(kpiCounts.submissions),
      description: "Received Candidate CVs",
      icon: FileUser,
      href: "/console/submissions",
    },
    {
      title: "Messages",
      value: loading ? "..." : String(kpiCounts.messages),
      description:
        kpiCounts.unreadMessages > 0
          ? `${kpiCounts.unreadMessages} Unread Inquiries`
          : "Total Contact Messages",
      icon: MessageSquare,
      href: "/console/mailbox",
    },
    {
      title: "Quote Requests",
      value: loading ? "..." : String(kpiCounts.requests),
      description:
        kpiCounts.pendingRequests > 0
          ? `${kpiCounts.pendingRequests} Pending Quotes`
          : "Total Quote Requests",
      icon: FileText,
      href: "/console/requests",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-red-primary mb-1 block">
            Executive Control Panel
          </span>
          <h1
            className="text-2xl lg:text-3xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back, Admin!
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Overview of SARL STI Ooredoo Distribution operations, live analytics & incoming inquiries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-red-primary" : ""} />
            <span>Refresh Data</span>
          </button>
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-600 shrink-0">
            <Calendar size={15} className="text-red-primary" />
            <span>Active Session</span>
          </div>
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
              <div
                className="text-3xl font-extrabold text-gray-900 mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
              <h2
                className="text-lg font-extrabold text-gray-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Inquiry & Activity Analytics
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Live applications, quotes, and contact message trends</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
              Last 7 Days
            </span>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                <Loader2 size={24} className="animate-spin text-red-primary" />
                <span className="text-xs font-semibold">Loading chart analytics...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #F3F4F6",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#C8102E"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#C8102E" }}
                    name="Applications"
                  />
                  <Line
                    type="monotone"
                    dataKey="quotes"
                    stroke="#111827"
                    strokeWidth={2}
                    dot={false}
                    name="Quote Requests"
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="#9CA3AF"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Messages"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Company Quick Contact Info */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-extrabold text-gray-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
            <span className="font-bold text-gray-900">Setif, Algeria</span>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Quick Actions Grid */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <h2
            className="text-lg font-extrabold text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quick Management Actions
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="group flex items-center gap-3.5 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 transition-all duration-300 hover:bg-white hover:border-red-primary/30 hover:shadow-lg hover:shadow-red-primary/5 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-red-primary group-hover:text-white group-hover:border-red-primary transition-all shrink-0">
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
            <h2
              className="text-lg font-extrabold text-gray-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recent Activity
            </h2>
            <Link href="/console/mailbox" className="text-xs font-bold text-red-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-5">
            {loading ? (
              <div className="py-8 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin text-red-primary" />
                <span className="text-xs font-semibold">Loading recent activity...</span>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No recent activity logged.
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <Link
                  key={index}
                  href={activity.href}
                  className="flex items-start gap-3.5 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0 group hover:opacity-90 transition-opacity"
                >
                  <div className="w-2 h-2 rounded-full bg-red-primary mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                  <div>
                    <div className="text-xs font-bold text-gray-900 group-hover:text-red-primary transition-colors">
                      {activity.title}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">{activity.subtitle}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{activity.time}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}