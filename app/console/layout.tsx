"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  Briefcase,
  FileUser,
  MessageSquare,
  FileText,
  Building2,
  Phone,
  Users,
  ShieldCheck,
  Settings,
  Headset,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  LogOut,
} from "lucide-react";

const navSections = [
  {
    label: "Main",
    items: [
      { href: "/console", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/console/layers", icon: Layers, label: "Solutions" },
      { href: "/console/inventory", icon: Package, label: "Products" },
      { href: "/console/news", icon: FileText, label: "News & Articles" },
    ],
  },
  {
    label: "Careers",
    items: [
      { href: "/console/openings", icon: Briefcase, label: "Job Offers" },
      { href: "/console/submissions", icon: FileUser, label: "Applications (CVs)" },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/console/mailbox", icon: MessageSquare, label: "Messages" },
      { href: "/console/requests", icon: FileText, label: "Quote Requests" },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/console/identity", icon: Building2, label: "Company Info" },
    ],
  },
  {
    label: "Users & Access",
    items: [
      { href: "/console/members", icon: Users, label: "Users" },
      { href: "/console/access", icon: ShieldCheck, label: "Roles" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/console/preferences", icon: Settings, label: "General Settings" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased text-gray-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200/80 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-center">
          <Link href="/console" className="inline-flex items-center justify-center transition-transform duration-200 hover:scale-[1.03]">
            <Image
              src="/assets/logo.png"
              alt="STI - Smart Technologie Innovation"
              width={200}
              height={70}
              className="h-14 w-auto max-w-[200px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/console"
                      ? pathname === "/console"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
                          : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                      }`}
                    >
                      <item.icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer / Support */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-primary/10 text-red-primary flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Administrator</div>
                <div className="text-[10px] text-gray-400">admin@sti.dz</div>
              </div>
            </div>
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/gate/login";
              }}
              title="Sign Out of Console"
              className="text-gray-400 hover:text-red-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Menu size={18} />
            </button>

            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dashboard, products, quotes..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary bg-gray-50/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct website link */}
            <Link
              href="/en"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-primary transition-colors"
            >
              <span>View Website</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-primary rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}