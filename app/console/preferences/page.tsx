"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Globe2,
  Calendar,
} from "lucide-react";
import type { CompanyPreferences, DayHours } from "../../api/preferences/route";

const FacebookIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const LinkedinIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const YoutubeIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const daysKeys = [
  { key: "saturday", label: "Saturday (السبت)", fr: "Samedi" },
  { key: "sunday", label: "Sunday (الأحد)", fr: "Dimanche" },
  { key: "monday", label: "Monday (الإثنين)", fr: "Lundi" },
  { key: "tuesday", label: "Tuesday (الثلاثاء)", fr: "Mardi" },
  { key: "wednesday", label: "Wednesday (الأربعاء)", fr: "Mercredi" },
  { key: "thursday", label: "Thursday (الخميس)", fr: "Jeudi" },
  { key: "friday", label: "Friday (الجمعة)", fr: "Vendredi" },
] as const;

export default function PreferencesPage() {
  const [activeTab, setActiveTab] = useState<"connect" | "social" | "hours">("connect");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({ en: "", ar: "", fr: "" });
  const [gmapsEmbed, setGmapsEmbed] = useState("");

  const [businessInfo, setBusinessInfo] = useState({
    companyName: { en: "", ar: "", fr: "" },
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    linkedin: "",
    twitter: "",
    youtube: "",
  });

  const [businessHours, setBusinessHours] = useState<{
    saturday: DayHours;
    sunday: DayHours;
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
  }>({
    saturday: { open: "08:00", close: "17:00", isClosed: false },
    sunday: { open: "08:00", close: "17:00", isClosed: false },
    monday: { open: "08:00", close: "18:00", isClosed: false },
    tuesday: { open: "08:00", close: "18:00", isClosed: false },
    wednesday: { open: "08:00", close: "18:00", isClosed: false },
    thursday: { open: "08:00", close: "17:00", isClosed: false },
    friday: { open: "00:00", close: "00:00", isClosed: true },
  });

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data: CompanyPreferences = await res.json();
          setPhone(data.phone);
          setEmail(data.email);
          setAddress(data.address);
          setGmapsEmbed(data.gmapsEmbed);
          setBusinessInfo(data.businessInfo);
          setSocialMedia(data.socialMedia);
          setBusinessHours(data.businessHours);
        }
      } catch (err) {
        console.error("Failed to load preferences from API", err);
      }
    }
    loadPreferences();
  }, []);

  const handleHoursChange = (day: keyof typeof businessHours, field: keyof DayHours, value: any) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const payload: CompanyPreferences = {
        phone,
        email,
        address,
        gmapsEmbed,
        businessInfo,
        socialMedia,
        businessHours,
      };

      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      alert("Error saving preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            Global Preferences &amp; Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure contact info, social media linkages, and daily business hours schedules.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-primary text-white text-xs font-bold rounded-xl hover:bg-red-primary/90 transition-all hover:shadow-lg hover:shadow-red-primary/20 disabled:opacity-60"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 size={16} />
              <span>Saved Preferences!</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-2xl p-2 border shadow-sm gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("connect")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "connect"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Phone size={16} />
          <span>1. Quick Connect</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "social"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Globe2 size={16} />
          <span>2. Social Media Linkages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hours")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === "hours"
              ? "bg-red-primary text-white shadow-md shadow-red-primary/20"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Clock size={16} />
          <span>3. Business Hours of Each Day</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
        
        {/* 1. Quick Connect */}
        {activeTab === "connect" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Phone size={18} className="text-red-primary" />
                Quick Connect Channels
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Primary contact options visible to customer inquiries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0550 123 456"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-red-primary outline-none"
                  />
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Contact Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@sti.dz"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-red-primary outline-none"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <MapPin size={16} className="text-red-primary" />
                  <span>Multilingual Physical Office Address</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">ENGLISH ADDRESS</label>
                    <input
                      type="text"
                      value={address.en}
                      onChange={(e) => setAddress({ ...address, en: e.target.value })}
                      placeholder="Address in English..."
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs font-medium focus:border-red-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">العنوان باللغة العربية (RTL)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={address.ar}
                      onChange={(e) => setAddress({ ...address, ar: e.target.value })}
                      placeholder="العنوان بالعربية..."
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs font-medium focus:border-red-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">ADRESSE EN FRANÇAIS</label>
                    <input
                      type="text"
                      value={address.fr}
                      onChange={(e) => setAddress({ ...address, fr: e.target.value })}
                      placeholder="Adresse en Français..."
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-xs font-medium focus:border-red-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Google Map Embed Link (iframe src URL attribute only)
                </label>
                <textarea
                  rows={2}
                  value={gmapsEmbed}
                  onChange={(e) => setGmapsEmbed(e.target.value)}
                  placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs font-mono text-gray-800 focus:border-red-primary outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Social Media Linkages */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Globe2 size={18} className="text-red-primary" />
                Social Media Links
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Corporate accounts rendered in footer &amp; sidebar navigation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <FacebookIcon size={16} className="text-blue-600" />
                  <span>Facebook Profile URL</span>
                </label>
                <input
                  type="url"
                  value={socialMedia.facebook}
                  onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-red-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <LinkedinIcon size={16} className="text-blue-700" />
                  <span>LinkedIn Page URL</span>
                </label>
                <input
                  type="url"
                  value={socialMedia.linkedin}
                  onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/yourpage"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-red-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <TwitterIcon size={16} className="text-black" />
                  <span>Twitter / X Profile URL</span>
                </label>
                <input
                  type="url"
                  value={socialMedia.twitter}
                  onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                  placeholder="https://twitter.com/yourpage"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-red-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                  <YoutubeIcon size={16} className="text-red-primary" />
                  <span>YouTube Channel URL</span>
                </label>
                <input
                  type="url"
                  value={socialMedia.youtube}
                  onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:border-red-primary outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. Weekly Business Hours */}
        {activeTab === "hours" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Clock size={18} className="text-red-primary" />
                Working Hours of Each Day
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Specify opening &amp; closing schedules individually for each day of the week.</p>
            </div>

            <div className="space-y-4">
              {daysKeys.map(({ key, label, fr }) => {
                const dayConfig = businessHours[key];
                return (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900 capitalize">{key}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{label} • {fr}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dayConfig.isClosed}
                          onChange={(e) => handleHoursChange(key, "isClosed", e.target.checked)}
                          className="rounded text-red-primary focus:ring-red-primary/10 h-4 w-4"
                        />
                        <span className="text-xs font-bold text-gray-700">Mark as Closed</span>
                      </label>

                      {!dayConfig.isClosed && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={dayConfig.open}
                            onChange={(e) => handleHoursChange(key, "open", e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded-lg text-xs font-semibold focus:border-red-primary bg-white outline-none"
                          />
                          <span className="text-xs text-gray-400 font-bold">to</span>
                          <input
                            type="time"
                            value={dayConfig.close}
                            onChange={(e) => handleHoursChange(key, "close", e.target.value)}
                            className="px-2 py-1 border border-gray-200 rounded-lg text-xs font-semibold focus:border-red-primary bg-white outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}