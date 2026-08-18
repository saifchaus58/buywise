import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  RotateCcw,
  Receipt,
  FileText,
  PieChart,
  Bot,
  ChevronDown,
  ChevronUp,
  Star,
  Layers,
  Upload,
  Camera,
  Check,
  Shield,
  ExternalLink,
  Laptop,
  Smartphone,
  Headphones,
  Tv,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  Search,
  ScanLine,
  Menu,
  X,
  Plus,
  Lock,
  Percent,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { HeroSection } from "./ui/hero-section";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, BarChart, Bar, XAxis } from "recharts";

export const LandingPageView: React.FC = () => {
  const {
    currentUser,
    openAuthModal,
    navigateToApp,
    demoLogin,
    purchases,
    setSelectedPurchase,
  } = useApp();

  // Floating mobile nav toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Pricing monthly/yearly toggle
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  // Interactive Live OCR demo sample bill selection
  const [selectedDemoBill, setSelectedDemoBill] = useState<number>(0);
  const [isScanningDemo, setIsScanningDemo] = useState<boolean>(false);

  // Interactive Savings Calculator state
  const [annualPurchasesCount, setAnnualPurchasesCount] = useState<number>(8);
  const [avgPurchaseValue, setAvgPurchaseValue] = useState<number>(24000);

  // Interactive Assistant Claim Demo
  const [claimProduct, setClaimProduct] = useState("Apple MacBook Air M2");
  const [claimIssue, setClaimIssue] = useState("Display screen flicker / backlight issue");
  const [claimGenerated, setClaimGenerated] = useState(false);

  const sampleBills = [
    {
      id: "demo-1",
      title: "OnePlus 12R (256GB)",
      seller: "Reliance Digital",
      icon: <Smartphone className="w-4 h-4 text-[#2563EB]" />,
      invoiceNo: "RD-2026-8942",
      amount: 47198,
      gst: 7199,
      date: "2026-07-18",
      warranty: "1 Year Official Warranty",
      warrantyRemaining: "335 days left",
      returnDays: 7,
      returnRemaining: "Active (2 days left)",
      insight: "1-year OnePlus India warranty. Retain original GST invoice for battery health coverage.",
      storeCity: "Mumbai, MH",
    },
    {
      id: "demo-2",
      title: "Apple MacBook Pro M3 (16-inch)",
      seller: "Apple BKC Mumbai",
      icon: <Laptop className="w-4 h-4 text-[#2563EB]" />,
      invoiceNo: "APL-IN-9812",
      amount: 199900,
      gst: 30510,
      date: "2026-06-10",
      warranty: "1 Year AppleCare Coverage",
      warrantyRemaining: "296 days left",
      returnDays: 14,
      returnRemaining: "Expired (Window closed)",
      insight: "AppleCare eligible for additional AppleCare+ extension within 60 days of invoice.",
      storeCity: "Bandra Kurla Complex",
    },
    {
      id: "demo-3",
      title: "Sony WH-1000XM5 ANC Headphones",
      seller: "Amazon India",
      icon: <Headphones className="w-4 h-4 text-[#2563EB]" />,
      invoiceNo: "AMZ-7734-11",
      amount: 29990,
      gst: 4574,
      date: "2026-08-12",
      warranty: "1 Year Sony Service",
      warrantyRemaining: "360 days left",
      returnDays: 7,
      returnRemaining: "Active (3 days left)",
      insight: "Return window active until Aug 19, 2026. Keep outer barcode sticker intact.",
      storeCity: "Fulfilled by Amazon",
    },
    {
      id: "demo-4",
      title: "Samsung 55\" Neo QLED 4K TV",
      seller: "Croma Retail",
      icon: <Tv className="w-4 h-4 text-[#2563EB]" />,
      invoiceNo: "CR-99210-S",
      amount: 84990,
      gst: 12964,
      date: "2026-05-04",
      warranty: "2 Years Panel Warranty",
      warrantyRemaining: "624 days left",
      returnDays: 10,
      returnRemaining: "Expired (Window closed)",
      insight: "Includes complimentary 1-year panel accidental damage protection via Samsung Care.",
      storeCity: "Bengaluru, KA",
    },
  ];

  const handleSelectSample = (idx: number) => {
    setIsScanningDemo(true);
    setSelectedDemoBill(idx);
    setTimeout(() => {
      setIsScanningDemo(false);
    }, 450);
  };

  // Calculations for savings estimator
  const estimatedSavings = Math.round(
    annualPurchasesCount * avgPurchaseValue * 0.14 + (annualPurchasesCount > 4 ? 6500 : 2500)
  );

  const faqs = [
    {
      number: "01",
      q: "How does BuyWise AI extract information from messy paper bills?",
      a: "BuyWise utilizes Gemini Multimodal Vision to process photos, PDFs, and thermal receipts. It automatically recognizes retailer tax IDs, invoice numbers, purchase dates, item line breakdowns, GST splits, and product warranty terms with 98.4% accuracy.",
    },
    {
      number: "02",
      q: "Will I get notified before my warranty or return deadline expires?",
      a: "Yes. BuyWise calculates the exact deadline down to the day. You receive scheduled reminders at 30 days, 14 days, and 3 days before warranty expiration, alongside urgent alerts 48 hours before return windows close.",
    },
    {
      number: "03",
      q: "Can I use BuyWise for business GST tax deduction tracking?",
      a: "Absolutely. BuyWise automatically separates the taxable subtotal and GST components (CGST, SGST, IGST) for every purchase, making it effortless to generate exportable expense reports and claim proofs for quarterly tax filing.",
    },
    {
      number: "04",
      q: "Is my personal purchase data kept secure and private?",
      a: "Your receipt data is stored securely in your private vault with row-level encryption. We never share or monetize consumer purchase histories. You have full export and complete deletion control at all times.",
    },
    {
      number: "05",
      q: "What file formats can I upload to the vault?",
      a: "You can snap high-res camera photos from your mobile device, upload PNG/JPG/WebP files, drag & drop multi-page PDF tax invoices, or manually input receipt details directly.",
    },
  ];

  const currentSample = sampleBills[selectedDemoBill];

  // Spending mini-chart data for mockup
  const miniChartData = [
    { name: "Jan", amount: 18000 },
    { name: "Feb", amount: 42000 },
    { name: "Mar", amount: 29000 },
    { name: "Apr", amount: 76000 },
    { name: "May", amount: 84990 },
    { name: "Jun", amount: 199900 },
    { name: "Jul", amount: 47198 },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0B0F19] font-sans antialiased selection:bg-[#2563EB] selection:text-white relative">
      {/* ----------------- FLOATING CIRCULAR PILL HEADER ----------------- */}
      <div className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6 pointer-events-none">
        <header className="max-w-5xl mx-auto rounded-full bg-white/85 backdrop-blur-xl border border-[#E5E7EB] shadow-lg shadow-black/[0.04] px-3 sm:px-5 py-2 flex items-center justify-between pointer-events-auto transition-all">
          {/* Brand Logo */}
          <div
            onClick={navigateToApp}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 pl-1"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B0F19] flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-[#0B0F19] text-[15px] sm:text-[16px] tracking-tight">
                BuyWise
              </span>
              <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded-full border border-[#BFDBFE]">
                AI
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-6 text-[12px] font-semibold text-[#5F6673]">
            <a
              href="#features"
              className="hover:text-[#0B0F19] transition-colors hover-underline-animation py-1"
            >
              Features
            </a>
            <a
              href="#demo"
              className="hover:text-[#0B0F19] transition-colors hover-underline-animation py-1"
            >
              Live Scanner
            </a>
            <a
              href="#calculator"
              className="hover:text-[#0B0F19] transition-colors hover-underline-animation py-1"
            >
              ROI Estimator
            </a>
            <a
              href="#pricing"
              className="hover:text-[#0B0F19] transition-colors hover-underline-animation py-1"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-[#0B0F19] transition-colors hover-underline-animation py-1"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-[12px] font-medium text-[#5F6673] px-2">
                  {currentUser.name.split(" ")[0]}
                </span>
                <button
                  type="button"
                  id="btn-launch-vault-nav"
                  onClick={navigateToApp}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-semibold rounded-full transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95"
                >
                  <span>Open Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  id="btn-nav-demo-instant"
                  onClick={demoLogin}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold text-[#0B0F19] bg-[#F7F8FA] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-full transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#2563EB]" />
                  <span>Demo</span>
                </button>

                <button
                  type="button"
                  id="btn-nav-signin"
                  onClick={() => openAuthModal("signin")}
                  className="px-3 py-1.5 text-[12px] font-semibold text-[#5F6673] hover:text-[#0B0F19] rounded-full transition-colors cursor-pointer"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  id="btn-nav-signup"
                  onClick={() => openAuthModal("signup")}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-semibold rounded-full transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#5F6673] hover:text-[#0B0F19] hover:bg-[#F7F8FA] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-sm mx-auto mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E5E7EB] shadow-xl p-4 pointer-events-auto animate-appear">
            <div className="flex flex-col gap-2.5 text-sm font-medium text-[#0B0F19]">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#F7F8FA]"
              >
                Features & Benefits
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#F7F8FA]"
              >
                Live OCR Scanner
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#F7F8FA]"
              >
                Savings Calculator
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#F7F8FA]"
              >
                Pricing Plans
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#F7F8FA]"
              >
                Frequently Asked Questions
              </a>
              <div className="pt-2 border-t border-[#E5E7EB] flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    demoLogin();
                  }}
                  className="w-full py-2 px-3 text-center bg-[#F7F8FA] rounded-lg text-xs font-bold text-[#0B0F19] border border-[#E5E7EB]"
                >
                  ⚡ Instant Demo Access
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- SECTION 01: HERO WITH HEROSECTION COMPONENT ----------------- */}
      <HeroSection
        badge={{
          text: "Gemini 2.5 Multimodal OCR Vault",
          action: {
            text: "See Live Scanner",
            onClick: () => {
              const el = document.getElementById("demo");
              el?.scrollIntoView({ behavior: "smooth" });
            },
          },
        }}
        title={
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0B0F19] leading-[1.08]">
            Never lose money to expired warranties or{" "}
            <span className="font-editorial-serif italic font-normal text-[#0B0F19] underline decoration-[#2563EB] decoration-2 underline-offset-4">
              missed returns again.
            </span>
          </h1>
        }
        description="BuyWise automatically scans receipt photos, extracts GST tax line items, monitors active return windows, and triggers automated alerts before warranties expire."
        actions={[
          {
            text: currentUser ? "Open Your Vault" : "Start Free Trial",
            onClick: () => (currentUser ? navigateToApp() : openAuthModal("signup")),
            icon: <ArrowRight className="w-4 h-4" />,
            variant: "default",
          },
          {
            text: "Interactive Live Demo",
            onClick: demoLogin,
            icon: <Sparkles className="w-4 h-4 text-[#2563EB]" />,
            variant: "glow",
          },
        ]}
      >
        {/* RICH INTERACTIVE MOCKUP VIEWPORT INSIDE HERO FRAME */}
        <div className="w-full bg-[#FFFFFF] p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl flex flex-col gap-6 relative">
          {/* Top Browser / App Shell Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#10B981]/80"></div>
              <span className="text-[11px] text-[#8A919D] font-mono ml-2 hidden sm:inline">
                buywise.vault/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-semibold text-[#065F46]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                AI Vision Engine Online
              </span>
            </div>
          </div>

          {/* Hero Mockup Content: 2-Column Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Left Col (7 cols): Live OCR Scan Highlight Card */}
            <div className="lg:col-span-7 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
              {/* Scan laser line animation */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent animate-pulse pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-[#0B0F19] block">
                        Live OCR Extraction Demo
                      </span>
                      <span className="text-[10px] text-[#5F6673]">
                        Processed in 340ms • Confidence: 99.4%
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                    VERIFIED INVOICE
                  </span>
                </div>

                {/* Scanned Card Details */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-3.5 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#2563EB] tracking-wide">
                        Reliance Digital Retail Ltd.
                      </span>
                      <h4 className="text-sm font-bold text-[#0B0F19]">OnePlus 12R (256GB)</h4>
                      <p className="text-[11px] text-[#5F6673]">Tax Invoice #RD-2026-8942</p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-[#0B0F19]">₹47,198</div>
                      <span className="text-[10px] text-[#059669] font-medium">GST ₹7,199</span>
                    </div>
                  </div>

                  {/* Micro Extracted Entities */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E7EB] text-[11px]">
                    <div className="bg-[#F7F8FA] p-2 rounded-md">
                      <span className="text-[9px] text-[#8A919D] block uppercase font-semibold">
                        Purchase Date
                      </span>
                      <span className="font-bold text-[#0B0F19]">18 Jul 2026</span>
                    </div>
                    <div className="bg-[#EFF6FF] p-2 rounded-md border border-[#BFDBFE]">
                      <span className="text-[9px] text-[#1E40AF] block uppercase font-semibold">
                        Warranty
                      </span>
                      <span className="font-bold text-[#2563EB]">1 Year Coverage</span>
                    </div>
                    <div className="bg-[#FEF3C7] p-2 rounded-md border border-[#FDE68A]">
                      <span className="text-[9px] text-[#92400E] block uppercase font-semibold">
                        Return Window
                      </span>
                      <span className="font-bold text-[#D97706]">2 Days Left</span>
                    </div>
                  </div>
                </div>

                {/* AI Automated Insight pill */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1E40AF] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                  <span>
                    <strong>AI Recommendation:</strong> 1-year battery replacement warranty active. Register on OnePlus RedCable for complimentary 3-month extension.
                  </span>
                </div>
              </div>

              {/* Bottom Mini CTA */}
              <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                <span className="text-[#5F6673] text-[11px]">Auto-categorized under: <strong>Electronics</strong></span>
                <span className="text-[#2563EB] font-bold flex items-center gap-1 cursor-pointer">
                  <span>View Full Receipt</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Right Col (5 cols): Live Action Alerts & Stats */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Card 1: Urgent Return Window */}
              <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#EF4444]/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626]">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return Deadline Closing</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#991B1B]">
                    48h Remaining
                  </span>
                </div>
                <h5 className="text-xs font-bold text-[#0B0F19]">Sony WH-1000XM5 ANC Headphones</h5>
                <p className="text-[11px] text-[#5F6673] mt-0.5">Amazon return cutoff Aug 19. Full ₹29,990 refund protected.</p>
              </div>

              {/* Card 2: Warranty Protection Meter */}
              <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#F59E0B]/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Warranty Expiring</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E]">
                    5 Days Left
                  </span>
                </div>
                <h5 className="text-xs font-bold text-[#0B0F19]">Apple MacBook Air M2</h5>
                <p className="text-[11px] text-[#5F6673] mt-0.5">Reliance Digital bill. Schedule hardware check before coverage ends.</p>
              </div>

              {/* Card 3: Spending & Tax Total */}
              <div className="p-4 rounded-xl bg-[#0B0F19] text-white shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A919D]">
                    Protected Vault Total
                  </span>
                  <div className="text-xl font-bold text-white tracking-tight mt-0.5">
                    ₹3,61,978
                  </div>
                  <span className="text-[10px] text-[#10B981] font-medium">
                    100% Verified GST Invoices
                  </span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
                  <Lock className="w-4 h-4 text-[#60A5FA]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* ----------------- RETAILER ECOSYSTEM LOGOS ----------------- */}
      <section className="py-10 border-y border-[#E5E7EB] bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#8A919D] mb-6">
            Trusted by consumers tracking purchases from India's top retailers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-bold text-[#5F6673]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs hover:text-[#0B0F19] transition-colors">
              <span className="text-[#2563EB]">●</span> Reliance Digital
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs hover:text-[#0B0F19] transition-colors">
              <span className="text-[#0B0F19]"></span> Apple Stores & Resellers
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs hover:text-[#0B0F19] transition-colors">
              <span className="text-[#FF9900]">▲</span> Amazon India
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs hover:text-[#0B0F19] transition-colors">
              <span className="text-[#059669]">●</span> Croma Electronics
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs hover:text-[#0B0F19] transition-colors">
              <span className="text-[#2874F0]">◆</span> Flipkart Supermart
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] shadow-2xs hover:text-[#0B0F19] transition-colors">
              <span className="text-[#0B0F19]">★</span> Samsung Official
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 02: LIVE INTERACTIVE OCR SCANNER ----------------- */}
      <section id="demo" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="glow" className="mb-3">
            Interactive Receipt Engine
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0F19]">
            Try Multimodal Vision on real bills
          </h2>
          <p className="text-base sm:text-lg text-[#5F6673] mt-3">
            Click any sample invoice below to watch Gemini extract line items, calculate tax splits, and pinpoint warranty deadlines in real time.
          </p>

          {/* Sample Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {sampleBills.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedDemoBill === idx
                    ? "bg-[#0B0F19] text-white shadow-xs"
                    : "bg-[#F7F8FA] hover:bg-[#F3F4F6] text-[#5F6673] border border-[#E5E7EB]"
                }`}
              >
                {sample.icon}
                <span>{sample.title.split("(")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive Scanner Card */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 sm:p-8 shadow-lg max-w-4xl mx-auto relative overflow-hidden">
          {isScanningDemo && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-3 animate-fade-in">
              <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-[#0B0F19]">
                Gemini Vision analyzing {currentSample.title}...
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Bill Receipt Simulation Visual */}
            <div className="md:col-span-5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 relative font-mono text-xs shadow-inner">
              <div className="border-b border-dashed border-[#CBD5E1] pb-3 mb-3 text-center">
                <div className="font-bold text-[#0B0F19] text-sm uppercase tracking-wider">
                  {currentSample.seller}
                </div>
                <div className="text-[10px] text-[#8A919D] mt-0.5">{currentSample.storeCity}</div>
                <div className="text-[10px] text-[#8A919D]">GSTIN: 27AACCR8941K1Z8</div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8A919D]">Invoice:</span>
                  <span className="font-bold text-[#0B0F19] bg-[#EFF6FF] px-1 rounded text-[#2563EB]">
                    {currentSample.invoiceNo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A919D]">Date:</span>
                  <span className="font-bold text-[#0B0F19]">{currentSample.date}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E5E7EB]">
                  <span className="font-semibold text-[#0B0F19]">{currentSample.title}</span>
                  <span className="font-bold text-[#0B0F19]">
                    ₹{currentSample.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#5F6673]">
                  <span>GST (18% included):</span>
                  <span>₹{currentSample.gst.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-[#CBD5E1] text-center text-[10px] text-[#8A919D]">
                *** WARRANTY VALIDATED BY BUYWISE ***
              </div>
            </div>

            {/* Structured Insights Output */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                    Extracted Metadata
                  </span>
                  <span className="text-xs text-[#059669] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 99.8% Precision
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0B0F19] mt-1">{currentSample.title}</h3>
                <p className="text-xs text-[#5F6673]">{currentSample.seller}</p>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#5F6673] font-semibold flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Warranty Status</span>
                  </div>
                  <div className="text-sm font-bold text-[#059669]">{currentSample.warrantyRemaining}</div>
                  <span className="text-[10px] text-[#8A919D] mt-0.5 block">{currentSample.warranty}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
                  <div className="text-[10px] text-[#5F6673] font-semibold flex items-center gap-1 mb-1">
                    <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Return Policy</span>
                  </div>
                  <div className="text-sm font-bold text-[#D97706]">{currentSample.returnRemaining}</div>
                  <span className="text-[10px] text-[#8A919D] mt-0.5 block">{currentSample.returnDays} Days policy</span>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="p-3.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF]">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-[#0B0F19]">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Automated AI Legal Insight</span>
                </div>
                <p className="leading-relaxed">{currentSample.insight}</p>
              </div>

              {/* Instant Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#5F6673]">Ready to index this in your private vault?</span>
                <button
                  type="button"
                  onClick={demoLogin}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Load into Demo Vault</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 03: VISUAL BENTO GRID FEATURES ----------------- */}
      <section id="features" className="py-20 bg-[#FAFAFA] border-y border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-2">
              Engineered for Modern Consumers
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B0F19]">
              Everything you need to protect your purchases
            </h2>
            <p className="text-sm sm:text-base text-[#5F6673] mt-2">
              No more searching through email attachments, dusty drawers, or faded thermal paper rolls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Multimodal OCR */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B0F19]">Snap, Upload & Done</h3>
                <p className="text-xs text-[#5F6673] mt-2 leading-relaxed">
                  Take a photo of any receipt or drop a PDF. Our multimodal engine recognizes retailer GSTIN, store address, item serial numbers, and line prices automatically.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Zero manual typing required</span>
              </div>
            </div>

            {/* Feature 2: Warranty Guardian */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B0F19]">Warranty Countdown Shield</h3>
                <p className="text-xs text-[#5F6673] mt-2 leading-relaxed">
                  Calculates official manufacturer coverage down to the exact day. Receive smart reminders at 30 days, 14 days, and 3 days before expiry to get free repairs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center gap-2 text-xs font-semibold text-[#059669]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Prevent ₹10k+ repair surprises</span>
              </div>
            </div>

            {/* Feature 3: Return Window Sentry */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B0F19]">Active Return Deadline Sentry</h3>
                <p className="text-xs text-[#5F6673] mt-2 leading-relaxed">
                  Tracks 7-day, 10-day, or 30-day merchant return windows. Flags products 48 hours before cutoff so you can exchange defective items hassle-free.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center gap-2 text-xs font-semibold text-[#D97706]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>100% full refund recovery</span>
              </div>
            </div>

            {/* Feature 4: GST & Tax Expense Hub */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] text-[#0B0F19] flex items-center justify-center mb-4">
                  <PieChart className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B0F19]">Tax & GST Claim Tracking</h3>
                <p className="text-xs text-[#5F6673] mt-2 leading-relaxed">
                  Automatic separation of base price and GST (CGST/SGST/IGST). Export clean spreadsheet summaries for accountant or business expense write-offs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center gap-2 text-xs font-semibold text-[#0B0F19]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>One-click CSV / PDF export</span>
              </div>
            </div>

            {/* Feature 5: Natural Language AI Claims Assistant */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs hover:border-[#D1D5DB] transition-all flex flex-col justify-between md:col-span-2">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0B0F19]">AI Service & Claim Letter Generator</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                    GEMINI POWERED
                  </span>
                </div>
                <p className="text-xs text-[#5F6673] mt-2 leading-relaxed">
                  Have an issue with a phone screen, TV panel, or laptop battery? Ask the AI Assistant to draft a formal warranty claim letter quoting your exact invoice number and retailer warranty clause.
                </p>

                {/* Micro claim prompt demo */}
                <div className="mt-4 p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col sm:flex-row items-center gap-2 text-xs">
                  <span className="text-[#5F6673] font-medium shrink-0">Sample Claim:</span>
                  <span className="bg-white px-2.5 py-1 rounded-md border border-[#E5E7EB] text-[#0B0F19] font-medium truncate flex-1">
                    "Draft AppleCare service request for MacBook Air M2 display flicker #RD-APL-88412"
                  </span>
                  <button
                    onClick={demoLogin}
                    className="text-[#2563EB] font-bold hover:underline shrink-0 text-xs cursor-pointer"
                  >
                    Try in App →
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
                <Check className="w-4 h-4 text-[#10B981]" />
                <span>Instant claim templates for Apple, Samsung, Sony & Reliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 04: INTERACTIVE ROI CALCULATOR ----------------- */}
      <section id="calculator" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="glow" className="mb-2">
            Value Calculator
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B0F19]">
            Estimate your annual recovery
          </h2>
          <p className="text-sm sm:text-base text-[#5F6673] mt-2">
            Calculate how much money you save by capturing valid warranty claims, refunding unwanted items on time, and tracking GST.
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#0B0F19]">
                  Annual High-Value Purchases (Appliances, Gadgets, Tech)
                </label>
                <span className="text-sm font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
                  {annualPurchasesCount} items / year
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="1"
                value={annualPurchasesCount}
                onChange={(e) => setAnnualPurchasesCount(Number(e.target.value))}
                className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[10px] text-[#8A919D] mt-1">
                <span>2 items</span>
                <span>12 items</span>
                <span>25 items</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#0B0F19]">
                  Average Price per Purchase
                </label>
                <span className="text-sm font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">
                  ₹{avgPurchaseValue.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={avgPurchaseValue}
                onChange={(e) => setAvgPurchaseValue(Number(e.target.value))}
                className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[10px] text-[#8A919D] mt-1">
                <span>₹5,000</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#5F6673] space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Average 1 in 7 electronics require servicing during warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Over ₹4,000 lost per household annually due to missed return windows</span>
              </div>
            </div>
          </div>

          {/* Results Summary Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0B0F19] text-white rounded-xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#93C5FD]">
                Estimated Annual Savings
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
                ₹{estimatedSavings.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-[#94A3B8] mt-2">
                Protected across {annualPurchasesCount} purchases totaling ₹{(annualPurchasesCount * avgPurchaseValue).toLocaleString("en-IN")}.
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>Warranty Repairs Covered:</span>
                  <span className="font-bold text-white">
                    ₹{Math.round(annualPurchasesCount * avgPurchaseValue * 0.09).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>Timed Return Recoveries:</span>
                  <span className="font-bold text-white">
                    ₹{Math.round(annualPurchasesCount * avgPurchaseValue * 0.05).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>GST Tax Credits Tracked:</span>
                  <span className="font-bold text-white">
                    ₹{Math.round(annualPurchasesCount * avgPurchaseValue * 0.18).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (currentUser ? navigateToApp() : openAuthModal("signup"))}
              className="mt-6 w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Start Saving with Free Vault
            </button>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 05: PRICING PLANS ----------------- */}
      <section id="pricing" className="py-20 bg-[#FAFAFA] border-y border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-2">
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B0F19]">
              Simple plans for individuals & families
            </h2>
            <p className="text-sm sm:text-base text-[#5F6673] mt-2">
              Free forever for standard users. Upgrade only when you need unlimited OCR and multi-device vaults.
            </p>

            {/* Toggle */}
            <div className="mt-6 inline-flex items-center p-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#0B0F19] text-white"
                    : "text-[#5F6673] hover:text-[#0B0F19]"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-[#0B0F19] text-white"
                    : "text-[#5F6673] hover:text-[#0B0F19]"
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] font-bold text-[#10B981] bg-[#ECFDF5] px-1.5 py-0.2 rounded-full border border-[#A7F3D0]">
                  Save 25%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1: Free Starter */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-base font-bold text-[#0B0F19]">Starter Vault</h3>
                <p className="text-xs text-[#5F6673] mt-1">For casual shopping tracking</p>
                <div className="my-5">
                  <span className="text-3xl font-bold text-[#0B0F19]">₹0</span>
                  <span className="text-xs text-[#8A919D]"> / forever</span>
                </div>
                <div className="space-y-2.5 text-xs text-[#5F6673] pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Up to 15 Receipts / Year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Standard Gemini OCR Scanning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Warranty & Return Deadline Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Basic Spending Analytics</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => (currentUser ? navigateToApp() : openAuthModal("signup"))}
                className="mt-6 w-full py-2.5 bg-[#F7F8FA] hover:bg-[#F3F4F6] text-[#0B0F19] text-xs font-bold rounded-lg border border-[#E5E7EB] transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Tier 2: Pro Intelligence (Featured) */}
            <div className="bg-white border-2 border-[#2563EB] rounded-2xl p-6 flex flex-col justify-between shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B0F19]">Pro Intelligence</h3>
                <p className="text-xs text-[#5F6673] mt-1">Unlimited OCR & AI Claims Assistant</p>
                <div className="my-5">
                  <span className="text-3xl font-bold text-[#0B0F19]">
                    {billingCycle === "yearly" ? "₹149" : "₹199"}
                  </span>
                  <span className="text-xs text-[#8A919D]"> / month</span>
                </div>
                <div className="space-y-2.5 text-xs text-[#5F6673] pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2 font-semibold text-[#0B0F19]">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Unlimited Invoices & PDF Scans</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-[#0B0F19]">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Gemini AI Claims & Service Letter Drafter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>SMS & WhatsApp Urgent Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>GST Tax Export & Line Breakdowns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Priority Multi-Device Sync</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => (currentUser ? navigateToApp() : openAuthModal("signup"))}
                className="mt-6 w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Tier 3: Family / Business */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-base font-bold text-[#0B0F19]">Family Vault</h3>
                <p className="text-xs text-[#5F6673] mt-1">Multi-user household coverage</p>
                <div className="my-5">
                  <span className="text-3xl font-bold text-[#0B0F19]">
                    {billingCycle === "yearly" ? "₹349" : "₹449"}
                  </span>
                  <span className="text-xs text-[#8A919D]"> / month</span>
                </div>
                <div className="space-y-2.5 text-xs text-[#5F6673] pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Up to 5 Family Member Accounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Shared Household Appliance Vault</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Unlimited AI Claims Generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Dedicated Priority Support</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => (currentUser ? navigateToApp() : openAuthModal("signup"))}
                className="mt-6 w-full py-2.5 bg-[#F7F8FA] hover:bg-[#F3F4F6] text-[#0B0F19] text-xs font-bold rounded-lg border border-[#E5E7EB] transition-colors cursor-pointer"
              >
                Choose Family Vault
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 06: FAQ ACCORDION ----------------- */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-2">
            Questions & Answers
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B0F19]">
            Frequently asked questions
          </h2>
          <p className="text-sm text-[#5F6673] mt-2">
            Everything you need to know about bill extraction, privacy, and warranty alerts.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.number}
                className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAFAFA]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      {faq.number}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#0B0F19]">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8A919D] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#2563EB]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5F6673] leading-relaxed border-t border-[#F3F4F6]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- SECTION 07: FOOTER HERO CTA ----------------- */}
      <section className="py-20 bg-[#0B0F19] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.25)_0%,_rgba(11,15,25,0)_70%)] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#2563EB]/40">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Protect your purchases starting today.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto mt-4 leading-relaxed">
            Join thousands of smart shoppers who never miss a return window or pay out-of-pocket for warranty repairs.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => (currentUser ? navigateToApp() : openAuthModal("signup"))}
              className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#2563EB]/30 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>{currentUser ? "Go to Dashboard" : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={demoLogin}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white text-sm font-bold rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#60A5FA]" />
              <span>Instant Demo Access</span>
            </button>
          </div>

          {/* Footer Bottom Links */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">BuyWise AI</span>
              <span>• Complete Purchase & Warranty Protection</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <span className="text-[#64748B]">© 2026 BuyWise</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
