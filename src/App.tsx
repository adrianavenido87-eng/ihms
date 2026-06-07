/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import RoomsSection from "./components/RoomsSection";
import BookingSection from "./components/BookingSection";
import GuestsSection from "./components/GuestsSection";
import ReportsSection from "./components/ReportsSection";
import AnalyticsSection from "./components/AnalyticsSection";

import { Room, Staff, Guest, Booking, BookingRequest, ActivityLog } from "./types";
import {
  initialStaffList,
  initialRooms,
  initialGuests,
  initialBookings,
  initialRequests,
  initialActivities,
} from "./data";

export default function App() {
  // Views navigation switcher
  const [activeSection, setActiveSection] = useState<
    "rooms" | "booking" | "guests" | "reports" | "analytics"
  >("rooms");

  // Administrators profiles to cycle through
  const adminProfiles = [
    {
      name: "Alex Thorne",
      role: "Executive Manager",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC43zT8nRSzVeqhKBGGldRD1GC3q9dijCq2QxfA8dtvk6kH5sjwM4d6Luyj_gwr8rRZ3iIJu9fn-gCZbFGHD_sSZiaLYEHxKcjUvIhGyQ8zOVlt1hfFUBQvyUZGYPbqqiYuUWWKDg5Z8k_3s5TYhX6ovx5d030zaXHjMBwUPfifXcziFrOikxKoaL6F399DenUYK9O1PEcVLI4ZYkB1ONgJVBG9URwjIYlhErl62o57TBx_YU4HTjjYT92DBelxqnku56rmD-j1aA",
    },
    {
      name: "E. Alexander",
      role: "Administrator",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDfBuxDrlzJKnEK7ecPV_VD277SNyneVTXY0ploL7wAreIdBf2r6QHfnJYiT69HoMEQdW28lke18Iy_fLqhUmchfVcyQ4KRB6FlPpZdTObLKi5K2JLPVqzoivG4fout-iM5jAjSW8cxlYLOuY6sHCWZ5BB0rTMGTSw-xdOJ_lvBv4Bee0F9_5KJ0kNWKt5W2-Vs_Vq3O9Ul84D7UeOEi4uprR9kQTFKo1jGgzu7z2Vd9b2icT-zzAQtR2lpyEjAr4vXEIA3gh6QSQ",
    },
    {
      name: "Julianna V.",
      role: "Executive Manager",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfceTahpn5FZY0yvIqyqbKrMlW5hMl6BDtWZYiq4E2sCzLTWH3OSS4j_jw5Y5r2xJhD2iz1fil8bqGkk53KmXdv7BLZEkAXweLxicgdF_Inx3teHExiDGD9kURNFXx1zUsOLhfKJ1H7OtqaXV53dCdy36EAEu8dAsZFVfHaKQlWJMYdMlf8xstE-a3q1oeE5eSUm6jhZBG2H95HecESWRBEl9EezMJZpshEu0hT12Q5UozhRv8V4CFC8VxXAvZHKgVVkhl9xhZzw",
    },
  ];
  const [adminIdx, setAdminIdx] = useState(0);

  // States with default fallback to localStorage or predefined datasets
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem("bhr_rooms");
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("bhr_bookings");
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [requests, setRequests] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem("bhr_requests");
    return saved ? JSON.parse(saved) : initialRequests;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem("bhr_guests");
    return saved ? JSON.parse(saved) : initialGuests;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("bhr_activities");
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [selectedGuestId, setSelectedGuestId] = useState<string>("g-1");

  // Save changes to physical localStorage automatically to preserve actions
  useEffect(() => {
    localStorage.setItem("bhr_rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("bhr_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("bhr_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("bhr_guests", JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem("bhr_activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (type: ActivityLog["type"], message: string, meta: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newLog: ActivityLog = {
      id: "act-" + Date.now(),
      type,
      message,
      meta,
      time: timeStr,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  // State Handler Modifiers
  const handleUpdateRoom = (updated: Room) => {
    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    addActivity("maintenance", `Room ${updated.id} status modified to ${updated.status}`, "Operational Update");
  };

  const handleAddRoom = (newRoom: Room) => {
    setRooms((prev) => [newRoom, ...prev]);
    addActivity("maintenance", `New space added: Room ${newRoom.id} (${newRoom.type})`, "Inventory System");
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    addActivity("maintenance", `Removed room ${roomId} from operational inventory`, "Inventory System");
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    addActivity("booking", `Confirmed booking for ${newBooking.guestName}`, "Reservation Desk");
  };

  const handleUpdateGuest = (updatedGuest: Guest) => {
    setGuests((prev) => prev.map((g) => (g.id === updatedGuest.id ? updatedGuest : g)));
    addActivity("checkin", `Customer sheet for ${updatedGuest.name} revised`, "Guest Profiler");
  };

  const handleApproveRequest = (reqId: string) => {
    const request = requests.find((r) => r.id === reqId);
    if (!request) return;

    // Find available room
    const targetRoom = rooms.find((r) => r.status === "AVAILABLE");
    if (!targetRoom) {
      alert("No vacant available rooms to map checked guests.");
      return;
    }

    // Direct room override transition as checked-in
    setRooms((prev) =>
      prev.map((r) => (r.id === targetRoom.id ? { ...r, status: "OCCUPIED", lastAction: "Checked in requested guest" } : r))
    );

    const newBooking: Booking = {
      id: "bk-" + Math.floor(Math.random() * 10000),
      guestName: request.guestName,
      guestTier: "Standard Member",
      roomType: targetRoom.type,
      roomId: targetRoom.id,
      startDate: request.startDate,
      endDate: request.endDate,
      nights: request.nights,
      status: "In House",
      rateCode: `$${targetRoom.rate}.00 / RAC`,
      pricePerNight: targetRoom.rate,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    addActivity("checkin", `${request.guestName} check-in authorized to Room ${targetRoom.id}`, "Aurelian Operator");
    alert(`Approved request successfully! Checked guest into Room ${targetRoom.id}.`);
  };

  const handleDeclineRequest = (reqId: string) => {
    const request = requests.find((r) => r.id === reqId);
    if (!request) return;
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    addActivity("checkout", `Declined arrival alert for ${request.guestName}`, "Desk operator");
  };

  const handleSwitchAdmin = () => {
    const nextIdx = (adminIdx + 1) % adminProfiles.length;
    setAdminIdx(nextIdx);
    addActivity("checkin", `Switched active workstation session to ${adminProfiles[nextIdx].name}`, "Terminal");
  };

  const handleNewReservationCTA = () => {
    setActiveSection("booking");
    // Simple prompt for immediate checkout/reservation experience
    alert("New Reservation form is active in core Command Center! Create bookings from the right sidebar.");
  };

  return (
    <div className="min-h-screen bg-surface flex selection:bg-gold-light/40 selection:text-gold-dark">
      {/* Sidebar navigation panel */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        currentUser={adminProfiles[adminIdx]}
        onNewReservation={handleNewReservationCTA}
      />

      {/* Main Container Workspace */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header toolbar */}
        <Header
          allRooms={rooms}
          allGuests={guests}
          onSelectRoom={(id) => {
            setActiveSection("rooms");
            alert(`Inspecting Room coordinates: Unit ${id}`);
          }}
          onSelectGuest={(id) => {
            setSelectedGuestId(id);
            setActiveSection("guests");
          }}
          currentUser={adminProfiles[adminIdx]}
          onChangeUser={handleSwitchAdmin}
          onSearch={(query) => {
            // Passthrough searching hooks optionally
          }}
        />

        {/* Content canvas matching viewport specifications */}
        <main className="p-8 flex-1 overflow-y-auto">
          {activeSection === "rooms" && (
            <RoomsSection
              rooms={rooms}
              staff={initialStaffList}
              onUpdateRoom={handleUpdateRoom}
              onAddRoom={handleAddRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          )}

          {activeSection === "booking" && (
            <BookingSection
              rooms={rooms}
              bookings={bookings}
              requests={requests}
              activities={activities}
              onAddBooking={handleAddBooking}
              onApproveRequest={handleApproveRequest}
              onDeclineRequest={handleDeclineRequest}
              onUpdateRoom={handleUpdateRoom}
            />
          )}

          {activeSection === "guests" && (
            <GuestsSection
              guests={guests}
              onUpdateGuest={handleUpdateGuest}
              selectedGuestId={selectedGuestId}
              onSelectGuest={setSelectedGuestId}
            />
          )}

          {activeSection === "reports" && <ReportsSection />}

          {activeSection === "analytics" && <AnalyticsSection />}
        </main>
      </div>
    </div>
  );
}
