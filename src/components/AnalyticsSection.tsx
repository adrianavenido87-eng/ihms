/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TrendingUp, Award, Clock, DollarSign, Percent, ShieldCheck } from "lucide-react";

export default function AnalyticsSection() {
  const analyticsKpis = [
    { label: "RevPar Index", val: "$342.50", change: "+11.2% YoY", desc: "Average rate per available space limits", icon: DollarSign },
    { label: "Occupancy Curve", val: "88.4%", change: "+2.1% MoM", desc: "Active guest checked rooms", icon: Percent },
    { label: "Housekeeping Turnaround", val: "42.0 min", change: "-4.5 min VS LY", desc: "Elena Ross shift averages", icon: Clock },
    { label: "GSI Score (Loyalty)", val: "97.8 / 100", change: "+0.5pts Index", desc: "Diamond Member feedback ratings", icon: Award },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-xs font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-4">
        <div>
          <nav className="flex gap-2 text-[10px] font-bold tracking-widest text-outline uppercase mb-2">
            <span>Management</span>
            <span>/</span>
            <span className="text-gold-dark font-sans">Corporate Analytics</span>
          </nav>
          <h3 className="font-serif text-headline-sm md:text-headline-lg text-on-surface">
            Operational Analytics Hub
          </h3>
        </div>
        <button
          onClick={() => alert("Retrieving deep historical data from channel manager logs...")}
          className="px-5 py-2.5 bg-surface-charcoal text-white hover:bg-gold-dark text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-2 rounded-xs cursor-pointer font-sans"
        >
          <TrendingUp className="w-4 h-4 text-gold-light" />
          <span>Synchronize Historical Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border rounded p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex justify-between items-start">
                <span className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                  {kpi.label}
                </span>
                <Icon className="w-4 h-4 text-gold-dark" />
              </div>
              <div className="mt-3.5 space-y-1">
                <p className="font-serif text-headline-sm font-bold text-slate-800">{kpi.val}</p>
                <div className="flex justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold font-mono">{kpi.change}</span>
                  <span className="text-gray-400 font-sans truncate ml-2">{kpi.desc}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of Interactive SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 leading-relaxed">
        {/* Occupancy Trends Graph (SVG Line/Area Chart) */}
        <div className="bg-white border p-6 rounded-sm shadow-2xs space-y-4">
          <h4 className="font-serif text-headline-sm font-bold text-slate-800">Monthly Occupancy Rates</h4>
          <p className="text-gray-400 text-xs">Tracking peak reservation months across signature suites limits</p>
          
          {/* Stunning Responsive SVG Area Chart */}
          <div className="relative pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-auto">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A059" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C5A059" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeWidth="2" />

              {/* Axis Labels */}
              <text x="40" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Jan</text>
              <text x="120" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Feb</text>
              <text x="200" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Mar</text>
              <text x="280" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Apr</text>
              <text x="360" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">May</text>
              <text x="440" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Jun</text>

              {/* Filled Area */}
              <path
                d="M 40 140 Q 120 100 200 60 T 280 120 T 360 40 T 440 30 L 440 170 L 40 170 Z"
                fill="url(#areaGrad)"
              />

              {/* The Line */}
              <path
                d="M 40 140 Q 120 100 200 60 T 280 120 T 360 40 T 440 30"
                fill="none"
                stroke="#C5A059"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Knobs and Popups */}
              <circle cx="360" cy="40" r="5" fill="#C5A059" />
              <text x="360" y="25" fill="#765706" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">89.1%</text>
              
              <circle cx="440" cy="30" r="5" fill="#765706" />
              <text x="445" y="15" fill="#765706" fontSize="10" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">94.2%</text>
            </svg>
          </div>
        </div>

        {/* RevPAR ADR Columns Graph */}
        <div className="bg-white border p-6 rounded-sm shadow-2xs space-y-4">
          <h4 className="font-serif text-headline-sm font-bold text-slate-800">Weekly RevPAR Mappings</h4>
          <p className="text-gray-400 text-xs">Comparing actual average rates achieved over weekday and weekend shifts</p>

          <div className="relative pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-auto">
              <line x1="40" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeWidth="2" />

              {/* Day Labels */}
              <text x="70" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Mon</text>
              <text x="130" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Tue</text>
              <text x="190" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Wed</text>
              <text x="250" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Thu</text>
              <text x="310" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Fri</text>
              <text x="370" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Sat</text>
              <text x="430" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Sun</text>

              {/* Columns bars styled beautifully with gold-light and surface-charcoal */}
              {/* Mon */}
              <rect x="58" y="90" width="24" height="80" rx="3" fill="#C5A059" />
              <text x="70" y="80" fill="#765706" fontSize="9" fontWeight="bold" textAnchor="middle">$280</text>
              
              {/* Tue */}
              <rect x="118" y="80" width="24" height="90" rx="3" fill="#C5A059" />
              <text x="130" y="70" fill="#765706" fontSize="9" fontWeight="bold" textAnchor="middle">$310</text>
              
              {/* Wed */}
              <rect x="178" y="110" width="24" height="60" rx="3" fill="#0F172A" />
              <text x="190" y="100" fill="#0F172A" fontSize="9" fontWeight="bold" textAnchor="middle">$190</text>

              {/* Thu */}
              <rect x="238" y="75" width="24" height="95" rx="3" fill="#C5A059" />
              <text x="250" y="65" fill="#765706" fontSize="9" fontWeight="bold" textAnchor="middle">$330</text>

              {/* Fri */}
              <rect x="298" y="40" width="24" height="130" rx="3" fill="#0F172A" />
              <text x="310" y="30" fill="#0F172A" fontSize="9" fontWeight="bold" textAnchor="middle">$450</text>

              {/* Sat */}
              <rect x="358" y="30" width="24" height="140" rx="3" fill="#0F172A" />
              <text x="370" y="20" fill="#0F172A" fontSize="9" fontWeight="bold" textAnchor="middle">$490</text>

              {/* Sun */}
              <rect x="418" y="60" width="24" height="110" rx="3" fill="#C5A059" />
              <text x="430" y="50" fill="#765706" fontSize="9" fontWeight="bold" textAnchor="middle">$380</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom insights alert */}
      <div className="bg-[#f0fdf4] border border-emerald-300 p-5 rounded-sm flex items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider">Revenue Optimization Met</h4>
          <p className="text-emerald-700 text-[11px] leading-relaxed">
            ADR expanded by 8.4% above initial quarter boundaries, driven by strong Diamond Point conversions and automated suite upgrades!
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded font-bold uppercase tracking-wider text-[10px]">
          97.8 GSI Index
        </div>
      </div>
    </div>
  );
}
