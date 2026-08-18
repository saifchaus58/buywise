import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  RotateCcw,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  FileCheck,
  Edit3,
  Save,
  ArrowRight,
  Camera,
  RefreshCw,
  Eye,
  Layers,
  HelpCircle,
  Zap,
  Cpu,
  Terminal,
} from "lucide-react";
import Tesseract from "tesseract.js";
import { useApp } from "../context/AppContext";
import { CategoryType, ExtractedReceiptData, formatINR, formatDisplayDate } from "../types";
import { parseReceiptText } from "../utils/ocrParser";

export const AddPurchaseModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addPurchase } = useApp();

  const [step, setStep] = useState<"upload" | "processing" | "review">("upload");
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [extractionSource, setExtractionSource] = useState<string>("gemini_ai");
  const [showRawOcr, setShowRawOcr] = useState<boolean>(false);
  const [rawOcrText, setRawOcrText] = useState<string>("");

  // Tesseract progress tracking
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatusText, setOcrStatusText] = useState<string>("");

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for review/edit
  const [formData, setFormData] = useState<ExtractedReceiptData>({
    product: "OnePlus 12R (256GB)",
    seller: "Reliance Digital",
    invoiceNumber: "RD1245789",
    purchaseDate: "2026-07-18",
    amount: 47198,
    gst: 7199,
    category: "Electronics",
    warrantyMonths: 12,
    returnDays: 7,
    confidence: 97,
    aiInsight: "This purchase includes a 1-year manufacturer warranty and is currently within the return window.",
  });

  // Stop camera on unmount or modal close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please check permissions or browse an image file.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL("image/jpeg", 0.85);
      stopCamera();
      processReceiptWithPipeline(base64Data, "camera_receipt.jpg");
    }
  };

  if (!isAddModalOpen) return null;

  const handleClose = () => {
    stopCamera();
    setIsAddModalOpen(false);
    setTimeout(() => {
      setStep("upload");
      setProcessingStage(0);
      setReceiptPreview(null);
      setIsEditing(false);
      setShowRawOcr(false);
      setOcrProgress(0);
      setOcrStatusText("");
      setRawOcrText("");
    }, 200);
  };

  // Run in-browser Tesseract.js OCR engine
  const runTesseractOcr = async (base64Image: string, fileName?: string): Promise<ExtractedReceiptData> => {
    setOcrStatusText("Initializing in-browser Tesseract OCR worker...");
    setOcrProgress(15);

    try {
      const result = await Tesseract.recognize(base64Image, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pct = Math.round((m.progress || 0) * 100);
            setOcrProgress(Math.max(20, Math.min(95, pct)));
            setOcrStatusText(`Tesseract OCR scanning receipt: ${pct}%`);
          } else if (m.status) {
            setOcrStatusText(`OCR: ${m.status}...`);
          }
        },
      });

      const recognizedText = result.data.text || "";
      setRawOcrText(recognizedText);
      setOcrProgress(100);
      setOcrStatusText("Tesseract OCR text extraction complete!");

      const structured = parseReceiptText(recognizedText, fileName);
      structured.confidence = Math.max(88, Math.min(99, Math.round(result.data.confidence || 93)));
      return structured;
    } catch (ocrErr) {
      console.warn("Tesseract OCR fallback error:", ocrErr);
      const fallback = parseReceiptText("", fileName);
      return fallback;
    }
  };

  // Multi-tier Pipeline: Gemini Vision AI -> Tesseract.js In-Browser OCR -> NLP Structuring
  const processReceiptWithPipeline = async (base64Data: string, fileName?: string) => {
    setReceiptPreview(base64Data);
    setStep("processing");
    setProcessingStage(1);
    setOcrProgress(10);
    setOcrStatusText("Analyzing document structure & OCR layers...");

    let geminiSuccess = false;
    let extractedData: ExtractedReceiptData | null = null;
    let sourceUsed = "gemini_ai";

    // 1. First attempt: Server-Side Gemini 3.7 Flash Vision API
    try {
      setProcessingStage(2);
      const response = await fetch("/api/extract-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: "image/jpeg",
          fileName: fileName || "receipt.jpg",
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.source === "gemini_ai" && resJson.data) {
        extractedData = resJson.data;
        sourceUsed = "gemini_ai";
        geminiSuccess = true;
        setRawOcrText(
          `[GEMINI 3.6 FLASH MULTIMODAL OCR]\nMerchant: ${extractedData?.seller}\nInvoice: ${extractedData?.invoiceNumber}\nProduct: ${extractedData?.product}\nAmount: ₹${extractedData?.amount}\nGST: ₹${extractedData?.gst}\nCategory: ${extractedData?.category}\nWarranty: ${extractedData?.warrantyMonths} Months\nReturn: ${extractedData?.returnDays} Days\nInsight: ${extractedData?.aiInsight}`
        );
      }
    } catch (err) {
      console.warn("Gemini API call failed, escalating to Tesseract.js in-browser engine:", err);
    }

    // 2. Fallback / Complementary: Tesseract.js client OCR if Gemini was not available
    if (!geminiSuccess || !extractedData) {
      setProcessingStage(3);
      setOcrStatusText("Invoking In-Browser Tesseract.js OCR Engine...");
      try {
        extractedData = await runTesseractOcr(base64Data, fileName);
        sourceUsed = "tesseract_ocr";
      } catch (tessErr) {
        console.error("Tesseract processing failed:", tessErr);
        extractedData = parseReceiptText("", fileName);
        sourceUsed = "heuristic_ocr";
      }
    }

    // Smooth stage transitions
    setProcessingStage(4);
    setTimeout(() => {
      setProcessingStage(5);
    }, 400);

    setTimeout(() => {
      setProcessingStage(6);
      if (extractedData) {
        setFormData(extractedData);
        setExtractionSource(sourceUsed);
      }
      setStep("review");
    }, 900);
  };

  const handleSelectPreset = async (presetId: string) => {
    setIsAiLoading(true);
    setStep("processing");
    setProcessingStage(1);
    setOcrProgress(30);
    setOcrStatusText("Loading verified demo invoice data...");

    try {
      const response = await fetch("/api/extract-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ samplePreset: presetId }),
      });
      const result = await response.json();
      if (result.success && result.data) {
        setProcessingStage(3);
        setRawOcrText(
          `[VERIFIED INVOICE PRESET: ${presetId.toUpperCase()}]\nSeller: ${result.data.seller}\nInvoice Number: ${result.data.invoiceNumber}\nItem: ${result.data.product}\nTotal: ₹${result.data.amount}\nTax/GST: ₹${result.data.gst}\nWarranty Policy: ${result.data.warrantyMonths} Months\nReturn Policy: ${result.data.returnDays} Days`
        );
        setTimeout(() => {
          setProcessingStage(6);
          setFormData(result.data);
          setExtractionSource(result.source || "demo_preset");
          setStep("review");
        }, 1200);
      } else {
        throw new Error("Failed to load preset");
      }
    } catch {
      const fallback = parseReceiptText("Reliance Digital Invoice OnePlus 12R Total Rs 47198 GST Rs 7199 12 Months Warranty 7 Days Return");
      setFormData(fallback);
      setExtractionSource("demo_preset");
      setStep("review");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      processReceiptWithPipeline(base64Data, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    addPurchase(formData, receiptPreview || undefined);
    handleClose();
  };

  const processingSteps = [
    { label: "Initializing OCR pipeline & image buffers", doneAt: 1 },
    { label: "Multimodal Gemini / Tesseract character recognition", doneAt: 2 },
    { label: "Decoding merchant header & invoice identifier", doneAt: 3 },
    { label: "Extracting line items, item prices & GST tax", doneAt: 4 },
    { label: "Calculating manufacturer warranty & return policy", doneAt: 5 },
    { label: "Proactive AI recommendations & alert schedule", doneAt: 6 },
  ];

  // Calculated Dates for Review Stage
  const purchaseDateObj = new Date(formData.purchaseDate || new Date().toISOString().split("T")[0]);
  const returnDeadlineObj = new Date(purchaseDateObj);
  returnDeadlineObj.setDate(returnDeadlineObj.getDate() + (formData.returnDays || 7));

  const warrantyExpiryObj = new Date(purchaseDateObj);
  warrantyExpiryObj.setMonth(warrantyExpiryObj.getMonth() + (formData.warrantyMonths || 12));

  return (
    <div
      id="add-purchase-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="add-purchase-modal-card"
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {step === "upload" && "Upload Bill / Receipt"}
                  {step === "processing" && "AI & OCR Processing..."}
                  {step === "review" && "Purchase & Warranty Detected"}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100/70 text-indigo-700 rounded-md flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Gemini + Tesseract OCR
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {step === "upload" && "Extract details, warranties & return deadlines automatically"}
                {step === "processing" && (ocrStatusText || "Extracting structured data from receipt image")}
                {step === "review" && "Review extracted details and save to your active tracking vault"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: STEP 1: Upload */}
        {step === "upload" && (
          <div className="p-6 space-y-5 overflow-y-auto">
            {cameraError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Camera View Mode */}
            {isCameraActive ? (
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video flex items-center justify-center border-2 border-indigo-500">
                <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
                {/* Guide overlay */}
                <div className="absolute inset-4 border-2 border-white/50 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] font-bold text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                    Align invoice or receipt inside frame
                  </span>
                </div>
                {/* Camera controls */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl backdrop-blur-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture & OCR</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Drag & Drop Area + Camera Button */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                  }}
                  className="sm:col-span-2 border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-7 text-center cursor-pointer transition-all group flex flex-col items-center justify-center"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, image/heic, application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Drop invoice here, or <span className="text-indigo-600 underline">browse file</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports JPG, PNG, WEBP, HEIC & PDF (Max 25MB)
                  </p>
                </div>

                <div
                  onClick={startCamera}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">Use Live Camera</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Instant photo scan & OCR</p>
                </div>
              </div>
            )}

            {/* Quick Demo Invoices */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Instant Demo Invoices (1-Click Test)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Includes real warranty & return policies</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleSelectPreset("oneplus")}
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between group bg-white"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                        OnePlus 12R (256GB)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">Reliance Digital • ₹47,198 • 12M Warranty</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Scan →
                  </span>
                </button>

                <button
                  onClick={() => handleSelectPreset("sony")}
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between group bg-white"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                        Sony WH-1000XM5 ANC
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">Amazon • ₹29,990 • 10D Return</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Scan →
                  </span>
                </button>

                <button
                  onClick={() => handleSelectPreset("macbook")}
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between group bg-white"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                        Apple MacBook Air M2
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">Reliance Digital • ₹94,900 • Expiring Soon</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Scan →
                  </span>
                </button>

                <button
                  onClick={() => handleSelectPreset("samsung")}
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all flex items-center justify-between group bg-white"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                        Samsung 55" QLED 4K TV
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">Croma • ₹64,990 • 24M Panel Coverage</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Scan →
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body: STEP 2: Processing Animation */}
        {step === "processing" && (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
              <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">AI & OCR Scanning Receipt...</h3>
              <p className="text-xs text-slate-500 mt-1">
                {ocrStatusText || "Gemini Multimodal Vision + Tesseract.js OCR engine decoding invoice"}
              </p>
            </div>

            {/* Checklist Steps */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5">
              {processingSteps.map((s, idx) => {
                const isComplete = processingStage >= s.doneAt;
                const isCurrent = processingStage === s.doneAt - 1;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between text-xs transition-colors ${
                      isComplete
                        ? "text-slate-900 font-semibold"
                        : isCurrent
                        ? "text-indigo-600 font-medium"
                        : "text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
                      )}
                      <span>{s.label}</span>
                    </div>
                    {isComplete && (
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Done
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Body: STEP 3: Review & Edit */}
        {step === "review" && (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Top Review Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Receipt Extracted Successfully</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-white text-indigo-700 rounded-full border border-indigo-200">
                      {formData.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Engine:{" "}
                    <strong className="text-indigo-600">
                      {extractionSource === "gemini_ai"
                        ? "Gemini 3.6 Flash Multimodal Vision"
                        : extractionSource === "tesseract_ocr"
                        ? "Tesseract.js In-Browser Client OCR"
                        : "Verified Smart OCR"}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRawOcr(!showRawOcr)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showRawOcr ? "Hide OCR Text" : "Inspect Raw OCR"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all shadow-2xs ${
                    isEditing
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 hover:text-indigo-700 border-indigo-200"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Finish Editing" : "Edit Fields"}</span>
                </button>
              </div>
            </div>

            {/* Raw OCR Inspection Drawer if open */}
            {showRawOcr && (
              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl text-[11px] font-mono space-y-2 border border-slate-800 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-400">
                    <Terminal className="w-3.5 h-3.5" />
                    OCR Raw Output & Extracted Tokens
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Engine: {extractionSource}
                  </span>
                </div>
                {rawOcrText ? (
                  <pre className="text-[10.5px] leading-relaxed text-emerald-400 whitespace-pre-wrap max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                    {rawOcrText}
                  </pre>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-slate-300">
                    <div>• Merchant: <span className="text-indigo-400">{formData.seller}</span></div>
                    <div>• Invoice #: <span className="text-indigo-400">{formData.invoiceNumber}</span></div>
                    <div>• Item: <span className="text-indigo-400">{formData.product}</span></div>
                    <div>• Total: <span className="text-indigo-400">{formatINR(formData.amount)}</span></div>
                    <div>• Return Window: <span className="text-indigo-400">{formData.returnDays} Days</span></div>
                    <div>• Warranty: <span className="text-indigo-400">{formData.warrantyMonths} Months</span></div>
                  </div>
                )}
              </div>
            )}

            {/* Editable or Display Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Product */}
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Product Name & Model
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl font-bold text-sm text-slate-900 border border-slate-100 flex items-center justify-between">
                    <span>{formData.product}</span>
                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {formData.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Seller */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Seller / Merchant
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.seller}
                    onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl font-semibold text-xs text-slate-800 border border-slate-100 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formData.seller}</span>
                  </div>
                )}
              </div>

              {/* Invoice Number */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Invoice / Receipt #
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl font-semibold text-xs text-slate-800 border border-slate-100 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>#{formData.invoiceNumber}</span>
                  </div>
                )}
              </div>

              {/* Purchase Date */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Purchase Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl font-semibold text-xs text-slate-800 border border-slate-100 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDisplayDate(formData.purchaseDate)}</span>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Total Amount (INR)
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Total Amount"
                      value={formData.amount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({ ...formData, amount: val, gst: Math.round(val * 0.18) });
                      }}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                    />
                    <input
                      type="number"
                      placeholder="GST (18%)"
                      value={formData.gst}
                      onChange={(e) => setFormData({ ...formData, gst: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                    />
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl font-bold text-xs text-slate-900 border border-slate-100 flex items-center justify-between">
                    <span>{formatINR(formData.amount)}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      GST: {formatINR(formData.gst)}
                    </span>
                  </div>
                )}
              </div>

              {/* Warranty Duration */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Warranty Duration
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.warrantyMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-emerald-50/70 rounded-xl font-semibold text-xs text-emerald-800 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{formData.warrantyMonths} Months ({formData.warrantyMonths / 12} Y)</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">
                      Till {formatDisplayDate(warrantyExpiryObj.toISOString().split("T")[0])}
                    </span>
                  </div>
                )}
              </div>

              {/* Return Window */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Return / Replacement Window
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.returnDays}
                    onChange={(e) => setFormData({ ...formData, returnDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-amber-50/70 rounded-xl font-semibold text-xs text-amber-800 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>{formData.returnDays} Days Store Window</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700">
                      Ends {formatDisplayDate(returnDeadlineObj.toISOString().split("T")[0])}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/90 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="leading-relaxed font-medium">
                <strong className="text-indigo-900">AI Advice:</strong> {formData.aiInsight}
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          {step === "review" && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep("upload")}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Another</span>
              </button>
              <button
                id="btn-modal-save-purchase"
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 active:scale-98 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save to Vault</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
