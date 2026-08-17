"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  Briefcase,
  FileUser,
  MessageSquare,
  FileText,
  Building2,
  Users,
  ShieldCheck,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ShieldAlert,
  Loader2,
  CheckCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const allNavSections = [
  {
    label: "Main",
    items: [
      { href: "/console", icon: LayoutDashboard, label: "Dashboard", permission: "dashboard:view" },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/console/layers", icon: Layers, label: "Solutions", permission: "solutions:view" },
      { href: "/console/inventory", icon: Package, label: "Products", permission: "products:view" },
      { href: "/console/news", icon: FileText, label: "News & Articles", permission: "news:view" },
    ],
  },
  {
    label: "Careers",
    items: [
      { href: "/console/openings", icon: Briefcase, label: "Job Offers", permission: "openings:view" },
      { href: "/console/submissions", icon: FileUser, label: "Applications (CVs)", permission: "submissions:view" },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/console/mailbox", icon: MessageSquare, label: "Messages", permission: "mailbox:view" },
      { href: "/console/requests", icon: FileText, label: "Quote Requests", permission: "requests:view" },
    ],
  },
  {
    label: "Company",
    items: [
      { href: "/console/identity", icon: Building2, label: "Company Info", permission: "company:view" },
    ],
  },
  {
    label: "Users & Access",
    items: [
      { href: "/console/members", icon: Users, label: "Users", permission: "members:view" },
      { href: "/console/access", icon: ShieldCheck, label: "Roles", permission: "access:view" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/console/preferences", icon: Settings, label: "General Settings", permission: "settings:view" },
    ],
  },
];

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  href: string;
  type: "request" | "message" | "submission" | "user";
  read: boolean;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: string;
  icon: any;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, loading, hasPermission, canAccessRoute, logout } = useAuth();

  // Search & Notification States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dataItems, setDataItems] = useState<SearchResultItem[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/gate/login");
    }
  }, [loading, user, router]);

  // Fetch live notifications & index searchable content
  useEffect(() => {
    if (!user) return;

    async function loadNotificationsAndData() {
      try {
        const [reqRes, msgRes, subRes, userRes, prodRes, newsRes, jobRes] = await Promise.all([
          fetch("/api/requests", { cache: "no-store" }).catch(() => null),
          fetch("/api/messages", { cache: "no-store" }).catch(() => null),
          fetch("/api/submissions", { cache: "no-store" }).catch(() => null),
          fetch("/api/users", { cache: "no-store" }).catch(() => null),
          fetch("/api/products", { cache: "no-store" }).catch(() => null),
          fetch("/api/news", { cache: "no-store" }).catch(() => null),
          fetch("/api/jobs", { cache: "no-store" }).catch(() => null),
        ]);

        const notifs: NotificationItem[] = [];
        const searchable: SearchResultItem[] = [];

        // 1. Quote Requests
        if (reqRes && reqRes.ok) {
          const reqs = await reqRes.json();
          if (Array.isArray(reqs)) {
            reqs.slice(0, 5).forEach((r: any) => {
              notifs.push({
                id: `req_${r.id}`,
                title: `New Quote Request`,
                description: `${r.businessName || r.contactPerson || "Client"} requested quote for ${Array.isArray(r.products) ? r.products.join(", ") : "products"}`,
                timestamp: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
                href: "/console/requests",
                type: "request",
                read: false,
              });
              searchable.push({
                id: `quote_${r.id}`,
                title: r.businessName || r.contactPerson || "Quote Request",
                subtitle: `Quote Request • ${r.phone || r.email || ""}`,
                category: "Quote Requests",
                href: "/console/requests",
                icon: FileText,
              });
            });
          }
        }

        // 2. Messages
        if (msgRes && msgRes.ok) {
          const msgs = await msgRes.json();
          if (Array.isArray(msgs)) {
            msgs.slice(0, 5).forEach((m: any) => {
              notifs.push({
                id: `msg_${m.id}`,
                title: `New Client Message`,
                description: `Message from ${m.fullName || m.name || m.email || "Contact"}: "${(m.subject || m.message || "").slice(0, 50)}..."`,
                timestamp: m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
                href: "/console/mailbox",
                type: "message",
                read: false,
              });
              searchable.push({
                id: `msg_${m.id}`,
                title: m.fullName || m.name || "Client Message",
                subtitle: `Mailbox • ${m.subject || m.email || ""}`,
                category: "Messages",
                href: "/console/mailbox",
                icon: MessageSquare,
              });
            });
          }
        }

        // 3. Applications
        if (subRes && subRes.ok) {
          const subs = await subRes.json();
          if (Array.isArray(subs)) {
            subs.slice(0, 5).forEach((s: any) => {
              notifs.push({
                id: `sub_${s.id}`,
                title: `New Job Application`,
                description: `${s.fullName || s.name || "Candidate"} applied for ${s.jobTitle || "Job Position"}`,
                timestamp: s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Recently",
                href: "/console/submissions",
                type: "submission",
                read: false,
              });
              searchable.push({
                id: `sub_${s.id}`,
                title: s.fullName || s.name || "Job Application",
                subtitle: `Applications • ${s.jobTitle || s.email || ""}`,
                category: "Applications",
                href: "/console/submissions",
                icon: FileUser,
              });
            });
          }
        }

        // 4. Products
        if (prodRes && prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods)) {
            prods.forEach((p: any) => {
              searchable.push({
                id: `prod_${p.id}`,
                title: p.name || p.title || "Product",
                subtitle: `Products • Category: ${p.category || "Inventory"}`,
                category: "Products",
                href: `/console/inventory/${p.id}/edit`,
                icon: Package,
              });
            });
          }
        }

        // 5. News
        if (newsRes && newsRes.ok) {
          const news = await newsRes.json();
          if (Array.isArray(news)) {
            news.forEach((n: any) => {
              searchable.push({
                id: `news_${n.id}`,
                title: n.title || "News Article",
                subtitle: `News & Articles • ${n.category || "General"}`,
                category: "News",
                href: `/console/news/${n.id}/edit`,
                icon: FileText,
              });
            });
          }
        }

        // 6. Users
        if (userRes && userRes.ok) {
          const usersData = await userRes.json();
          if (Array.isArray(usersData)) {
            usersData.forEach((u: any) => {
              searchable.push({
                id: `user_${u.id}`,
                title: u.name || u.username || "Console User",
                subtitle: `Users & Access • Role: ${u.roleName || "User"}`,
                category: "Users",
                href: "/console/members",
                icon: Users,
              });
            });
          }
        }

        setNotifications(notifs);
        setDataItems(searchable);
      } catch (err) {
        console.error("Failed to load layout notification data", err);
      }
    }

    loadNotificationsAndData();
  }, [user]);

  // Static navigation routes searchable list
  const staticSearchItems: SearchResultItem[] = useMemo(() => [
    { id: "nav_dash", title: "Dashboard Overview", subtitle: "Main analytics & KPI overview", category: "Navigation", href: "/console", icon: LayoutDashboard },
    { id: "nav_sol", title: "Solutions & Services", subtitle: "Telecom distribution services", category: "Navigation", href: "/console/layers", icon: Layers },
    { id: "nav_inv", title: "Inventory & Products", subtitle: "Manage SIM cards & recharge credit", category: "Navigation", href: "/console/inventory", icon: Package },
    { id: "nav_news", title: "News & Articles", subtitle: "Publish company announcements", category: "Navigation", href: "/console/news", icon: FileText },
    { id: "nav_job", title: "Job Openings", subtitle: "Manage career job listings", category: "Navigation", href: "/console/openings", icon: Briefcase },
    { id: "nav_sub", title: "Candidate Applications", subtitle: "Review applicant CV submissions", category: "Navigation", href: "/console/submissions", icon: FileUser },
    { id: "nav_mail", title: "Messages & Mailbox", subtitle: "Client inquiries & contact form messages", category: "Navigation", href: "/console/mailbox", icon: MessageSquare },
    { id: "nav_req", title: "Quote Requests", subtitle: "Review client quotation requests", category: "Navigation", href: "/console/requests", icon: FileText },
    { id: "nav_id", title: "Company Info & Hours", subtitle: "Business hours & company details", category: "Navigation", href: "/console/identity", icon: Building2 },
    { id: "nav_mem", title: "User Accounts", subtitle: "Manage team members & credentials", category: "Navigation", href: "/console/members", icon: Users },
    { id: "nav_acc", title: "Roles & Permissions", subtitle: "Access control & role permissions", category: "Navigation", href: "/console/access", icon: ShieldCheck },
    { id: "nav_pref", title: "General Settings", subtitle: "System preferences & configuration", category: "Navigation", href: "/console/preferences", icon: Settings },
  ], []);

  // Filter search results dynamically
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const combined = [...staticSearchItems, ...dataItems];

    const filtered = combined.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    setSearchResults(filtered.slice(0, 8));
  }, [searchQuery, staticSearchItems, dataItems]);

  // Click outside listener to close search/notifications dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setNotificationsOpen(false);
    router.push(notif.href);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <Loader2 size={32} className="animate-spin text-red-primary mb-3" />
        <span className="text-xs font-semibold">Verifying Security Session...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter sidebar sections to show only authorized pages
  const navSections = allNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => hasPermission(item.permission)),
    }))
    .filter((section) => section.items.length > 0);

  const isCurrentRouteAuthorized = canAccessRoute(pathname);

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

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-red-primary/10 text-red-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-gray-900 truncate">{user.name}</div>
                <div className="text-[10px] text-red-primary font-semibold truncate">{user.roleName}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out of Console"
              className="text-gray-400 hover:text-red-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
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
          {/* Left: Mobile Menu & Live Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md" ref={searchContainerRef}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search console dashboard, products, quotes, messages..."
                className="w-full pl-10 pr-8 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-primary/20 focus:border-red-primary bg-gray-50/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={14} />
                </button>
              )}

              {/* Live Search Results Dropdown */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Search Results ({searchResults.length})
                      </div>
                      {searchResults.map((item) => {
                        const ItemIcon = item.icon || Search;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSearchFocused(false);
                              setSearchQuery("");
                              router.push(item.href);
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors group"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-red-primary/10 group-hover:text-red-primary transition-colors shrink-0">
                                <ItemIcon size={16} />
                              </div>
                              <div className="truncate">
                                <div className="text-xs font-bold text-gray-900 truncate">{item.title}</div>
                                <div className="text-[11px] text-gray-500 truncate">{item.subtitle}</div>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-gray-400 group-hover:text-red-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 px-4 text-center text-xs text-gray-500">
                      No console items or records found matching &quot;<span className="font-semibold text-gray-800">{searchQuery}</span>&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/en"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-primary transition-colors"
            >
              <span>View Website</span>
              <ExternalLink size={12} />
            </Link>

            {/* Notification Bell Dropdown Container */}
            <div className="relative" ref={notifContainerRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-primary"></span>
                  </span>
                )}
              </button>

              {/* Notifications Popover Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-primary/10 text-red-primary font-bold text-[10px]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-semibold text-red-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck size={13} />
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`w-full text-left p-4 hover:bg-gray-50/80 transition-colors flex items-start gap-3 cursor-pointer ${
                            !notif.read ? "bg-red-50/20" : ""
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${
                            notif.type === "request" ? "bg-blue-50 text-blue-600" :
                            notif.type === "message" ? "bg-emerald-50 text-emerald-600" :
                            notif.type === "submission" ? "bg-amber-50 text-amber-600" :
                            "bg-purple-50 text-purple-600"
                          }`}>
                            {notif.type === "request" && <FileText size={16} />}
                            {notif.type === "message" && <MessageSquare size={16} />}
                            {notif.type === "submission" && <FileUser size={16} />}
                            {notif.type === "user" && <Users size={16} />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-xs font-bold text-gray-900 truncate">{notif.title}</span>
                              <span className="text-[10px] text-gray-400 shrink-0">{notif.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2">{notif.description}</p>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-red-primary shrink-0 mt-1.5" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="py-12 px-4 text-center">
                        <Bell size={28} className="mx-auto text-gray-300 mb-2" />
                        <div className="text-xs font-bold text-gray-700">No recent notifications</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">You are all caught up!</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {isCurrentRouteAuthorized ? (
            children
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-primary mb-4">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
                Access Denied / Permission Required
              </h2>
              <p className="text-xs text-gray-500 max-w-md mb-6 leading-relaxed">
                Your current role (<span className="font-bold text-gray-900">{user.roleName}</span>) does not have permission to view or manage this section.
              </p>
              <Link
                href="/console"
                className="px-5 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all shadow-xs"
              >
                Return to Dashboard
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}