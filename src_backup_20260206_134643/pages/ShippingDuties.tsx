"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Truck, Globe, RefreshCw, Shield, Clock, CreditCard, Package, AlertCircle, CheckCircle } from "lucide-react";
import WatchPanel from "@/components/watch/watch-panel";

const SHIPPING_REGIONS = [
  {
    region: "European Union",
    countries: "France, Germany, Italy, Spain, Netherlands, Belgium, etc.",
    time: "3-5 business days",
    cost: "Free over €150 • €12 under €150",
    duties: "Included (DDP)",
    carrier: "DHL Express / La Poste",
    tracking: "Full tracking from dispatch"
  },
  {
    region: "United Kingdom",
    countries: "England, Scotland, Wales, Northern Ireland",
    time: "4-6 business days",
    cost: "Free over £130 • £15 under £130",
    duties: "Included (DDP) — no surprise charges",
    carrier: "DHL Express",
    tracking: "Full tracking from dispatch"
  },
  {
    region: "United States",
    countries: "All 50 states",
    time: "5-8 business days",
    cost: "Free over $175 • $18 under $175",
    duties: "Included (DDP) for orders under $800",
    carrier: "DHL Express / FedEx",
    tracking: "Full tracking from dispatch"
  },
  {
    region: "Canada",
    countries: "All provinces and territories",
    time: "5-8 business days",
    cost: "Free over $200 CAD • $22 CAD under",
    duties: "Included (DDP)",
    carrier: "DHL Express",
    tracking: "Full tracking from dispatch"
  },
  {
    region: "MENA",
    countries: "UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Morocco, etc.",
    time: "3-5 business days",
    cost: "Free over €120 • €10 under €120",
    duties: "Customer pays on arrival (DAP) — we provide estimates",
    carrier: "Aramex / DHL",
    tracking: "Full tracking from dispatch"
  },
  {
    region: "Rest of World",
    countries: "Australia, Japan, Singapore, South Africa, etc.",
    time: "7-12 business days",
    cost: "€25 flat rate • Free over €250",
    duties: "Customer pays on arrival (DAP)",
    carrier: "DHL Express",
    tracking: "Full tracking from dispatch"
  }
];

const RETURNS_POLICY = {
  window: "30 days from delivery",
  condition: "Unworn, tags attached, original packaging",
  process: [
    "Email returns@maniar.com with order number",
    "Receive prepaid return label within 24 hours (EU/UK/US)",
    "Drop off at carrier location or schedule pickup",
    "Refund processed within 5 business days of receipt"
  ],
  exceptions: [
    "Final sale items (marked clearly at purchase)",
    "Items altered or customized",
    "Items without original tags"
  ]
};

const EXCHANGES = {
  available: true,
  process: "We offer free exchanges for size issues within EU/UK/US. Email us, and we'll ship the new size before you return the original (card hold required).",
  note: "Size guidance available via concierge before purchase to minimize exchanges."
};

interface ShippingDutiesProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function ShippingDuties({ onBack, onNavigate }: ShippingDutiesProps) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-[112px] px-4 md:px-8 pb-20">
      <div className="mx-auto max-w-6xl flex flex-col gap-5">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={onBack}
          className="dock-btn elevation-btn w-fit"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* Hero Section */}
        <WatchPanel kicker="Clear & Honest" title="Shipping, Duties & Returns">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-lg leading-relaxed dock-muted">
                No surprise fees. No vague timelines. No hidden conditions. Here's exactly what to expect when you order from Maniar.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">Free shipping thresholds</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">Worldwide delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">DDP where possible</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw size={20} className="text-[#D6AC54]" />
                  <span className="text-sm">Easy exchanges</span>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-[rgba(214,172,84,0.20)] bg-[rgba(7,8,23,0.55)] elevation-card">
              <div className="text-center">
                <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-2">
                  What DDP means for you
                </div>
                <div className="font-serif text-xl mt-2">Duties Delivered Paid</div>
                <div className="dock-divider my-4" />
                <p className="dock-muted text-sm">
                  In DDP regions, the price you see is the price you pay. No customs charges, no import fees, no surprises at your door.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[#D6AC54]">
                  <CheckCircle size={16} />
                  <span className="text-sm">EU, UK, US, Canada</span>
                </div>
              </div>
            </div>
          </div>
        </WatchPanel>

        {/* Shipping by Region */}
        <WatchPanel kicker="By Region" title="Shipping Details">
          <p className="dock-muted mb-6">
            Click any region for complete details. All times are estimates from dispatch date.
          </p>
          <div className="space-y-3">
            {SHIPPING_REGIONS.map((region) => (
              <div
                key={region.region}
                className="rounded-2xl border border-[rgba(214,172,84,0.16)] bg-[rgba(7,8,23,0.55)] overflow-hidden elevation-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedRegion(expandedRegion === region.region ? null : region.region)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[rgba(214,172,84,0.05)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Globe size={20} className="text-[#D6AC54]" />
                    <div>
                      <div className="font-serif text-lg">{region.region}</div>
                      <div className="text-sm dock-muted">{region.time} • {region.cost.split('•')[0].trim()}</div>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className={`dock-muted transition-transform ${expandedRegion === region.region ? 'rotate-90' : ''}`}
                  />
                </button>
                
                {expandedRegion === region.region && (
                  <div className="px-4 pb-4 border-t border-[rgba(214,172,84,0.10)]">
                    <div className="pt-4 grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-1">
                          Countries
                        </div>
                        <p className="text-sm dock-muted">{region.countries}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-1">
                          Delivery Time
                        </div>
                        <p className="text-sm text-[#F4E5A7]">{region.time}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-1">
                          Shipping Cost
                        </div>
                        <p className="text-sm text-[#F4E5A7]">{region.cost}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-1">
                          Duties & Taxes
                        </div>
                        <p className="text-sm text-[#F4E5A7]">{region.duties}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-1">
                          Carrier
                        </div>
                        <p className="text-sm dock-muted">{region.carrier}</p>
                      </div>
                      <div>
                        <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-1">
                          Tracking
                        </div>
                        <p className="text-sm dock-muted">{region.tracking}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </WatchPanel>

        {/* Duties Explanation */}
        <WatchPanel kicker="Important" title="Understanding Duties">
          <div className="grid md:grid-cols-2 gap-6">
            <WatchPanel as="div" variant="compact" kicker="DDP Regions" title="We Pay Duties">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={18} className="text-[#D6AC54]" />
                <span className="text-sm text-[#F4E5A7]">EU, UK, US, Canada</span>
              </div>
              <p className="dock-muted text-sm leading-relaxed">
                The checkout price is your final price. We handle all import duties and taxes. Nothing extra to pay on delivery.
              </p>
            </WatchPanel>
            
            <WatchPanel as="div" variant="compact" kicker="DAP Regions" title="Customer Pays Duties">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-[rgba(244,229,167,0.70)]" />
                <span className="text-sm text-[#F4E5A7]">MENA, Asia, Australia, etc.</span>
              </div>
              <p className="dock-muted text-sm leading-relaxed">
                Your country may charge import duties on delivery. This varies by country and order value. We'll provide an estimate at checkout, but final amounts are set by your customs authority.
              </p>
            </WatchPanel>
          </div>
        </WatchPanel>

        {/* Returns Policy */}
        <WatchPanel kicker="Returns" title="30-Day Returns">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-[#D6AC54]" />
                <span className="font-serif text-xl">{RETURNS_POLICY.window}</span>
              </div>
              <p className="dock-muted text-sm mb-4">
                <strong>Condition:</strong> {RETURNS_POLICY.condition}
              </p>
              
              <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-2">
                Return Process
              </div>
              <ol className="space-y-2">
                {RETURNS_POLICY.process.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[rgba(214,172,84,0.20)] border border-[rgba(214,172,84,0.40)] flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm dock-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-2">
                Return Shipping Cost
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#D6AC54]" />
                  <span className="text-sm dock-muted">EU/UK/US: Prepaid label provided free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#D6AC54]" />
                  <span className="text-sm dock-muted">Canada: Prepaid label provided free</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-[rgba(244,229,167,0.60)]" />
                  <span className="text-sm dock-muted">Other regions: Customer pays return shipping</span>
                </div>
              </div>
              
              <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)] mb-2">
                Exceptions (Final Sale)
              </div>
              <ul className="space-y-1">
                {RETURNS_POLICY.exceptions.map((exc, idx) => (
                  <li key={idx} className="text-sm dock-muted">• {exc}</li>
                ))}
              </ul>
            </div>
          </div>
        </WatchPanel>

        {/* Exchanges */}
        <WatchPanel kicker="Size Issues?" title="Easy Exchanges">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw size={20} className="text-[#D6AC54]" />
                <span className="font-serif text-xl">Free Size Exchanges</span>
              </div>
              <p className="dock-muted leading-relaxed">
                {EXCHANGES.process}
              </p>
              <p className="mt-4 text-sm dock-muted italic">
                {EXCHANGES.note}
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-[rgba(214,172,84,0.20)] bg-[rgba(7,8,23,0.55)] elevation-sm">
              <div className="text-center">
                <Package size={32} className="text-[#D6AC54] mx-auto mb-3" />
                <div className="font-serif text-lg">We Ship First</div>
                <p className="mt-2 text-sm dock-muted">
                  For exchanges, we send your new size before receiving the return. Just a temporary card hold until we receive the original.
                </p>
              </div>
            </div>
          </div>
        </WatchPanel>

        {/* Summary Card for Product Pages */}
        <WatchPanel kicker="For Reference" title="Checkout Summary">
          <p className="dock-muted mb-4">
            This summary appears near the Add to Cart button on all product pages:
          </p>
          <div className="max-w-md p-4 rounded-2xl border border-[rgba(214,172,84,0.20)] bg-[rgba(7,8,23,0.65)] elevation-sm">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#D6AC54]" />
                <span className="dock-muted">Free shipping to EU/UK/US over €150</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#D6AC54]" />
                <span className="dock-muted">Duties included — no surprise fees</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={14} className="text-[#D6AC54]" />
                <span className="dock-muted">30-day returns • Free exchanges</span>
              </div>
            </div>
          </div>
        </WatchPanel>

        {/* CTA Section */}
        <WatchPanel kicker="Questions?" title="Need Help?">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="dock-muted">
              Our concierge can answer shipping questions for your specific location.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onBack}
                className="dock-btn dock-btn-primary elevation-btn"
              >
                Shop Collection <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('journal')}
                className="dock-btn elevation-btn"
              >
                Read Style Guides
              </button>
            </div>
          </div>
        </WatchPanel>
      </div>
    </div>
  );
}
