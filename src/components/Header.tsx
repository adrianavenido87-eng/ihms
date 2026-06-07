/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Bell, Grid, MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";
import { Room, Guest } from "../types";

interface HeaderProps {
  onSearch: (query: string) => void;
  allRooms: Room[];
  allGuests: Guest[];
  onSelectRoom: (id: string) => void;
  onSelectGuest: (id: string) => void;
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
  onChangeUser: () => void;
}

export default function Header({
  onSearch,
  allRooms,
  allGuests,
  onSelectRoom,
  onSelectGuest,
  currentUser,
  onChangeUser,
}: HeaderProps) {
  const [searchVal, setSearchVal] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const matchedRooms = searchVal
    ? allRooms.filter((r) => r.id.includes(searchVal) || r.type.toLowerCase().includes(searchVal.toLowerCase()))
    : [];

  const matchedGuests = searchVal
    ? allGuests.filter((g) => g.name.toLowerCase().includes(searchVal.toLowerCase()))
    : [];

  const hasMatches = matchedRooms.length > 0 || matchedGuests.length > 0;

  return (
    <header className="sticky top-0 right-0 left-64 bg-white/95 backdrop-blur-md border-b border-surface-container-high z-40 flex justify-between items-center px-8 py-4 h-20 shadow-xs">
      <div className="flex items-center gap-12 flex-1">
        <h2 className="font-serif text-2xl text-gold-dark leading-none shrink-0 tracking-wider">
          BHR <span className="italic font-normal text-gold-light font-serif">Premier</span>
        </h2>
        
        {/* Universal Search Bar */}
        <div className="relative w-full max-w-md hidden lg:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            className="w-full bg-surface-container-low border-0 outline-none rounded py-2.5 pl-11 pr-4 text-xs font-sans placeholder-gray-400 focus:ring-1 focus:ring-gold-light transition-all rounded-sm"
            placeholder="Search rooms, guests, or tasks..."
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
          />

          {/* Instant Search Dropdown */}
          {showDropdown && searchVal && hasMatches && (
            <div className="absolute left-0 right-0 top-12 bg-white border border-outline-variant/50 shadow-xl rounded z-55 max-h-80 overflow-y-auto p-2 custom-scrollbar">
              {matchedRooms.length > 0 && (
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1 tracking-wider border-b border-gray-100">
                    Rooms Matches
                  </p>
                  {matchedRooms.slice(0, 4).map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        onSelectRoom(room.id);
                        setSearchVal("");
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-surface-container-low transition-colors rounded flex justify-between items-center"
                    >
                      <span className="text-xs font-sans text-gray-800">
                        Room <strong className="font-mono text-gold-dark">{room.id}</strong> - {room.type}
                      </span>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        room.status === "AVAILABLE" ? "bg-success-main/10 text-success-main" :
                        room.status === "OCCUPIED" ? "bg-blue-100 text-blue-700" :
                        room.status === "DIRTY" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {room.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {matchedGuests.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1 tracking-wider border-b border-gray-100">
                    Guests matches
                  </p>
                  {matchedGuests.slice(0, 4).map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => {
                        onSelectGuest(guest.id);
                        setSearchVal("");
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-surface-container-low transition-colors rounded flex justify-between items-center"
                    >
                      <span className="text-xs font-sans text-gray-800 font-medium">
                        {guest.name}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-gold-dark bg-amber-50 px-1.5 py-0.5 rounded">
                        {guest.tier}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => alert("BHR Premier Properties active load: BHR Premier Manila, BHR Resort Boracay.")}
            className="text-gray-500 hover:text-gold-dark font-sans text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            Properties
          </button>
          <span className="text-primary-gold font-bold border-b-2 border-primary-gold pb-1 font-sans text-[11px] uppercase tracking-widest cursor-default">
            Inventory
          </span>
          <button
            onClick={() => alert("Shift Staff Operations: Elena Ross, Marcus Vance, James Liang, Sarah Kim.")}
            className="text-gray-500 hover:text-gold-dark font-sans text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            Staff
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Daily operational updates: 4 Dirty rooms, 2 Urgent Repair logs.")}
            className="p-2 text-gray-500 hover:bg-surface-container-low hover:text-gold-dark rounded-full transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
          <button
            onClick={() => alert("Open applet store: POS systems, Channel Manager, Booking Engines.")}
            className="p-2 text-gray-500 hover:bg-surface-container-low hover:text-gold-dark rounded-full transition-all cursor-pointer"
            title="Integrations Map"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => alert("Connecting to staff emergency radio channels...")}
            className="p-2 text-gray-500 hover:bg-surface-container-low hover:text-gold-dark rounded-full transition-all cursor-pointer"
            title="Communications"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Change User Toggle */}
        <div 
          onClick={onChangeUser}
          className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:opacity-85 transition-opacity"
          title="Click to Switch Administrator View"
        >
          <div className="text-right">
            <p className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">
              {currentUser.role}
            </p>
            <p className="font-sans text-xs font-bold text-gold-dark leading-none">
              {currentUser.name}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gold-light/20 shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src={currentUser.avatar}
              alt={currentUser.name}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
