/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Download, Calendar, Printer, FileText, CheckCircle2, TrendingUp, Sparkles, Building } from "lucide-react";

export default function ReportsSection() {
  const mockReports = [
    { title: "Daily Shift Summary", code: "REP-2026-06-07", description: "Consolidated list of checked guests, housekeeping priorities and checkouts.", status: "Ready", size: "1.2 MB", date: "June 7, 2026" },
    { title: "Monthly Revenue & ADR Breakdown", code: "REP-2026-05-31", description: "Audit analysis of average daily rate, available space metrics and ledger logs.", status: "Ready", size: "4.5 MB", date: "May 31, 2026" },
    { title: "Housekeeping Performance Ledger", code: "REP-2026-HW", description: "Timed evaluation metrics checking Elena Ross and other supervisor speeds.", status: "Ready", size: "0.8 MB", date: "Weekly Auto-gen" },
    { title: "Maintenance Log & HVAC System Audit", code: "REP-MNT-HVAC", description: "Full diagnostics of level 4 cooling systems and outstanding repair bills.", status: "Pending approval", size: "2.1 MB", date: "June 3, 2026" },
    { title: "Loyalty Diamond VIP Preferences Check", code: "REP-VIP-06", description: "Dietary matching, butler mappings, and point ledger synchronization schedules.", status: "Ready", size: "1.7 MB", date: "Monthly Auto-gen" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-xs font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-4">
        <div>
          <nav className="flex gap-2 text-[10px] font-bold tracking-widest text-[#807666] uppercase mb-2">
            <span>Management</span>
            <span>/</span>
            <span className="text-gold-dark">Operational Records</span>
          </nav>
          <h3 className="font-serif text-headline-sm md:text-headline-lg text-on-surface">
            HMS Reports Archive
          </h3>
        </div>
        <button
          onClick={() => alert("Batch downloading standard shift reports...")}
          className="px-5 py-2.5 bg-surface-charcoal text-white hover:bg-gold-dark text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-2 rounded-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-gold-light" />
          <span>Export All Sheets</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 leading-relaxed">
        {/* Reports Directory Content Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border rounded shadow-2xs divide-y divide-[#eceef0]">
            <div className="p-4 bg-slate-50/70 flex justify-between items-center font-bold">
              <span className="uppercase tracking-wider text-gray-500 font-sans text-[10px]">Document Title / Code</span>
              <span className="uppercase tracking-wider text-gray-500 font-sans text-[10px]">Status</span>
            </div>

            {mockReports.map((report) => (
              <div key={report.code} className="p-4 hover:bg-slate-50/50 transition-colors flex justify-between items-center group">
                <div className="space-y-1.5 max-w-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold-dark" />
                    <span className="font-serif font-bold text-xs text-slate-800 group-hover:text-gold-dark transition-colors">{report.title}</span>
                  </div>
                  <p className="text-gray-400 font-mono text-[9px] font-bold">{report.code} • Generated {report.date}</p>
                  <p className="text-gray-500 text-[11px] leading-normal">{report.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                    report.status.includes("Pending") ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {report.status}
                  </span>
                  <button
                    onClick={() => alert(`Starting download for report matching: ${report.code} (${report.size}).`)}
                    className="text-[10px] font-bold uppercase tracking-wider text-gold-dark hover:text-gold-light flex items-center gap-1 mt-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ({report.size})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Info Box */}
        <div className="space-y-6">
          <div className="bg-white border p-6 rounded-sm shadow-2xs space-y-4">
            <h4 className="font-serif text-headline-sm font-bold text-gold-dark">Report Constructor</h4>
            <p className="text-gray-500 leading-normal text-[11px]">
              Set custom parameters to compile on-demand audit sheets. Results output directly into active spreadsheet channels.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert("Report construction initiated! Document compiling in background."); }} className="space-y-4">
              <div className="flex flex-col">
                <label className="font-bold uppercase text-gray-400 text-[9px] mb-1">Time Range</label>
                <select className="p-2 border rounded-sm bg-white">
                  <option>Current Shift (Today)</option>
                  <option>Previous Week Ledger</option>
                  <option>Month to Date (ADR / RevPAR)</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-bold uppercase text-gray-400 text-[9px] mb-1">Target Filter Suite</label>
                <select className="p-2 border rounded-sm bg-white">
                  <option>All Inventory Categories</option>
                  <option>Suites &amp; Penthouses Only</option>
                  <option>Housekeeping Staff Mappings</option>
                  <option>Outstanding VIP Folio Debts</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-surface-charcoal hover:bg-gold-dark text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-all rounded-xs cursor-pointer"
              >
                Compile PDF Report
              </button>
            </form>
          </div>

          {/* Integration alert box */}
          <div className="bg-[#f0f9ff]/50 border border-blue-200 p-4 rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold">
              <Sparkles className="w-4 h-4 text-blue-500 fill-blue-300" />
              <span>Workspace Sync Active</span>
            </div>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              Checked-in guest invoices, dining expenses, and room upgrades sync directly to corporate accounting spreadsheet sheets automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
