"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, BookOpen, Ruler, Heart, Sparkles, Shirt, Droplets, Calendar, ChevronDown } from "lucide-react";
import WatchPanel from "@/components/watch/watch-panel";

const JOURNAL_ARTICLES = [
  {
    id: "embroidery-techniques",
    category: "Craft",
    title: "The Story of Moroccan Embroidery Techniques",
    subtitle: "Understanding Tarz, Sfifa, and Zari",
    image: "/images/nero-oro.png",
    readTime: "6 min read",
    content: [
      {
        heading: "Three Traditions, One Garment",
        text: "Moroccan embroidery isn't one technique—it's a conversation between three distinct traditions that have evolved over centuries. Understanding them helps you appreciate what you're wearing."
      },
      {
        heading: "Tarz: The Foundation",
        text: "Tarz (تارز) is counted-thread embroidery, the most widespread technique in Morocco. Each region developed signature patterns: Fes favors geometric precision, Rabat prefers flowing florals, and Meknes blends both. A skilled artisan can identify a garment's origin by its tarz alone. Our pieces use Fassi-style geometric tarz on collars and cuffs—subtle, precise, unmistakably intentional."
      },
      {
        heading: "Sfifa: The Edge",
        text: "Sfifa is hand-braided trim made from silk, cotton, or metallic thread. It's painfully slow—a single meter takes 4-6 hours of continuous work. The result is a raised, textured edge that machine trim cannot replicate. Look closely at any Maniar collar or seam finish. That dimensional quality is sfifa, handmade by specialists in the Fes medina who do nothing else."
      },
      {
        heading: "Zari: The Light",
        text: "Zari is metallic threadwork—gold or silver-wrapped thread woven into fabric or embroidered on top. It creates the subtle shimmer you see on our evening pieces. We use zari sparingly because restraint is the point. A flash of gold at the neckline. A glint on a cuff. Enough to catch light, not enough to shout."
      },
      {
        heading: "Why It Matters",
        text: "These aren't decorations added after the fact. They're structural elements planned from the first sketch. A Maniar piece without embroidery would feel incomplete—like a watch without hands. The techniques don't just look good. They make the garment what it is."
      }
    ]
  },
  {
    id: "measuring-guide",
    category: "Fit",
    title: "How to Measure Yourself for Kaftan-Style Garments",
    subtitle: "Get it right the first time",
    image: "/images/verde-acqua.png",
    readTime: "4 min read",
    content: [
      {
        heading: "Why Standard Sizing Fails",
        text: "Western sizing assumes fitted garments. Kaftan-style pieces are designed with intentional ease—they're meant to drape, not cling. This means your usual size might not apply. Here's how to measure for the fit we intended."
      },
      {
        heading: "Shoulder Width",
        text: "Unlike Western jackets, kaftan shoulders are often dropped or extended. Measure from shoulder point to shoulder point across your back. Our size guide shows the actual garment measurement, not body measurement. If you're between sizes, go larger for relaxed fit, smaller for structured."
      },
      {
        heading: "Chest (Full)",
        text: "Measure around the fullest part of your chest, under your arms. Add 10-15cm to this number for our recommended ease. Yes, more than you think. These garments need room to move and layer."
      },
      {
        heading: "Length",
        text: "Stand straight. Measure from the base of your neck (where a collar would sit) to where you want the garment to end. Our product pages show back length. Djellabas typically hit mid-calf to ankle. Caftans vary—check individual listings."
      },
      {
        heading: "Sleeve Length",
        text: "Arm relaxed at your side, measure from shoulder point to wrist bone. Many of our pieces have bracelet-length sleeves (showing wrist) or extended cuffs (covering hand). Product descriptions specify."
      },
      {
        heading: "When in Doubt",
        text: "Message our concierge with your height, weight, and usual size in Western brands. We'll recommend the right size and flag if a particular piece runs different. This is what we're here for."
      }
    ]
  },
  {
    id: "wedding-guest-style",
    category: "Occasion",
    title: "Wedding Guest Style Guide",
    subtitle: "Celebration wear, region-neutral",
    image: "/images/elegant.png",
    readTime: "5 min read",
    content: [
      {
        heading: "The Challenge",
        text: "Wedding dress codes are unspoken and vary wildly by culture, region, and family. A Moroccan wedding expects different attire than a London registry office. Here's how to navigate with confidence."
      },
      {
        heading: "The Safe Choice: Elevated Neutral",
        text: "When uncertain, choose: deep colors (navy, forest, burgundy, black), quality fabric (wool, silk blend, structured cotton), minimal embellishment, and excellent tailoring. Our Atlas Long Coat in navy or the Noir Gold Djellaba hits this mark perfectly. You'll look intentional without competing with the wedding party."
      },
      {
        heading: "For MENA & South Asian Weddings",
        text: "These celebrations expect richness. Gold accents are welcome. Embroidery is appropriate. Color is celebrated. Our Noir Gold Djellaba or Verde Acqua Kaftan works beautifully. Don't underdress—it reads as disrespect."
      },
      {
        heading: "For European & American Weddings",
        text: "Restraint is key. Skip heavy embroidery unless the couple's culture welcomes it. Our Uomo Gilet with tailored trousers, or the Atlas Long Coat over simple separates, strikes the right note. Let the fabric quality speak."
      },
      {
        heading: "Evening vs. Day",
        text: "Day weddings: lighter colors, cotton or linen, minimal shine. Evening weddings: deeper colors, silk blends, subtle metallic accents. Our product tags indicate day/evening suitability."
      },
      {
        heading: "The Confidence Rule",
        text: "Whatever you wear, wear it with certainty. A kaftan worn apologetically looks like a costume. The same kaftan worn with posture and presence looks like a deliberate choice. Conviction is the best accessory."
      }
    ]
  },
  {
    id: "care-guide",
    category: "Care",
    title: "Care Guide for Embellished Garments",
    subtitle: "Protect your investment",
    image: "/images/uomo-gilet.png",
    readTime: "4 min read",
    content: [
      {
        heading: "The First Rule",
        text: "Hand embroidery and machine washing are enemies. Always dry clean embellished pieces, or hand wash with extreme care. The thread that took 20 hours to apply can be destroyed in 20 minutes of tumble drying."
      },
      {
        heading: "Storage",
        text: "Hang heavy pieces on padded or wide hangers—wire hangers create shoulder dimples. Fold lighter pieces along seams, never across embroidery. Use breathable garment bags, not plastic. Moths love dark closets and neglect."
      },
      {
        heading: "Spot Cleaning",
        text: "Small stains: dab (don't rub) with cold water and mild soap. Work from outside the stain inward. Air dry flat. For anything on embroidered areas, go straight to a specialist cleaner. Don't experiment."
      },
      {
        heading: "Ironing",
        text: "Low heat, inside out, with a pressing cloth between iron and fabric. Never iron directly over embroidery or metallic work—it will flatten and dull. Steam from a distance is safer for most pieces."
      },
      {
        heading: "Between Wears",
        text: "Air out after wearing. Perfume, body oils, and humidity break down fibers over time. A day on a padded hanger in circulating air extends garment life significantly."
      },
      {
        heading: "When to Seek Help",
        text: "Loose threads, pulled embroidery, or damaged sfifa: contact us. Our ateliers can repair most issues. Catching problems early prevents permanent damage. This is part of the relationship, not a burden."
      }
    ]
  }
];

interface JournalProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function Journal({ onBack, onNavigate }: JournalProps) {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Craft": return <Sparkles size={16} />;
      case "Fit": return <Ruler size={16} />;
      case "Occasion": return <Calendar size={16} />;
      case "Care": return <Droplets size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

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
        <WatchPanel kicker="Atelier Notes" title="Journal">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-lg leading-relaxed dock-muted">
                Not a blog. Not weekly content for content's sake. Just a few essential pieces that help you understand what you're buying, how to wear it, and how to care for it.
              </p>
              <p className="mt-4 dock-muted">
                Written once. Updated when needed. Designed to answer questions before you have to ask them.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Craft", "Fit", "Occasion", "Care"].map((cat) => (
                <div key={cat} className="p-4 rounded-xl border border-[rgba(214,172,84,0.16)] bg-[rgba(7,8,23,0.55)] elevation-sm text-center">
                  <div className="text-[#D6AC54] flex justify-center mb-2">
                    {getCategoryIcon(cat)}
                  </div>
                  <div className="text-sm">{cat}</div>
                </div>
              ))}
            </div>
          </div>
        </WatchPanel>

        {/* Articles Grid */}
        <WatchPanel kicker="Guides" title="Essential Reading">
          <div className="space-y-4">
            {JOURNAL_ARTICLES.map((article) => (
              <div
                key={article.id}
                className="rounded-2xl border border-[rgba(214,172,84,0.16)] bg-[rgba(7,8,23,0.55)] overflow-hidden elevation-card"
              >
                {/* Article Header - Always Visible */}
                <button
                  type="button"
                  onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  className="w-full text-left"
                >
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="md:col-span-1">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-[200px] md:h-full object-cover opacity-[0.92]"
                      />
                    </div>
                    <div className="md:col-span-2 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#D6AC54]">{getCategoryIcon(article.category)}</span>
                        <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-[rgba(244,229,167,0.55)]">
                          {article.category}
                        </span>
                        <span className="text-[10px] dock-muted">• {article.readTime}</span>
                      </div>
                      <h3 className="font-serif text-2xl">{article.title}</h3>
                      <p className="mt-1 dock-muted">{article.subtitle}</p>
                      <div className="mt-4 flex items-center gap-2 text-[#D6AC54]">
                        <span className="text-sm">
                          {expandedArticle === article.id ? "Collapse" : "Read article"}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedArticle === article.id && (
                  <div className="border-t border-[rgba(214,172,84,0.12)]">
                    <div className="p-5 md:p-8 max-w-3xl">
                      {article.content.map((section, idx) => (
                        <div key={idx} className={idx > 0 ? "mt-6" : ""}>
                          <h4 className="font-serif text-xl text-[#F4E5A7]">{section.heading}</h4>
                          <p className="mt-2 dock-muted leading-relaxed">{section.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </WatchPanel>

        {/* Quick Reference Cards */}
        <WatchPanel kicker="Quick Reference" title="At a Glance">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <WatchPanel as="div" variant="compact" className="text-center">
              <Ruler size={24} className="text-[#D6AC54] mx-auto mb-3" />
              <div className="font-serif text-lg">Size Guide</div>
              <p className="mt-2 text-sm dock-muted">Detailed measurements for every product in the collection</p>
              <button
                type="button"
                onClick={() => setExpandedArticle('measuring-guide')}
                className="dock-btn mt-4 text-sm elevation-btn w-full justify-center"
              >
                View Guide
              </button>
            </WatchPanel>

            <WatchPanel as="div" variant="compact" className="text-center">
              <Droplets size={24} className="text-[#D6AC54] mx-auto mb-3" />
              <div className="font-serif text-lg">Care Instructions</div>
              <p className="mt-2 text-sm dock-muted">Protect your investment with proper care</p>
              <button
                type="button"
                onClick={() => setExpandedArticle('care-guide')}
                className="dock-btn mt-4 text-sm elevation-btn w-full justify-center"
              >
                View Guide
              </button>
            </WatchPanel>

            <WatchPanel as="div" variant="compact" className="text-center">
              <Shirt size={24} className="text-[#D6AC54] mx-auto mb-3" />
              <div className="font-serif text-lg">Styling Tips</div>
              <p className="mt-2 text-sm dock-muted">How to wear Eastern style with confidence</p>
              <button
                type="button"
                onClick={() => setExpandedArticle('wedding-guest-style')}
                className="dock-btn mt-4 text-sm elevation-btn w-full justify-center"
              >
                View Guide
              </button>
            </WatchPanel>

            <WatchPanel as="div" variant="compact" className="text-center">
              <Heart size={24} className="text-[#D6AC54] mx-auto mb-3" />
              <div className="font-serif text-lg">Our Craft</div>
              <p className="mt-2 text-sm dock-muted">The techniques behind every piece</p>
              <button
                type="button"
                onClick={() => setExpandedArticle('embroidery-techniques')}
                className="dock-btn mt-4 text-sm elevation-btn w-full justify-center"
              >
                View Guide
              </button>
            </WatchPanel>
          </div>
        </WatchPanel>

        {/* CTA Section */}
        <WatchPanel kicker="Ready to Shop?" title="Explore the Collection">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="dock-muted">
              Now that you understand the craft, see it in action.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onBack}
                className="dock-btn dock-btn-primary elevation-btn"
              >
                View Collection <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.('craft')}
                className="dock-btn elevation-btn"
              >
                Craft & Origin
              </button>
            </div>
          </div>
        </WatchPanel>
      </div>
    </div>
  );
}
