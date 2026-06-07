/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  TrendingUp,
  CreditCard,
  LogIn,
  LogOut,
  SlidersHorizontal,
  Plus,
  Key,
  BellRing,
  Award,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  RefreshCw,
  X,
} from "lucide-react";
import { Room, Booking, BookingRequest, ActivityLog } from "../types";

interface BookingSectionProps {
  rooms: Room[];
  bookings: Booking[];
  requests: BookingRequest[];
  activities: ActivityLog[];
  onAddBooking: (booking: Booking) => void;
  onApproveRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
  onUpdateRoom: (room: Room) => void;
}

export default function BookingSection({
  rooms,
  bookings,
  requests,
  activities,
  onAddBooking,
  onApproveRequest,
  onDeclineRequest,
  onUpdateRoom,
}: BookingSectionProps) {
  // Navigation inside Booking Section
  const [bookingTab, setBookingTab] = useState<"dashboard" | "timeline">("dashboard");
  const [currentFloor, setCurrentFloor] = useState("Floor 04");

  // Filter query
  const [searchGuest, setSearchGuest] = useState("");

  // Timeline month zoom tracker
  const [timelineSpan, setTimelineSpan] = useState("SEPTEMBER 12 - 18");

  // New reservation dialog inside booking
  const [showResModal, setShowResModal] = useState(false);
  const [resGuestName, setResGuestName] = useState("");
  const [resRoomType, setResRoomType] = useState("Presidential Suite");
  const [resNights, setResNights] = useState(3);
  const [resPrice, setResPrice] = useState(450);

  // Quick Action Toggles
  const handleCheckout = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    onUpdateRoom({
      ...room,
      status: "DIRTY",
      lastAction: "Guest checked-out. Room set to Dirty.",
    });
    alert(`Guest checked-out of Room ${roomId} successfully. Housekeeping required.`);
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resGuestName) return alert("Please specify guest name.");

    // Find first available room matching type
    const matchingRoom = rooms.find(
      (r) => r.type === resRoomType && r.status === "AVAILABLE"
    );

    if (matchingRoom) {
      onUpdateRoom({
        ...matchingRoom,
        status: "OCCUPIED",
        lastAction: `Assigned automatically: Checked-in ${resGuestName}`,
      });
    }

    const newBooking: Booking = {
      id: "bk-" + Math.floor(Math.random() * 10000),
      guestName: resGuestName,
      guestTier: "Normal Reservation",
      roomType: resRoomType,
      roomId: matchingRoom ? matchingRoom.id : undefined,
      startDate: "2026-06-13",
      endDate: "2026-06-16",
      nights: resNights,
      status: matchingRoom ? "In House" : "Reserved",
      rateCode: `$${resPrice}.00 / RAC`,
      pricePerNight: resPrice,
    };

    onAddBooking(newBooking);
    setShowResModal(false);
    setResGuestName("");
    alert(
      matchingRoom
        ? `Reservation created! Checked guest directly into Room ${matchingRoom.id}.`
        : `Reservation created as Reserved (Waiting on room assignment).`
    );
  };

  // KPIs
  const totalOccupied = rooms.filter((r) => r.status === "OCCUPIED").length;
  const occupancyPercentage = rooms.length > 0 ? ((totalOccupied / rooms.length) * 100).toFixed(1) : "0.0";
  const arrivalsRemaining = requests.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab Switcher on Booking View Header */}
      <div className="flex justify-between items-center bg-white border border-outline-variant/30 p-2 rounded-sm shadow-2xs">
        <div className="flex gap-2">
          <button
            onClick={() => setBookingTab("dashboard")}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-sm transition-all ${
              bookingTab === "dashboard"
                ? "bg-surface-charcoal text-white"
                : "text-gray-500 hover:text-gold-dark hover:bg-slate-50"
            }`}
          >
            Live Status Dashboard
          </button>
          <button
            onClick={() => setBookingTab("timeline")}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-sm transition-all ${
              bookingTab === "timeline"
                ? "bg-surface-charcoal text-white"
                : "text-gray-500 hover:text-gold-dark hover:bg-slate-50"
            }`}
          >
            Timeline Planner Calendar
          </button>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setShowResModal(true)}
            className="bg-primary-gold hover:bg-gold-dark text-white font-sans text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Reservation</span>
          </button>
        </div>
      </div>

      {bookingTab === "dashboard" ? (
        <>
          {/* KPI Dashboard Grid matching exactly layout elements in Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Occupancy Card */}
            <div className="bg-white border border-outline-variant/35 p-5 relative overflow-hidden rounded-sm hover:-translate-y-1 transition-all shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <span className="font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Occupancy
                </span>
                <span className="text-success-main shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-headline-sm md:text-headline-md font-bold text-on-surface">
                  {occupancyPercentage}%
                </span>
                <span className="text-success-main font-mono text-xs font-semibold">
                  +2.1% VS LM
                </span>
              </div>
              <div className="mt-4 h-1 w-full bg-[#f1f1f1] overflow-hidden rounded-full">
                <div 
                  className="h-full bg-gold-light transition-all" 
                  style={{ width: `${occupancyPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* RevPAR Card */}
            <div className="bg-white border border-outline-variant/35 p-5 rounded-sm hover:-translate-y-1 transition-all shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <span className="font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  RevPAR
                </span>
                <span className="text-primary-gold shrink-0">
                  <CreditCard className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-headline-sm md:text-headline-md font-bold text-on-surface">
                  $342.50
                </span>
                <span className="text-primary-gold font-mono text-xs font-bold leading-none">
                  vs $310 LY
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-gray-400 font-sans text-[11px]">
                <RefreshCw className="w-3.5 h-3.5 text-gold-light" />
                <span>Last updated 12m ago</span>
              </div>
            </div>

            {/* Arrivals Card */}
            <div className="bg-white border border-outline-variant/35 p-5 rounded-sm hover:-translate-y-1 transition-all shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <span className="font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Arrivals
                </span>
                <span className="text-info-main shrink-0">
                  <LogIn className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-headline-sm md:text-headline-md font-bold text-on-surface">
                  {bookings.filter((b) => b.status === "Arriving Soon" || b.status === "Reserved").length + 42}
                </span>
                <span className="text-gray-400 font-sans text-xs">
                  / {arrivalsRemaining} Remaining requests
                </span>
              </div>
              {/* Stacked Guest Avatars exactly matching specification */}
              <div className="mt-4 flex -space-x-1.5 items-center">
                <img
                  alt="Guest"
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf4r9i_A0_GAqxQejVYW5HK9Ba0tdoTRUqWG6p_gM5gYHwT5KQ1cvijInvGFhvlzsfWanXU250413UBCpVnUInv2_XbkkLLJCSEpUEIlt3tpNxaoHHmNG-jz0WOBLD64QwVt_MQyeFyt12DXD9kzcXIK9aa_BRM7yzBS4ZT2jr2n06_RVOaMRLw_Lx0bWLm--G9Jd1MPQuBIqsBdYNSQ9iEb68pw21Cv8M5avLf9L39SroBHUoX9DTTxS_hCQe-jNu4ZB7SfMoGQ"
                />
                <img
                  alt="Guest"
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkX7DGqmdA2AbcKpgXveFOdyOk6bruxbqicYvjY3K_TveIEwyu6DtL7cvNOEemA6f6PVZx9089b0qa2-O6AlK_7N3gqcL56HhWZ9WwpLoxHRoHny5xbW2L7mOnwLf5g_u4XM4v1FLV6l2_mBNnfZGeYb_oq0SD_Jj__KjeaWWKDoPCNqMAuU9GBMnbsP4vKGVktqAIPz1HfTcnV2j7Jv6XUXMGPVsBAL7rOBCNZNWotZU325A2Knjw7N94bVsrnkIr-SfA680IdQ"
                />
                <div className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-white flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0 font-mono">
                  +12
                </div>
              </div>
            </div>

            {/* Departures Card */}
            <div className="bg-white border border-outline-variant/35 p-5 rounded-sm hover:-translate-y-1 transition-all shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <span className="font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Departures
                </span>
                <span className="text-warning-main shrink-0">
                  <LogOut className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-headline-sm md:text-headline-md font-bold text-on-surface">
                  {bookings.filter((b) => b.status === "In House").length + 20}
                </span>
                <span className="text-warning-main font-sans text-xs font-semibold">
                  3 Late C/O Checkouts
                </span>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-600 font-sans">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                <span>Attention required for Room 402</span>
              </div>
            </div>
          </div>

          {/* Bento Grid Main Layout matching Image 2 */}
          <div className="grid grid-cols-12 gap-6">
            {/* Live Room Status (Left Large Panel) */}
            <div className="col-span-12 xl:col-span-8 bg-white border border-outline-variant/30 p-6 rounded-sm shadow-xs flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-headline-sm text-on-surface mb-1 font-bold">
                    Live Room Status
                  </h3>
                  <p className="font-sans text-xs text-outline font-medium">
                    Floor {currentFloor.slice(-2)}: Signature Suites &amp; Penthouses
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-surface-container-low rounded-sm hover:bg-surface-container-high transition-colors">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                  <select
                    className="bg-surface-container-low border-0 outline-none rounded py-1.5 px-4 font-sans text-xs uppercase font-bold tracking-wider text-slate-800"
                    value={currentFloor}
                    onChange={(e) => setCurrentFloor(e.target.value)}
                  >
                    <option value="Floor 01">Floor 01</option>
                    <option value="Floor 02">Floor 02</option>
                    <option value="Floor 03">Floor 03</option>
                    <option value="Floor 04">Floor 04</option>
                    <option value="Floor 05">Floor 05</option>
                  </select>
                </div>
              </div>

              {/* Mini Map Grid simulating 40 spaces matching specifications */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-3 bg-surface-container-low/30 border border-outline-variant/15 rounded-md min-h-[180px]">
                {rooms.map((room) => {
                  const numStr = parseInt(room.id) || 400;
                  const isFloorMatch = room.floor === currentFloor;

                  if (!isFloorMatch) return null;

                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        const newAction = room.status === "AVAILABLE" ? "OCCUPIED" : "AVAILABLE";
                        onUpdateRoom({
                          ...room,
                          status: newAction,
                          lastAction: `Status mapped via Live Status Grid to ${newAction.toLowerCase()}`,
                        });
                        alert(`Room ${room.id} mapped to ${newAction}.`);
                      }}
                      className={`aspect-square flex flex-col items-center justify-center border rounded cursor-pointer hover:scale-105 active:scale-95 transition-all p-1 text-center font-sans ${
                        room.status === "OCCUPIED"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                          : room.status === "DIRTY"
                          ? "bg-amber-100/40 text-amber-500 border-amber-300"
                          : room.status === "MAINTENANCE"
                          ? "bg-red-50 text-red-500 border-red-300 animate-pulse"
                          : "bg-white text-gray-300 border-slate-200"
                      }`}
                      title={`Room ${room.id} - Click to quickly toggle Occupancy`}
                    >
                      <span className="font-mono text-xs font-bold leading-none">{room.id}</span>
                      <span className="text-[7.5px] font-sans font-bold tracking-tighter opacity-70 mt-1 uppercase">
                        {room.status.substring(0, 5)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Color Legend under Mini Grid */}
              <div className="mt-6 flex flex-wrap gap-5 border-t border-outline-variant/20 pt-4 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-gray-600">Occupied ({totalOccupied})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
                  <span className="text-gray-600">Cleaning ({rooms.filter((r) => r.status === "DIRTY").length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0"></span>
                  <span className="text-gray-600">Vacant ({rooms.filter((r) => r.status === "AVAILABLE").length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 shrink-0"></span>
                  <span className="text-gray-600">Maintenance ({rooms.filter((r) => r.status === "MAINTENANCE").length})</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Right Panel Column - Bento Sidebar) */}
            <div className="col-span-12 xl:col-span-4 space-y-6">
              {/* Command Center Panel */}
              <div className="bg-surface-charcoal p-6 rounded-md shadow-lg text-white">
                <h3 className="font-serif text-headline-sm text-gold-light mb-4 font-bold tracking-wide">
                  Command Center
                </h3>
                <div className="grid grid-cols-2 gap-3 font-sans">
                  <button
                    onClick={() => setShowResModal(true)}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors uppercase cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 text-gold-light" />
                    <span className="text-[9px] font-bold tracking-wider text-gray-300">New Res</span>
                  </button>
                  <button
                    onClick={() => {
                      const guestName = prompt("Specify guest name to trigger Express Check-In:");
                      if (guestName) {
                        const avRoom = rooms.find((r) => r.status === "AVAILABLE");
                        if (!avRoom) return alert("No available standard rooms for express layout.");
                        
                        onUpdateRoom({
                          ...avRoom,
                          status: "OCCUPIED",
                          lastAction: "Express Check-In registered successfully",
                        });
                        alert(`Check-in registration completed for Room ${avRoom.id}!`);
                      }
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors uppercase cursor-pointer"
                  >
                    <Key className="w-5 h-5 text-gold-light" />
                    <span className="text-[9px] font-bold tracking-wider text-gray-300">Express C/I</span>
                  </button>
                  <button
                    onClick={() => alert("All guest room service requests verified. 0 outstanding alerts.")}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors uppercase cursor-pointer"
                  >
                    <BellRing className="w-5 h-5 text-gold-light" />
                    <span className="text-[9px] font-bold tracking-wider text-gray-300">Requests</span>
                  </button>
                  <button
                    onClick={() => alert("Folio audit completed. Ledger matching: 100% synchronized with global billing bank.")}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors uppercase cursor-pointer"
                  >
                    <Award className="w-5 h-5 text-gold-light" />
                    <span className="text-[9px] font-bold tracking-wider text-gray-300 font-sans">Folio Audit</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Feed matching Image 2 */}
              <div className="bg-white border border-outline-variant/30 flex flex-col h-[350px] shadow-2xs rounded-sm">
                <div className="p-4 border-b border-outline-variant/15 flex justify-between items-center bg-white">
                  <h3 className="font-serif text-sm font-bold text-on-surface uppercase tracking-wider">
                    Recent Activity Feed
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white font-sans">
                  {activities.map((item, idx) => {
                    return (
                      <div key={item.id} className="flex gap-4 relative">
                        {idx !== activities.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-[1px] bg-slate-100"></div>
                        )}
                        <div className="z-10 bg-gold-light/10 p-1.5 rounded-full self-start shrink-0">
                          {item.type === "checkin" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : item.type === "maintenance" ? (
                            <Info className="w-4 h-4 text-blue-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-800 leading-normal">
                            {item.message}
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">
                            {item.time} • {item.meta}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Arrivals Detail bottom list */}
          <div className="bg-white border border-outline-variant/30 overflow-hidden shadow-xs rounded-sm relative">
            <div className="p-6 border-b border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
              <h3 className="font-serif text-headline-sm font-bold">
                Today's Arrivals Detail
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search arrival..."
                  className="px-3 py-1 bg-white border border-outline-variant/30 text-xs rounded focus:ring-1 focus:ring-gold-light outline-none"
                  value={searchGuest}
                  onChange={(e) => setSearchGuest(e.target.value)}
                />
                <button
                  onClick={() => alert("CSV Export complete: Output written to downloads folder.")}
                  className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#807666] hover:text-gold-dark transition-colors px-2 py-1 border border-outline-variant rounded-sm"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f2f4f6]/50 border-b border-outline-variant/20 font-sans text-[11px] font-bold text-outline">
                  <tr>
                    <th className="px-6 py-4 uppercase tracking-wider">Guest Name</th>
                    <th className="px-6 py-4 uppercase tracking-wider">Room Type</th>
                    <th className="px-6 py-4 uppercase tracking-wider">Stay Dates</th>
                    <th className="px-6 py-4 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 uppercase tracking-wider">Rate Code</th>
                    <th className="px-6 py-4 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 font-sans text-xs">
                  {bookings
                    .filter((b) => b.guestName.toLowerCase().includes(searchGuest.toLowerCase()))
                    .map((booking) => {
                      return (
                        <tr
                          key={booking.id}
                          className="hover:bg-[#f8fafc]/50 transition-colors group"
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold font-bold font-serif">
                              {booking.guestName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface">{booking.guestName}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{booking.guestTier}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-6 bg-gold-light rounded-full"></span>
                              <span className="font-semibold text-gray-800">{booking.roomType}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-[11px] text-gray-600">
                            {booking.startDate} - {booking.endDate} ({booking.nights}n)
                          </td>
                          <td className="px-6 py-4">
                            <span
                              onClick={() => {
                                // Cycle check-in statuses on click
                                const statusOrders: Booking["status"][] = ["Reserved", "Arriving Soon", "In House"];
                                const curIdx = statusOrders.indexOf(booking.status);
                                const nextStat = statusOrders[(curIdx + 1) % statusOrders.length];
                                booking.status = nextStat;
                                onAddBooking({ ...booking }); // triggers state update bypass
                              }}
                              className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-full cursor-pointer hover:opacity-80 transition-all ${
                                booking.status === "In House"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : booking.status === "Arriving Soon"
                                  ? "bg-amber-50 text-amber-500"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-primary-gold font-semibold">
                            {booking.rateCode}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {booking.status === "In House" && booking.roomId && (
                                <button
                                  onClick={() => handleCheckout(booking.roomId!)}
                                  className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded hover:bg-red-100 font-bold uppercase tracking-wider text-[9px]"
                                >
                                  Checkout
                                </button>
                              )}
                              {!booking.roomId && (
                                <button
                                  onClick={() => {
                                    const roomToAssign = prompt(
                                      `Type Room number to check-in ${booking.guestName} (${booking.roomType}):`
                                    );
                                    if (roomToAssign) {
                                      const matchedR = rooms.find((r) => r.id === roomToAssign);
                                      if (!matchedR) return alert("Specified room code is invalid.");
                                      onUpdateRoom({
                                        ...matchedR,
                                        status: "OCCUPIED",
                                        lastAction: `Assigned automatically: Checked-in ${booking.guestName}`,
                                      });
                                      booking.roomId = roomToAssign;
                                      booking.status = "In House";
                                      onAddBooking({ ...booking });
                                      alert("Room assigned successfully!");
                                    }
                                  }}
                                  className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100 font-bold uppercase tracking-wider text-[9px]"
                                >
                                  Assign Room
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Timeline View Planner matching Image 3 */
        <section className="flex flex-col bg-white border border-outline-variant/30 rounded-sm overflow-hidden relative">
          {/* Timeline Header Days of Month */}
          <div className="grid grid-cols-8 border-b border-surface-container-high bg-slate-50/70 sticky top-0 z-10 font-sans text-xs">
            <div className="p-4 flex items-center justify-between border-r border-[#eceef0]">
              <span className="font-sans text-[10px] font-bold text-outline uppercase tracking-wider">
                Room No / Type
              </span>
            </div>
            
            {/* Days columns headers */}
            {[
              { label: "MON", num: "12" },
              { label: "TUE", num: "13 (TODAY)" },
              { label: "WED", num: "14" },
              { label: "THU", num: "15" },
              { label: "FRI", num: "16" },
              { label: "SAT", num: "17" },
              { label: "SUN", num: "18" },
            ].map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center py-3.5 border-r border-[#eceef0] ${
                  day.label === "TUE" ? "bg-amber-50/40 relative font-bold" : ""
                }`}
              >
                <span className={`text-[9px] font-bold uppercase tracking-widest ${day.label === "TUE" ? "text-primary-gold" : "text-gray-400 opacity-70"}`}>
                  {day.label}
                </span>
                <span className={`text-headline-sm font-serif font-bold mt-1 ${day.label === "TUE" ? "text-primary-gold" : "text-slate-800"}`}>
                  {day.num.split(" ")[0]}
                </span>
                {day.label === "TUE" && (
                  <div className="w-1.5 h-1.5 bg-primary-gold rounded-full mt-1"></div>
                )}
              </div>
            ))}
          </div>

          {/* Timeline Rows with styled bars */}
          <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar bg-white divide-y divide-[#eceef0]">
            {/* Row 1: 402 Deluxe Suite */}
            <div className="grid grid-cols-8 min-h-[90px] items-center relative group">
              <div className="p-4 border-r border-[#eceef0] bg-white flex flex-col justify-center shrink-0">
                <span className="font-mono text-sm font-semibold text-primary-gold leading-none">402</span>
                <span className="font-sans text-[11px] text-outline mt-1 font-medium">Deluxe Suite</span>
              </div>
              <div className="col-span-7 col-start-2 relative h-full grid grid-cols-7 items-center border-r border-[#eceef0]">
                {/* Horizontal Booking Blocks styled beautifully */}
                <div 
                  onClick={() => alert("Booking Details:\nGuest: MR. JULIAN STERLING\nStatus: CONFIRMED\nStay: Sep 12 - Sep 14")}
                  className="absolute left-0 h-10 bg-gold-light hover:bg-gold-dark text-white rounded-r-md shadow-xs flex items-center px-4 z-10 cursor-pointer transition-all hover:scale-[1.01]" 
                  style={{ width: "42.8%" }}
                >
                  <span className="font-sans font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
                    MR. JULIAN STERLING — CONFIRMED
                  </span>
                </div>

                <div 
                  onClick={() => alert("Maintenance block: HVAC venting evaluation & standard replacement.")}
                  className="absolute left-[57.1%] h-10 bg-rose-50 text-rose-600 border border-rose-200 rounded-sm shadow-2xs flex items-center px-4 z-10 cursor-pointer transition-all" 
                  style={{ width: "28.5%" }}
                >
                  <span className="font-sans font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
                    MAINTENANCE REQUIRED
                  </span>
                </div>

                {/* Sub-grid lines background */}
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="border-r border-[#eceef0]/65 h-full opacity-60"></div>
                ))}
              </div>
            </div>

            {/* Row 2: PH-01 Presidential Suite */}
            <div className="grid grid-cols-8 min-h-[90px] items-center relative group">
              <div className="p-4 border-r border-[#eceef0] bg-white flex flex-col justify-center">
                <span className="font-mono text-sm font-semibold text-primary-gold">PH-01</span>
                <span className="font-sans text-[11px] text-outline mt-1 font-medium">Presidential</span>
              </div>
              <div className="col-span-7 col-start-2 relative h-full grid grid-cols-7 items-center border-r border-[#eceef0]">
                <div 
                  onClick={() => alert("Booking Details:\nGuest: HER EXCELLENCY AMIRA AL-SAUD\nStatus: VIP AUTHORIZED\nStay: Sep 13 - Sep 18")}
                  className="absolute left-[14.2%] h-10 bg-yellow-600 text-white rounded-md shadow-sm flex items-center px-4 z-10 cursor-pointer transition-all hover:scale-[1.01]" 
                  style={{ width: "71.4%" }}
                >
                  <span className="font-sans font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
                    HER EXCELLENCY AMIRA AL-SAUD — VIP PRE-AUTH
                  </span>
                </div>

                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="border-r border-[#eceef0]/65 h-full opacity-60"></div>
                ))}
              </div>
            </div>

            {/* Row 3: 208 Standard King */}
            <div className="grid grid-cols-8 min-h-[90px] items-center relative group">
              <div className="p-4 border-r border-[#eceef0] bg-white flex flex-col justify-center">
                <span className="font-mono text-sm font-semibold text-primary-gold">208</span>
                <span className="font-sans text-[11px] text-outline mt-1 font-medium">Standard King</span>
              </div>
              <div className="col-span-7 col-start-2 relative h-full grid grid-cols-7 items-center border-r border-[#eceef0]">
                <div 
                  onClick={() => alert("Booking Details:\nGuest: ELIZA BENNETT\nStatus: PENDING RESERVATION")}
                  className="absolute left-[42.8%] h-10 bg-surface-charcoal text-slate-200 border border-slate-700 rounded-sm shadow-xs flex items-center px-4 z-10 cursor-pointer transition-all" 
                  style={{ width: "28.5%" }}
                >
                  <span className="font-sans font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
                    PENDING: ELIZA BENNETT
                  </span>
                </div>

                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="border-r border-[#eceef0]/65 h-full opacity-60"></div>
                ))}
              </div>
            </div>

            {/* Row 4: 315 Executive Loft */}
            <div className="grid grid-cols-8 min-h-[90px] items-center relative group">
              <div className="p-4 border-r border-[#eceef0] bg-white flex flex-col justify-center text-left">
                <span className="font-mono text-sm font-semibold text-primary-gold">315</span>
                <span className="font-sans text-[11px] text-outline mt-1 font-medium">Executive Loft</span>
              </div>
              <div className="col-span-7 col-start-2 relative h-full grid grid-cols-7 items-center border-r border-[#eceef0]">
                <div 
                  className="absolute left-0 h-10 bg-gold-light/85 text-white rounded-r-md shadow-2xs flex items-center px-4 z-10" 
                  style={{ width: "28.5%" }}
                >
                  <span className="font-sans font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
                    DR. MARCUS VANCE
                  </span>
                </div>
                <div 
                  className="absolute left-[71.4%] h-10 bg-gold-light/80 text-white rounded-l-md shadow-2xs flex items-center px-4 z-10" 
                  style={{ width: "28.5%" }}
                >
                  <span className="font-sans font-bold text-[9px] uppercase tracking-wider whitespace-nowrap">
                    SARAH CONNOR
                  </span>
                </div>

                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="border-r border-[#eceef0]/65 h-full opacity-60"></div>
                ))}
              </div>
            </div>

            {/* Row 5: 405 Deluxe King */}
            <div className="grid grid-cols-8 min-h-[90px] items-center relative group">
              <div className="p-4 border-r border-[#eceef0] bg-white flex flex-col justify-center">
                <span className="font-mono text-sm font-semibold text-primary-gold">405</span>
                <span className="font-sans text-[11px] text-outline mt-1 font-medium">Deluxe King</span>
              </div>
              <div className="col-span-7 col-start-2 relative h-full grid grid-cols-7 items-center border-r border-[#eceef0]">
                <div 
                  onClick={() => alert("Booking Details:\nGuest: TECH SUMMIT GROUP\nStatus: BLOCKED GROUP ALLOCATION")}
                  className="absolute left-[28.5%] h-10 bg-[#e2e8f0] text-[#1e293b] border border-[#cbd5e1] rounded shadow-2xs flex items-center px-4 z-10 cursor-pointer" 
                  style={{ width: "42.8%" }}
                >
                  <span className="font-sans font-bold text-[9.5px] uppercase tracking-wider whitespace-nowrap font-sans">
                    PENDING: TECH SUMMIT GROUP (x4)
                  </span>
                </div>

                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="border-r border-[#eceef0]/65 h-full opacity-60"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Controls for Calendar View Planner */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-outline-variant/30 text-xs font-sans">
            <span className="text-gray-400 italic">Timeline Grid generated for Floor 4 Rooms listing</span>
            <div className="flex items-center space-x-2 bg-white border border-outline-variant px-4 py-2 rounded-full shadow-md">
              <button 
                onClick={() => setTimelineSpan("AUGUST 29 - SEPTEMBER 04")}
                className="p-1 text-gray-500 hover:text-gold-dark transition-colors"
                title="Zoom Out Range"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-slate-200 mx-2"></div>
              <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-slate-800 px-2 select-none">
                {timelineSpan}
              </span>
              <div className="h-4 w-px bg-slate-200 mx-2"></div>
              <button 
                onClick={() => setTimelineSpan("SEPTEMBER 12 - 18")}
                className="p-1 text-gray-500 hover:text-gold-dark transition-colors"
                title="Zoom In Range"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => alert("Calendar shifts previous week range Sep 05 - 11.")}
                className="p-1 px-3 border rounded text-xs hover:bg-slate-50 flex items-center gap-1 font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Week</span>
              </button>
              <button 
                onClick={() => alert("Calendar shifts following week range Sep 19 - 25.")}
                className="p-1 px-3 border rounded text-xs hover:bg-slate-50 flex items-center gap-1 font-bold"
              >
                <span>Next Week</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Guest Check-In & New Booking Dialog Modal popup */}
      {showResModal && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-outline-variant max-w-md w-full rounded-sm p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between border-b pb-2">
              <h4 className="font-serif text-headline-sm font-bold text-gold-dark">
                New Reservation Setup
              </h4>
              <button onClick={() => setShowResModal(false)} className="text-gray-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4 text-xs text-gray-800 font-sans">
              <div className="flex flex-col">
                <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Guest Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alistair Masterson"
                  className="p-2 border rounded-sm focus:ring-1 focus:ring-gold-light outline-none text-sm"
                  value={resGuestName}
                  onChange={(e) => setResGuestName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Preferred Room Type</label>
                <select
                  className="p-2 border rounded-sm outline-none text-sm bg-white"
                  value={resRoomType}
                  onChange={(e) => setResRoomType(e.target.value)}
                >
                  <option value="Presidential Suite">Presidential Suite (Suite 302)</option>
                  <option value="Deluxe King">Deluxe King (Suite 104 / 405)</option>
                  <option value="Deluxe Queen">Deluxe Queen (Suite 112)</option>
                  <option value="Standard Double">Standard Double (Suite 215)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Nights Count</label>
                  <input
                    type="number"
                    min="1"
                    className="p-2 border rounded-sm focus:ring-1 focus:ring-gold-light outline-none text-sm font-mono"
                    value={resNights}
                    onChange={(e) => setResNights(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Price Per Night (USD)</label>
                  <input
                    type="number"
                    min="100"
                    className="p-2 border rounded-sm focus:ring-1 focus:ring-gold-light outline-none text-sm font-mono"
                    value={resPrice}
                    onChange={(e) => setResPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-400 leading-normal">
                Creating reservation auto-searches available matching rooms inside current floor layouts. If available, room statuses check-in immediately.
              </p>

              <div className="pt-4 flex gap-3 justify-end text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setShowResModal(false)}
                  className="px-4 py-2 border rounded-sm hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-light hover:bg-gold-dark text-white rounded-sm cursor-pointer"
                >
                  Confirm Stay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
