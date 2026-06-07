/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Bed, CalendarRange, Users, BarChart3, TrendingUp, Settings, HelpCircle, Plus } from "lucide-react";

interface SidebarProps {
  activeSection: "rooms" | "booking" | "guests" | "reports" | "analytics";
  setActiveSection: (sec: "rooms" | "booking" | "guests" | "reports" | "analytics") => void;
  onNewReservation: () => void;
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
}

export default function Sidebar({ activeSection, setActiveSection, onNewReservation, currentUser }: SidebarProps) {
  const menuItems = [
    { id: "rooms" as const, label: "Rooms", icon: Bed },
    { id: "booking" as const, label: "Booking", icon: CalendarRange },
    { id: "guests" as const, label: "Guests", icon: Users },
    { id: "reports" as const, label: "Reports", icon: BarChart3 },
    { id: "analytics" as const, label: "Analytics", icon: TrendingUp },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface-charcoal border-r border-outline-variant/30 flex flex-col z-50 text-white">
      {/* Brand Header */}
      <div className="px-6 py-8 border-b border-outline-variant/15">
        <h1 className="font-serif text-2xl text-gold-light tracking-widest uppercase mb-1">
          BHR <span className="italic font-normal text-white font-serif">Premier</span>
        </h1>
        <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-light/60">
          OPERATIONAL COMMAND
        </p>
      </div>

      {/* Navigation Rail */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold px-2 py-1 mb-2">
          Management
        </p>
        
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded transition-all duration-200 text-left font-sans text-sm tracking-wider ${
                isActive
                  ? "bg-primary-container/30 text-gold-light border-l-4 border-gold-light font-semibold"
                  : "text-gray-400 hover:text-gold-light hover:bg-white/5"
              }`}
            >
              <IconComponent className={`w-5 h-5 mr-4 shrink-0 ${isActive ? "text-gold-light" : "text-gray-400"}`} />
              <span className="uppercase text-[11px] font-bold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Actions and Support Footer */}
      <div className="p-4 border-t border-[#2d3748]/55 space-y-4">
        <button
          onClick={onNewReservation}
          className="w-full bg-gold-light hover:bg-gold-dark text-surface-charcoal font-bold py-3 px-4 rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-sm text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>

        <div className="space-y-1 text-xs">
          <button
            onClick={() => setActiveSection("analytics")}
            className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-gold-light rounded transition-colors text-left uppercase tracking-wider text-[10px] font-bold"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </button>
          <button
            onClick={() => alert("Connecting to Helpdesk and Operational Manual...")}
            className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-gold-light rounded transition-colors text-left uppercase tracking-wider text-[10px] font-bold"
          >
            <HelpCircle className="w-4 h-4 mr-3" />
            Support
          </button>
        </div>

        {/* Profile Trigger */}
        <div className="pt-4 border-t border-[#2d3748]/55 flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded object-cover border border-outline-variant/30 shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-gray-300 truncate uppercase tracking-widest">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-gray-500 truncate uppercase mt-0.5 font-medium">
              {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
