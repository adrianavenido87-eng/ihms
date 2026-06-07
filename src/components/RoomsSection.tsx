/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Filter, Plus, Edit, RotateCw, Check, X, ShieldAlert, BadgeInfo, Play, ArrowUpDown, Trash2 } from "lucide-react";
import { Room, Staff } from "../types";

interface RoomsSectionProps {
  rooms: Room[];
  staff: Staff[];
  onUpdateRoom: (updated: Room) => void;
  onAddRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
}

export default function RoomsSection({ rooms, staff, onUpdateRoom, onAddRoom, onDeleteRoom }: RoomsSectionProps) {
  const [filterTab, setFilterTab] = useState<"all" | "occupied" | "dirty">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<"id" | "rate">("id");
  const [sortAsc, setSortAsc] = useState(true);

  // Form states for adding a room
  const [newRoomId, setNewRoomId] = useState("");
  const [newRoomType, setNewRoomType] = useState("Presidential Suite");
  const [newRoomFloor, setNewRoomFloor] = useState("Floor 03");
  const [newRoomStatus, setNewRoomStatus] = useState<Room["status"]>("AVAILABLE");
  const [newRoomRate, setNewRoomRate] = useState(450);

  // Edit fields temp
  const [editType, setEditType] = useState("");
  const [editStatus, setEditStatus] = useState<Room["status"]>("AVAILABLE");
  const [editRate, setEditRate] = useState(450);
  const [editStaff, setEditStaff] = useState("");

  // Handler functions
  const handleAddNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomId) return alert("Please specify a valid Room Number.");
    if (rooms.some((r) => r.id === newRoomId)) return alert("Room number already exists.");

    const newRoom: Room = {
      id: newRoomId,
      type: newRoomType,
      floor: newRoomFloor,
      status: newRoomStatus,
      rate: Number(newRoomRate) || 350,
      lastAction: "Just Added",
    };
    onAddRoom(newRoom);
    setShowAddModal(false);
    setNewRoomId("");
  };

  const handleStartEditing = (room: Room) => {
    setEditingRoomId(room.id);
    setEditType(room.type);
    setEditStatus(room.status);
    setEditRate(room.rate);
    setEditStaff(room.assignedStaffId || "");
  };

  const handleSaveEdit = (roomId: string) => {
    const original = rooms.find((r) => r.id === roomId);
    if (!original) return;

    const updated: Room = {
      ...original,
      type: editType,
      status: editStatus,
      rate: editRate,
      assignedStaffId: editStaff || undefined,
      lastAction: `Updated: status changed to ${editStatus.toLowerCase()}`,
    };
    onUpdateRoom(updated);
    setEditingRoomId(null);
  };

  const handlePrioritizeHousekeeping = () => {
    // Instantly assign Elena Ross or Marcus to all DIRTY rooms
    rooms.forEach((r) => {
      if (r.status === "DIRTY") {
        onUpdateRoom({
          ...r,
          assignedStaffId: "st-1", // Elena Ross
          lastAction: "Prioritized Housekeeping assigned",
        });
      }
    });
    alert("Housekeeping assignments prioritized! Elena Ross has been assigned to clear all dirty items.");
  };

  // Calculations
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
  const dirtyRooms = rooms.filter((r) => r.status === "DIRTY").length;
  const maintenanceRooms = rooms.filter((r) => r.status === "MAINTENANCE").length;

  const capacityPercentage = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : "0.0";

  // Filtered rooms
  const filteredRooms = rooms
    .filter((room) => {
      if (filterTab === "occupied" && room.status !== "OCCUPIED") return false;
      if (filterTab === "dirty" && room.status !== "DIRTY") return false;
      
      if (searchQuery) {
        return (
          room.id.includes(searchQuery) ||
          room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.floor.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === "id") {
        const numA = parseInt(a.id) || 0;
        const numB = parseInt(b.id) || 0;
        return sortAsc ? numA - numB : numB - numA;
      } else {
        return sortAsc ? a.rate - b.rate : b.rate - a.rate;
      }
    });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <nav className="flex gap-2 text-[10px] font-bold tracking-widest text-outline uppercase mb-2">
            <span>Management</span>
            <span>/</span>
            <span className="text-gold-dark">Room Inventory</span>
          </nav>
          <h3 className="font-serif text-headline-sm md:text-headline-lg text-on-surface">
            Room Inventory &amp; Status
          </h3>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setSearchQuery(searchQuery ? "" : "Suite")} 
            className="px-5 py-2.5 border border-outline-variant hover:border-gold-light hover:text-gold-dark text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 bg-white rounded-xs"
          >
            <Filter className="w-4 h-4 text-gold-light" />
            <span>{searchQuery ? "Clear Filters" : "Filters"}</span>
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-surface-charcoal text-white hover:bg-gold-dark text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 rounded-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gold-light" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Dashboard Quick Stats matching exact screenshot specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Rooms Card */}
        <div className="bg-white border border-outline-variant/35 p-5 flex flex-col justify-between rounded-sm shadow-2xs hover:shadow-xs transition-shadow">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-outline">
            Total Rooms
          </p>
          <div className="flex items-end justify-between mt-3">
            <span className="font-serif text-headline-lg font-bold leading-none">
              {totalRooms}
            </span>
            <span className="text-success-main text-xs font-bold font-sans">
              +2 New Wing
            </span>
          </div>
        </div>

        {/* Available Card */}
        <div className="bg-white border border-outline-variant/35 p-5 flex flex-col justify-between rounded-sm shadow-2xs hover:shadow-xs transition-shadow">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-outline">
            Available
          </p>
          <div className="flex items-end justify-between mt-3">
            <span className="font-serif text-headline-lg font-bold leading-none text-gold-dark">
              {availableRooms}
            </span>
            <span className="text-outline text-xs font-sans font-medium">
              {capacityPercentage}% Occupied
            </span>
          </div>
        </div>

        {/* Maintenance Card */}
        <div className="bg-white border border-outline-variant/35 p-5 flex flex-col justify-between rounded-sm shadow-2xs hover:shadow-xs transition-shadow">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-outline">
            Maintenance
          </p>
          <div className="flex items-end justify-between mt-3">
            <span className="font-serif text-headline-lg font-bold leading-none text-error-main">
              {maintenanceRooms}
            </span>
            <span className="text-error-main text-xs font-bold font-sans">
              Urgent: {rooms.filter((r) => r.status === "MAINTENANCE" && r.type.includes("Suite")).length + 1}
            </span>
          </div>
        </div>

        {/* Turnover Rate Card */}
        <div className="bg-white border border-outline-variant/35 p-5 flex flex-col justify-between rounded-sm shadow-2xs hover:shadow-xs transition-shadow">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-outline">
            Turnover Rate
          </p>
          <div className="flex items-end justify-between mt-3">
            <span className="font-serif text-headline-lg font-bold leading-none">
              42m
            </span>
            <span className="text-success-main text-xs font-bold font-sans">
              &darr; 4m vs Avg
            </span>
          </div>
        </div>
      </div>

      {/* Room Table / Directory Area */}
      <div className="bg-white border border-outline-variant/50 rounded-sm overflow-hidden shadow-xs">
        {/* Table Filter Tabs and View Triggers */}
        <div className="px-6 py-4 bg-surface-container-low/75 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-6">
            <button
              onClick={() => setFilterTab("all")}
              className={`font-sans text-xs uppercase tracking-wider font-bold pb-1.5 transition-all text-left ${
                filterTab === "all"
                  ? "text-gold-dark border-b-2 border-gold-dark font-extrabold"
                  : "text-[#807666]/70 hover:text-on-surface"
              }`}
            >
              All Rooms ({totalRooms})
            </button>
            <button
              onClick={() => setFilterTab("occupied")}
              className={`font-sans text-xs uppercase tracking-wider font-bold pb-1.5 transition-all text-left ${
                filterTab === "occupied"
                  ? "text-gold-dark border-b-2 border-gold-dark font-extrabold"
                  : "text-[#807666]/70 hover:text-on-surface"
              }`}
            >
              Occupied ({occupiedRooms})
            </button>
            <button
              onClick={() => setFilterTab("dirty")}
              className={`font-sans text-xs uppercase tracking-wider font-bold pb-1.5 transition-all text-left relative ${
                filterTab === "dirty"
                  ? "text-gold-dark border-b-2 border-gold-dark font-extrabold"
                  : "text-[#807666]/70 hover:text-on-surface"
              }`}
            >
              Dirty ({dirtyRooms})
              {dirtyRooms > 0 && (
                <span className="absolute -top-1.5 -right-3.5 bg-amber-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {dirtyRooms}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Embedded Search In-Filters */}
            <input
              type="text"
              placeholder="Filter by Room #..."
              className="px-3 py-1 bg-white border border-outline-variant/30 rounded text-xs focus:ring-1 focus:ring-gold-light outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => {
                setSortField(sortField === "id" ? "rate" : "id");
                setSortAsc(!sortAsc);
              }}
              title="Sort Table"
              className="p-1 px-2 border border-outline-variant/35 rounded hover:bg-surface text-gray-500 hover:text-gold-dark transition-colors flex items-center gap-1 text-[11px] font-sans"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: {sortField.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Responsive Table Grid */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/35 border-b border-outline-variant/20">
                <th className="px-6 py-4 font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Room #
                </th>
                <th className="px-6 py-4 font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-4 font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Assigned Staff
                </th>
                <th className="px-6 py-4 font-sans text-[11px] font-bold text-outline uppercase tracking-wider">
                  Last Action
                </th>
                <th className="px-6 py-4 font-sans text-[11px] font-bold text-outline uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 font-sans">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-xs italic">
                    No room codes matched current queries &amp; filters.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => {
                  const isEditing = editingRoomId === room.id;
                  const roomStaff = staff.find((s) => s.id === room.assignedStaffId);

                  return (
                    <tr
                      key={room.id}
                      className="hover:bg-surface-container-low/40 transition-all border-l-2 border-transparent hover:border-gold-light group"
                    >
                      {/* Room Num */}
                      <td className="px-6 py-4 font-mono text-sm text-gold-dark font-semibold">
                        {room.id}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white border border-outline text-xs px-2 py-1 rounded focus:ring-1 focus:ring-gold-light"
                            value={editType}
                            onChange={(e) => setEditType(e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-gold-light rounded-sm"></div>
                            <span className="font-semibold text-xs text-gray-800">
                              {room.type}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Floor */}
                      <td className="px-6 py-4 text-xs text-outline font-medium">
                        {room.floor}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select
                            className="bg-white border border-outline text-xs px-2 py-1 rounded"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as Room["status"])}
                          >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="OCCUPIED">OCCUPIED</option>
                            <option value="DIRTY">DIRTY</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                          </select>
                        ) : (
                          <span
                            onClick={() => {
                              // Direct state cycle on pill click
                              const nextStatusMap: Record<Room["status"], Room["status"]> = {
                                AVAILABLE: "OCCUPIED",
                                OCCUPIED: "DIRTY",
                                DIRTY: "MAINTENANCE",
                                MAINTENANCE: "AVAILABLE",
                              };
                              onUpdateRoom({
                                ...room,
                                status: nextStatusMap[room.status],
                                lastAction: `Status toggled manually to ${nextStatusMap[room.status].toLowerCase()}`,
                              });
                            }}
                            title="Click to cycle status"
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm cursor-pointer select-none transition-all ${
                              room.status === "AVAILABLE"
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : room.status === "OCCUPIED"
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : room.status === "DIRTY"
                                ? "bg-amber-50 text-amber-500 hover:bg-amber-100"
                                : "bg-red-50 text-red-500 hover:bg-red-100"
                            }`}
                          >
                            {room.status}
                          </span>
                        )}
                      </td>

                      {/* Staff */}
                      <td className="px-6 py-4 text-xs font-sans">
                        {isEditing ? (
                          <select
                            className="bg-white border border-outline text-xs px-2 py-1 rounded"
                            value={editStaff}
                            onChange={(e) => setEditStaff(e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {staff.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        ) : roomStaff ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={roomStaff.avatar}
                              alt={roomStaff.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0 filter grayscale hover:grayscale-0 transition-opacity opacity-85"
                            />
                            <span className="text-gray-700 font-medium">{roomStaff.name}</span>
                          </div>
                        ) : (
                          <span className="italic text-gray-400 font-normal">Unassigned</span>
                        )}
                      </td>

                      {/* Last Action */}
                      <td className="px-6 py-4 text-xs text-outline truncate max-w-[150px]">
                        {room.lastAction}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 text-outline">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(room.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingRoomId(null)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEditing(room)}
                                className="p-1 hover:text-gold-dark hover:bg-surface-container rounded transition-colors"
                                title="Edit Room"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  // Instantly rotate statuses
                                  const orders: Room["status"][] = ["AVAILABLE", "OCCUPIED", "DIRTY", "MAINTENANCE"];
                                  const curIdx = orders.indexOf(room.status);
                                  const nextStatus = orders[(curIdx + 1) % orders.length];
                                  onUpdateRoom({
                                    ...room,
                                    status: nextStatus,
                                    lastAction: `Rotated to ${nextStatus.toLowerCase()}`,
                                  });
                                }}
                                className="p-1 hover:text-gold-dark hover:bg-surface-container rounded transition-colors"
                                title="Instantly Swap Status"
                              >
                                <RotateCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remove room ${room.id} from inventory?`)) {
                                    onDeleteRoom(room.id);
                                  }
                                }}
                                className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Room"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination summary */}
        <div className="px-6 py-4 border-t border-outline-variant/30 flex justify-between items-center text-xs font-sans text-outline">
          <p>
            Showing <strong className="text-on-surface">{filteredRooms.length}</strong> of{" "}
            <strong className="text-on-surface">{rooms.length}</strong> rooms matched
          </p>
          <div className="flex gap-1.5 font-bold">
            <button className="px-3 py-1 border border-outline-variant text-[10px] uppercase font-bold text-gray-400 rounded-sm hover:bg-surface-container disabled:opacity-30" disabled>
              Prev
            </button>
            <button className="px-3 py-1 bg-gold-light text-white text-[10px] rounded-sm">1</button>
            <button className="px-3 py-1 border border-outline-variant rounded-sm text-[10px] hover:border-gold-light transition-colors text-gray-500">2</button>
            <button className="px-3 py-1 border border-outline-variant rounded-sm text-[10px] hover:border-gold-light transition-colors text-gray-500">→</button>
          </div>
        </div>
      </div>

      {/* Contextual Insights / Bottom Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Double-Col Widget: Automated Priority Optimization */}
        <div className="lg:col-span-2 bg-surface-charcoal p-8 rounded-sm relative text-white overflow-hidden shadow-md flex flex-col justify-between min-h-[220px]">
          {/* Subtle background icon styling matching screenshots */}
          <div className="absolute right-0 bottom-0 opacity-10 leading-none mr-[-50px] mb-[-40px]">
            <BadgeInfo className="w-72 h-72 text-white" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-gold-light font-bold text-xs uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4" />
              <span>Smart Optimizations</span>
            </div>
            <h4 className="font-serif text-headline-sm md:text-headline-md font-bold tracking-wide leading-snug">
              Automated Inventory Optimization
            </h4>
            <p className="text-gray-300 font-sans text-xs md:text-sm max-w-lg leading-relaxed">
              The system identified <strong className="text-gold-light">{dirtyRooms} dirty</strong> rooms. Consistent standard guest check-ins are due within the coming 60 minutes. Apply automated prioritizing to quick-start assignments.
            </p>
          </div>

          <button
            onClick={handlePrioritizeHousekeeping}
            className="mt-6 relative z-10 bg-gold-light hover:bg-gold-dark text-slate-900 font-sans text-[11px] font-bold uppercase tracking-widest py-3 px-6 rounded-2xs cursor-pointer transition-all self-start"
          >
            Prioritize Housekeeping
          </button>
        </div>

        {/* Right Single-Col Widget: Health Bars */}
        <div className="bg-white border border-outline-variant/35 p-6 rounded-sm shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-sans text-[11px] font-bold text-gold-dark uppercase tracking-widest mb-5">
              Inventory Health
            </h4>
            
            <div className="space-y-5">
              {/* Suite progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold font-sans mb-1.5 text-gray-700">
                  <span className="uppercase tracking-wider">Suite Category</span>
                  <span>{capacityPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-gold-light transition-all duration-500" 
                    style={{ width: `${Math.min(100, Number(capacityPercentage))}%` }}
                  ></div>
                </div>
              </div>

              {/* Deluxe category progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold font-sans mb-1.5 text-gray-700">
                  <span className="uppercase tracking-wider">Deluxe Rooms</span>
                  <span>45%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 overflow-hidden rounded-full">
                  <div className="h-full bg-gold-light w-[45%]"></div>
                </div>
              </div>

              {/* Standard category progress bar */}
              <div>
                <div className="flex justify-between text-xs font-bold font-sans mb-1.5 text-gray-700">
                  <span className="uppercase tracking-wider">Standard Rooms</span>
                  <span>94%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 overflow-hidden rounded-full">
                  <div className="h-full bg-gold-light w-[94%] border-r border-white"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert("Supply Audit Report generated: Sheets saved to cloud drive.")}
            className="w-full mt-8 py-3 border border-outline-variant text-[#807666] font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors uppercase cursor-pointer"
          >
            Generate Supply Report
          </button>
        </div>
      </div>

      {/* Add New Room Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-outline-variant max-w-md w-full rounded-sm p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex justify-between border-b pb-2">
              <h4 className="font-serif text-headline-sm font-bold text-gold-dark">
                Add Room To Inventory
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddNewRoom} className="space-y-4 text-xs text-gray-800">
              <div className="flex flex-col">
                <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 504"
                  className="p-2 border rounded-sm focus:ring-1 focus:ring-gold-light outline-none text-sm font-mono"
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Room Type</label>
                <select
                  className="p-2 border rounded-sm outline-none text-sm"
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                >
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Deluxe King">Deluxe King</option>
                  <option value="Deluxe Queen">Deluxe Queen</option>
                  <option value="Standard Double">Standard Double</option>
                  <option value="Standard King">Standard King</option>
                  <option value="Executive Studio">Executive Studio</option>
                  <option value="Executive Loft">Executive Loft</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Floor Layout</label>
                <select
                  className="p-2 border rounded-sm outline-none text-sm"
                  value={newRoomFloor}
                  onChange={(e) => setNewRoomFloor(e.target.value)}
                >
                  <option value="Floor 01">Floor 01</option>
                  <option value="Floor 02">Floor 02</option>
                  <option value="Floor 03">Floor 03</option>
                  <option value="Floor 04">Floor 04</option>
                  <option value="Floor 05">Floor 05</option>
                  <option value="Floor 06">Floor 06</option>
                  <option value="Floor 08">Floor 08</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Nightly Rate (USD)</label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  className="p-2 border rounded-sm focus:ring-1 focus:ring-gold-light outline-none text-sm font-mono"
                  value={newRoomRate}
                  onChange={(e) => setNewRoomRate(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-col">
                <label className="font-bold mb-1 uppercase tracking-wider text-gray-500">Initial Status</label>
                <select
                  className="p-2 border rounded-sm outline-none text-sm"
                  value={newRoomStatus}
                  onChange={(e) => setNewRoomStatus(e.target.value as Room["status"])}
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="DIRTY">DIRTY</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-light hover:bg-gold-dark text-white rounded-sm cursor-pointer"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
