/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  residence: string;
  tier: "Standard" | "Premier Club" | "Premier Gold" | "Premier Diamond";
  memberSince: string;
  loyaltyPoints: number;
  avatar: string;
  dietary: string;
  roomPref: string;
  opsNotes: string;
  stayHistory: Array<{
    property: string;
    dates: string;
    roomType: string;
    spend: string;
  }>;
}

export interface Room {
  id: string; // e.g. "302"
  type: string; // e.g. "Presidential Suite"
  floor: string; // e.g. "Floor 03"
  status: "AVAILABLE" | "OCCUPIED" | "DIRTY" | "MAINTENANCE";
  assignedStaffId?: string;
  lastAction: string;
  rate: number;
}

export interface Booking {
  id: string;
  guestName: string;
  guestTier?: string;
  roomType: string;
  roomId?: string;
  startDate: string; // e.g. "2026-06-12"
  endDate: string; // e.g. "2026-06-15"
  nights: number;
  status: "In House" | "Arriving Soon" | "Reserved";
  rateCode: string; // e.g. "$1,250.00 / RAC"
  pricePerNight: number;
}

export interface BookingRequest {
  id: string;
  roomNum: string;
  timeAgo: string;
  guestName: string;
  startDate: string;
  endDate: string;
  nights: number;
  status: "PENDING" | "PAYMENT_PENDING";
}

export interface ActivityLog {
  id: string;
  type: "checkin" | "maintenance" | "checkout" | "booking";
  message: string;
  meta: string;
  time: string;
}
