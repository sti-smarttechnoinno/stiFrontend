"use client";

import { useEffect, useState } from "react";
import { Save, Phone, Clock, CheckCircle2 } from "lucide-react";
import type { CompanyPreferences, DayHours } from '@/app/api/preferences/route';

const defaultHours = [
  { day: "Saturday", open: "08:00", close: "17:00", closed: false },
  { day: "Sunday", open: "08:00", close: "17:00", closed: false },
  { day: "Monday", open: "08:00", close: "17:00", closed: false },
  { day: "Tuesday", open: "08:00", close: "17:00", closed: false },
  { day: "Wednesday", open: "08:00", close: "17:00", closed: false },
  { day: "Thursday", open: "08:00", close: "17:00", closed: false },
  { day: "Friday", open: "", close: "", closed: true },
];

const dayToKey: Record<string, keyof CompanyPreferences["businessHours"]> = {
  Saturday: "saturday",
  Sunday: "sunday",
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
};

export default function ContactHoursPage() {
  const [contact, setContact] = useState({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    mapsUrl: "",
    emergencyContact: "",
    facebook: "",
    linkedin: "",
    instagram: "",
  });

  const [hours, setHours] = useState(defaultHours);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [fullPrefs, setFullPrefs] = useState<CompanyPreferences | null>(null);

  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/preferences");
        if (res.ok) {
          const data: CompanyPreferences = await res.json();
          setFullPrefs(data);

          const addrString = typeof data.address === "string" 
            ? data.address 
            : (data.address?.en || data.address?.fr || data.address?.ar || "");

          setContact({
            phone: data.phone || "",
            whatsapp: data.whatsapp || data.phone || "",
            email: data.email || "",
            address: addrString,
            mapsUrl: data.gmapsEmbed || "",
            emergencyContact: data.emergencyContact || "",
            facebook: data.socialMedia?.facebook || "",
            linkedin: data.socialMedia?.linkedin || "",
            instagram: data.socialMedia?.instagram || "",
          });

          if (data.businessHours) {
            setHours([
              {
                day: "Saturday",
                open: data.businessHours.saturday?.open || "08:00",
                close: data.businessHours.saturday?.close || "17:00",
                closed: !!data.businessHours.saturday?.isClosed,
              },
              {
                day: "Sunday",
                open: data.businessHours.sunday?.open || "08:00",
                close: data.businessHours.sunday?.close || "17:00",
                closed: !!data.businessHours.sunday?.isClosed,
              },
              {
                day: "Monday",
                open: data.businessHours.monday?.open || "08:00",
                close: data.businessHours.monday?.close || "17:00",
                closed: !!data.businessHours.monday?.isClosed,
              },
              {
                day: "Tuesday",
                open: data.businessHours.tuesday?.open || "08:00",
                close: data.businessHours.tuesday?.close || "17:00",
                closed: !!data.businessHours.tuesday?.isClosed,
              },
              {
                day: "Wednesday",
                open: data.businessHours.wednesday?.open || "08:00",
                close: data.businessHours.wednesday?.close || "17:00",
                closed: !!data.businessHours.wednesday?.isClosed,
              },
              {
                day: "Thursday",
                open: data.businessHours.thursday?.open || "08:00",
                close: data.businessHours.thursday?.close || "17:00",
                closed: !!data.businessHours.thursday?.isClosed,
              },
              {
                day: "Friday",
                open: data.businessHours.friday?.open || "00:00",
                close: data.businessHours.friday?.close || "00:00",
                closed: data.businessHours.friday ? !!data.businessHours.friday.isClosed : true,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load contact hours preferences:", err);
      }
    }
    loadPreferences();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      // Build updated businessHours object from state
      const updatedBusinessHours: Record<string, DayHours> = {};
      hours.forEach((h) => {
        const key = dayToKey[h.day];
        if (key) {
          updatedBusinessHours[key] = {
            open: h.open || "08:00",
            close: h.close || "17:00",
            isClosed: h.closed,
          };
        }
      });

      // Maintain object structure for address if previously an object, or create trilingual address object
      const currentAddr = fullPrefs?.address;
      const updatedAddress = typeof currentAddr === "object" && currentAddr !== null
        ? { ...currentAddr, en: contact.address }
        : { en: contact.address, ar: contact.address, fr: contact.address };

      const updatedSocialMedia = {
        ...(fullPrefs?.socialMedia || { facebook: "", linkedin: "", twitter: "", youtube: "" }),
        facebook: contact.facebook,
        linkedin: contact.linkedin,
        instagram: contact.instagram,
      };

      const payload = {
        phone: contact.phone,
        whatsapp: contact.whatsapp,
        email: contact.email,
        address: updatedAddress,
        gmapsEmbed: contact.mapsUrl,
        emergencyContact: contact.emergencyContact,
        socialMedia: updatedSocialMedia,
        businessHours: updatedBusinessHours,
      };

      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert("Failed to save changes. Please try again.");
      }
    } catch {
      alert("Error saving contact and working hours.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact &amp; Working Hours</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your company contact information and business hours.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D71920] text-white text-sm font-semibold rounded-lg hover:bg-[#B81419] transition-colors disabled:opacity-60"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 size={16} /> Saved!
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Phone size={18} className="text-[#D71920]" />
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
              <input
                type="tel"
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Maps URL</label>
              <input
                type="url"
                value={contact.mapsUrl}
                onChange={(e) => setContact({ ...contact, mapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Emergency Contact</label>
              <input
                type="tel"
                value={contact.emergencyContact}
                onChange={(e) => setContact({ ...contact, emergencyContact: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Social Media</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Facebook</label>
                <input
                  type="url"
                  value={contact.facebook}
                  onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={contact.linkedin}
                  onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Instagram</label>
                <input
                  type="url"
                  value={contact.instagram}
                  onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock size={18} className="text-[#D71920]" />
            Working Hours
          </h2>
          <div className="space-y-3">
            {hours.map((h, index) => (
              <div key={h.day} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="w-28 text-sm font-medium text-gray-700">{h.day}</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!h.closed}
                    onChange={(e) => {
                      const newHours = [...hours];
                      newHours[index].closed = !e.target.checked;
                      setHours(newHours);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-[#D71920] focus:ring-[#D71920]/20"
                  />
                  <span className="text-xs text-gray-500">{h.closed ? "Closed" : "Open"}</span>
                </label>
                {!h.closed && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].open = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].close = e.target.value;
                        setHours(newHours);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D71920]/20 focus:border-[#D71920]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}