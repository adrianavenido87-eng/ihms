/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Search,
  Filter,
  BadgeAlert,
  Verified,
  Mail,
  Phone,
  MapPin,
  Home,
  Utensils,
  History,
  FileSpreadsheet,
  Edit2,
  Check,
  ChevronRight,
  BookOpen,
  CalendarCheck2,
} from "lucide-react";
import { Guest } from "../types";

interface GuestsSectionProps {
  guests: Guest[];
  onUpdateGuest: (updated: Guest) => void;
  selectedGuestId?: string;
  onSelectGuest: (id: string) => void;
}

export default function GuestsSection({
  guests,
  onUpdateGuest,
  selectedGuestId,
  onSelectGuest,
}: GuestsSectionProps) {
  const [searchVal, setSearchVal] = useState("");
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "STAY_HISTORY" | "PREFERENCES" | "BILLING">("OVERVIEW");

  // Edit guest values
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [tempDietary, setTempDietary] = useState("");
  const [tempRoomPref, setTempRoomPref] = useState("");
  const [tempOpsNotes, setTempOpsNotes] = useState("");

  const activeGuest = guests.find((g) => g.id === selectedGuestId) || guests[0];

  const handleStartEdit = () => {
    if (!activeGuest) return;
    setTempDietary(activeGuest.dietary);
    setTempRoomPref(activeGuest.roomPref);
    setTempOpsNotes(activeGuest.opsNotes);
    setIsEditingPreferences(true);
  };

  const handleSavePreferences = () => {
    if (!activeGuest) return;
    onUpdateGuest({
      ...activeGuest,
      dietary: tempDietary,
      roomPref: tempRoomPref,
      opsNotes: tempOpsNotes,
    });
    setIsEditingPreferences(false);
    alert(`Guest profile preferences for ${activeGuest.name} saved!`);
  };

  const handleAddStayDemo = () => {
    if (!activeGuest) return;
    const newStay = {
      property: "BHR Premier Boracay",
      dates: "Jun 12 - Jun 15, 2026 (Upcoming)",
      roomType: "Beachfront Villa",
      spend: "$2,850.00",
    };
    onUpdateGuest({
      ...activeGuest,
      stayHistory: [newStay, ...activeGuest.stayHistory],
    });
    alert(`Demo stay booked successfully for ${activeGuest.name}! View Stays History.`);
  };

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchVal.toLowerCase()) ||
    g.email.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] select-none animate-fadeIn">
      {/* Left Column: Guest Directory List */}
      <section className="w-full lg:w-1/3 flex flex-col bg-white border border-outline-variant/30 rounded-sm overflow-hidden shrink-0 shadow-2xs h-full">
        <div className="p-4 border-b border-[#e6e8ea] flex justify-between items-center bg-white">
          <h3 className="font-sans text-xs font-bold text-on-surface uppercase tracking-widest leading-none">
            Guest Directory ({guests.length})
          </h3>
          <button 
            onClick={() => setSearchVal(searchVal ? "" : "Masterson")}
            className="flex items-center gap-1 text-gold-dark hover:text-gold-light transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Guest Search bar */}
        <div className="p-3 border-b border-gray-100 relative bg-slate-50/50">
          <input
            type="text"
            className="w-full bg-white border border-[#eceef0] text-xs px-3 py-1.5 rounded pl-8 outline-none focus:ring-1 focus:ring-gold-light font-sans placeholder-gray-400"
            placeholder="Search guests by name or loyalty ID..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-5 top-4.5" />
        </div>

        {/* Guests Directory List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-100 bg-white">
          {filteredGuests.map((guest) => {
            const isActive = guest.id === activeGuest?.id;
            return (
              <div
                key={guest.id}
                onClick={() => {
                  onSelectGuest(guest.id);
                  setIsEditingPreferences(false);
                }}
                className={`p-4 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#f2f4f6]/60 border-l-4 border-gold-light"
                    : "hover:bg-[#f8fafc]/50"
                }`}
              >
                <div className="flex justify-between items-start mb-1 text-xs">
                  <span className="font-serif font-bold text-gray-900 leading-none truncate max-w-[180px]">
                    {guest.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[8.5px] uppercase font-bold tracking-tight ${
                    guest.tier.includes("Diamond") ? "bg-amber-50 text-gold-dark border border-amber-200" :
                    guest.tier.includes("Gold") ? "bg-slate-50 text-slate-800" :
                    guest.tier.includes("Club") ? "bg-blue-50 text-blue-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {guest.tier}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm text-gray-400 text-[10.5px]">
                  <span>Room 402 • Executive Suite</span>
                  <span className="font-mono text-[9px] font-bold text-slate-400">#BHR-09{guest.loyaltyPoints.toString().slice(0, 3)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right Column: Guest Detail Master Pane */}
      {activeGuest ? (
        <section className="flex-1 bg-white border border-outline-variant/30 rounded-sm overflow-y-auto custom-scrollbar flex flex-col shadow-xs h-full bg-white relative">
          {/* Cover Penthouse image overlay matching Image 4 */}
          <div className="relative h-48 w-full bg-slate-900 overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-surface-charcoal to-transparent z-10 opacity-80"></div>
            <img
              className="w-full h-full object-cover opacity-50 select-none pointer-events-none"
              alt="Penthouse skyline view"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJMLcz3ahZjXrn86yeJZKQm3ZW5BU_XhwVDsKc2FQvSHNzc8m_U5n1IkqiIuXu6xWdYBA-ZRBwQncxZD1RkG06MUNBPs6qpqV33HuJRVzn4hOTunNhNUosZGUHMDSHrV0g_o4L1Hc_JSsH0Dv7dKFyLwbbpgeKPf6kzVdT-f1blmgkWPqWuO3ejNnt-zJNBwv4hVRM1pDiRln70JBDG0dHE2IKBnKjkx9Ka9leMjhz_B0yHLOvJ6EQZ9LoJLZuldwjCoxbhXQ1sg"
            />
            {/* Guest Headshot details overlay */}
            <div className="absolute bottom-6 left-8 z-20 flex items-center gap-6 text-white text-sans">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-2xl shrink-0 filter grayscale">
                <img
                  className="w-full h-full object-cover"
                  src={activeGuest.avatar}
                  alt={activeGuest.name}
                />
              </div>
              <div className="space-y-1">
                <h1 className="font-serif text-headline-sm md:text-headline-md font-bold leading-none tracking-wide text-white">
                  {activeGuest.name}
                </h1>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="flex items-center gap-1 text-gold-light font-bold text-[10px] tracking-wider uppercase font-sans">
                    <Verified className="w-3.5 h-3.5 text-gold-light fill-amber-500" />
                    <span>PREMIER CLUB {activeGuest.tier.split(" ").slice(-1)[0].toUpperCase()}</span>
                  </span>
                  <span className="text-gray-300 text-xs">• Member Since {activeGuest.memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details tabs row exactly specifying overview options */}
          <div className="px-8 border-b border-[#eceef0] bg-white flex gap-8 shrink-0 text-xs font-bold uppercase tracking-widest font-sans">
            <button
              onClick={() => setActiveTab("OVERVIEW")}
              className={`py-4 border-b-2 text-[10px] transition-all cursor-pointer ${
                activeTab === "OVERVIEW" ? "border-gold-light text-primary-gold" : "border-transparent text-gray-400 hover:text-gold-light"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("STAY_HISTORY")}
              className={`py-4 border-b-2 text-[10px] transition-all cursor-pointer ${
                activeTab === "STAY_HISTORY" ? "border-gold-light text-primary-gold" : "border-transparent text-gray-400 hover:text-gold-light"
              }`}
            >
              Stay History
            </button>
            <button
              onClick={() => setActiveTab("PREFERENCES")}
              className={`py-4 border-b-2 text-[10px] transition-all cursor-pointer ${
                activeTab === "PREFERENCES" ? "border-gold-light text-primary-gold" : "border-transparent text-gray-400 hover:text-gold-light"
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab("BILLING")}
              className={`py-4 border-b-2 text-[10px] transition-all cursor-pointer ${
                activeTab === "BILLING" ? "border-gold-light text-primary-gold" : "border-transparent text-gray-400 hover:text-gold-light"
              }`}
            >
              Billing logs
            </button>
          </div>

          {/* Active Tab Panel Content */}
          <div className="p-8 space-y-8 flex-1 bg-white font-sans text-xs">
            {activeTab === "OVERVIEW" && (
              <>
                {/* Contact and Stay Split cards specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                  <div className="space-y-4">
                    <h4 className="font-bold text-[11px] text-outline uppercase tracking-wider border-b pb-2">
                      Contact Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gold-dark shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">Email Address</p>
                          <p className="text-gray-800 font-medium font-mono">{activeGuest.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gold-dark shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">Phone Number</p>
                          <p className="text-gray-800 font-medium font-mono">{activeGuest.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gold-dark shrink-0" />
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">Primary Residence</p>
                          <p className="text-gray-800 font-medium">{activeGuest.residence}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-[11px] text-outline uppercase tracking-wider border-b pb-2">
                      Current Stay Details
                    </h4>
                    <div className="bg-[#f2f4f6]/40 border border-slate-100 p-4 rounded-sm flex flex-col gap-3.5 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Check-in Date</span>
                        <span className="font-semibold text-slate-800 font-mono">Oct 12, 2023</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Check-out Date</span>
                        <span className="font-semibold text-slate-800 font-mono">Oct 18, 2023 (6 Nights)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Assigned Suite</span>
                        <span className="font-bold text-gold-dark underline font-mono cursor-pointer">Room Suite 402</span>
                      </div>
                      <div className="pt-2 border-t border-[#eceef0] flex justify-between items-center">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Ledger Status</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold uppercase text-[8.5px]">
                          Checked In
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Point Loyalty Banner matches Image 4 exactly */}
                <div className="bg-surface-charcoal p-6 rounded-md relative text-white overflow-hidden shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Subtle decorative background texture */}
                  <div className="absolute right-0 top-0 opacity-15 pointer-events-none text-right flex justify-end">
                    <FileSpreadsheet className="w-48 h-48 text-white -mr-16 -mt-16" />
                  </div>

                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-headline-sm text-gold-light font-bold">Premier Club</h3>
                      <span className="font-sans text-[8px] bg-white/10 px-1.5 py-0.5 font-bold tracking-widest rounded-sm">
                        DIAMOND TIER VIP
                      </span>
                    </div>
                    <p className="text-gray-300 font-sans max-w-sm leading-relaxed text-[11px]">
                      Complimentary premium spa services, early checkout, executive concierge, and 24/7 personal butler.
                    </p>
                    <p className="text-[10px] text-gold-light italic">Butler contact assigned: James Liang</p>
                  </div>

                  <div className="relative z-10 md:text-right border-l md:border-l-0 border-white/10 pl-4 md:pl-0">
                    <p className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">
                      Loyalty points balance
                    </p>
                    <p className="font-mono text-headline-md font-bold text-gold-light leading-none">
                      {activeGuest.loyaltyPoints.toLocaleString()}
                    </p>
                    <button 
                      onClick={() => alert(`Showing rewards ledger catalog for ${activeGuest.name}.`)}
                      className="mt-3 text-white hover:text-gold-light transition-colors text-[9px] font-bold uppercase tracking-wider flex items-center md:justify-end gap-1"
                    >
                      <span>View Rewards</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Preferences Segment Cards */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-bold text-[11px] text-outline uppercase tracking-wider">
                      Guest Preferences &amp; Op Notes
                    </h4>
                    <button
                      onClick={handleStartEdit}
                      className="text-[10px] font-bold text-gold-dark hover:text-gold-light uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-gold-light" />
                      <span>Edit Preferences</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Dietary Preference Card */}
                    <div className="p-4 border border-outline-variant/30 rounded-sm bg-slate-50/20 flex flex-col gap-2 shadow-2xs">
                      <Utensils className="w-5 h-5 text-gold-dark shrink-0" />
                      <h5 className="font-bold text-[9px] text-gray-500 uppercase tracking-widest leading-none mt-1">Dietary Requirements</h5>
                      <p className="text-gray-800 text-[11.5px] leading-relaxed">
                        {activeGuest.dietary || "None specified."}
                      </p>
                    </div>

                    {/* Room Preference Card */}
                    <div className="p-4 border border-outline-variant/30 rounded-sm bg-slate-50/20 flex flex-col gap-2 shadow-2xs">
                      <Home className="w-5 h-5 text-gold-dark shrink-0" />
                      <h5 className="font-bold text-[9px] text-gray-500 uppercase tracking-widest leading-none mt-1">Room Setup Pref</h5>
                      <p className="text-gray-800 text-[11.5px] leading-relaxed">
                        {activeGuest.roomPref || "General floor parameters."}
                      </p>
                    </div>

                    {/* Ops Notes Card */}
                    <div className="p-4 border border-outline-variant/30 rounded-sm bg-slate-50/20 flex flex-col gap-2 shadow-2xs">
                      <History className="w-5 h-5 text-gold-dark shrink-0" />
                      <h5 className="font-bold text-[9px] text-gray-500 uppercase tracking-widest leading-none mt-1">Operational Notes</h5>
                      <p className="text-gray-800 text-[11.5px] leading-relaxed">
                        {activeGuest.opsNotes || "No VIP status notes recorded yet."}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "STAY_HISTORY" && (
              <div className="space-y-4">
                <h4 className="font-bold text-[11px] text-outline uppercase tracking-wider border-b pb-2">
                  Stay History Ledger
                </h4>
                <div className="overflow-x-auto border rounded-sm">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-slate-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b">
                      <tr>
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Dates</th>
                        <th className="px-4 py-3">Room Type</th>
                        <th className="px-4 py-3">Total Spend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {activeGuest.stayHistory.map((history, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-800">{history.property}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{history.dates}</td>
                          <td className="px-4 py-3 text-slate-600">{history.roomType}</td>
                          <td className="px-4 py-3 text-primary-gold font-mono font-semibold">{history.spend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "PREFERENCES" && (
              <div className="space-y-4">
                <h4 className="font-bold text-[11px] text-outline uppercase tracking-wider border-b pb-2">
                  Full Customer Preferences Sheet
                </h4>
                <div className="bg-slate-50 p-4 rounded-sm border space-y-4 text-xs font-sans text-gray-700">
                  <p>
                    - **Turndown Service**: Requires standard evening turn down config dynamically around 19:30.
                  </p>
                  <p>
                    - **Lobby Transport**: Shuttle service requested on departures checkouts.
                  </p>
                  <p>
                    - **Amenities**: Double up executive vanity kits and standard premium body care lotions.
                  </p>
                  <p>
                    - **Communication**: Prefers contact via SMS over private email accounts.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "BILLING" && (
              <div className="space-y-4">
                <h4 className="font-bold text-[11px] text-outline uppercase tracking-wider border-b pb-2 font-serif">
                  Outstanding Folio &amp; Invoice Billing Logs
                </h4>
                <div className="p-6 bg-slate-50 rounded-sm border border-dashed text-center flex flex-col justify-center items-center h-40">
                  <Verified className="w-8 h-8 text-emerald-600 mb-2" />
                  <p className="font-bold text-slate-800 text-xs">All accounts fully paid and settled</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">Invoice Reference: #BHR-9932-2026</p>
                </div>
              </div>
            )}
          </div>

          {/* Action details footer matching layout specs in Image 4 */}
          <div className="mt-auto p-6 border-t border-surface-container-high flex flex-wrap justify-end gap-3.5 bg-slate-50 shrink-0 select-none text-xs font-sans font-bold">
            <button 
              onClick={() => alert("Report generated: PDF summary writing to memory.")}
              className="px-5 py-2.5 bg-white border border-outline-variant text-[#807666] hover:border-gold-light hover:text-gold-dark transition-colors rounded-2xs uppercase tracking-widest text-[10px]"
            >
              Generate Report
            </button>
            <button 
              onClick={handleStartEdit}
              className="px-5 py-2.5 bg-white border border-outline-variant text-[#807666] hover:border-gold-light hover:text-gold-dark transition-colors rounded-2xs uppercase tracking-widest text-[10px]"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleAddStayDemo}
              className="px-6 py-2.5 bg-gold-light hover:bg-gold-dark text-white rounded-2xs uppercase tracking-widest text-[10px]"
            >
              Book New Stay
            </button>
          </div>

          {/* Inline Edit form overlay matching custom parameters */}
          {isEditingPreferences && (
            <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border border-outline-variant max-w-md w-full rounded-sm p-6 space-y-4 shadow-2xl animate-scaleUp text-xs font-sans">
                <div className="flex justify-between border-b pb-2">
                  <h4 className="font-serif text-headline-sm font-bold text-gold-dark uppercase tracking-wider">
                    Edit Preference Sheet
                  </h4>
                  <button onClick={() => setIsEditingPreferences(false)} className="text-gray-400 hover:text-slate-950 font-bold">
                    Close
                  </button>
                </div>
                
                <div className="space-y-4 text-gray-800">
                  <div className="flex flex-col">
                    <label className="font-bold mb-1 uppercase text-gray-500 tracking-wider">Dietary Preferences</label>
                    <textarea
                      rows={2}
                      className="p-2 border rounded-sm outline-none focus:ring-1 focus:ring-gold-light text-xs resize-none"
                      value={tempDietary}
                      onChange={(e) => setTempDietary(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold mb-1 uppercase text-gray-500 tracking-wider">Room Setup Preferences</label>
                    <textarea
                      rows={2}
                      className="p-2 border rounded-sm outline-none focus:ring-1 focus:ring-gold-light text-xs resize-none"
                      value={tempRoomPref}
                      onChange={(e) => setTempRoomPref(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold mb-1 uppercase text-gray-500 tracking-wider">VIP Operations Notes</label>
                    <textarea
                      rows={2}
                      className="p-2 border rounded-sm outline-none focus:ring-1 focus:ring-gold-light text-xs resize-none"
                      value={tempOpsNotes}
                      onChange={(e) => setTempOpsNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-2 justify-end uppercase tracking-wider font-bold">
                  <button
                    onClick={() => setIsEditingPreferences(false)}
                    className="px-4 py-2 border rounded-2xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2 bg-gold-light text-white rounded-2xs hover:bg-gold-dark"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="flex-1 bg-white border border-outline-variant/30 rounded-sm flex items-center justify-center p-8 text-center text-gray-400 italic">
          Please select a guest from the left directory column to inspect checkout records and VIP tier states.
        </div>
      )}
    </div>
  );
}
