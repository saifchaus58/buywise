export type CategoryType =
  | "Electronics"
  | "Appliances"
  | "Accessories"
  | "Computers & Office"
  | "Home & Kitchen"
  | "Others";

export type StatusType = "active" | "expiring_soon" | "expired";

export interface Purchase {
  id: string;
  product: string;
  seller: string;
  category: CategoryType;
  invoiceNumber: string;
  purchaseDate: string; // YYYY-MM-DD
  amount: number;
  gst: number;
  warrantyMonths: number;
  returnDays: number;
  confidence: number;
  receiptImage?: string;
  notes?: string;
  serialNumber?: string;
  paymentMethod?: string;
  aiInsight?: string;
  createdAt: string;
}

export interface ExtractedReceiptData {
  product: string;
  seller: string;
  invoiceNumber: string;
  purchaseDate: string;
  amount: number;
  gst: number;
  category: CategoryType;
  warrantyMonths: number;
  returnDays: number;
  confidence: number;
  aiInsight?: string;
}

export interface NotificationItem {
  id: string;
  type: "return" | "warranty" | "purchase" | "savings" | "system";
  title: string;
  message: string;
  purchaseId?: string;
  productName?: string;
  urgency: "urgent" | "warning" | "info" | "success";
  date: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "Free Starter" | "Pro Shopper" | "Enterprise Vault";
  joinedDate: string;
  isPro: boolean;
}

export type AppView = "landing" | "app";
export type AuthMode = "signin" | "signup" | "forgot_password";

export type ActiveTab =
  | "dashboard"
  | "purchases"
  | "warranties"
  | "bills"
  | "returns"
  | "insights"
  | "assistant"
  | "notifications"
  | "settings";

// --- Date & Deadline Calculation Utilities ---

// Reference mock date anchor (Aug 17, 2026) for accurate relative deadlines
export const REFERENCE_DATE = new Date("2026-08-17T00:00:00");

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day || 1);
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const d = parseISODate(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatINR(amount: number): string {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

export function getReturnDeadlineDate(purchaseDate: string, returnDays: number): Date {
  const d = parseISODate(purchaseDate);
  d.setDate(d.getDate() + returnDays);
  return d;
}

export function getWarrantyExpiryDate(purchaseDate: string, warrantyMonths: number): Date {
  const d = parseISODate(purchaseDate);
  d.setMonth(d.getMonth() + warrantyMonths);
  return d;
}

export function getDaysRemainingFromTarget(targetDate: Date, currentDate: Date = REFERENCE_DATE): number {
  const msDiff = targetDate.getTime() - currentDate.getTime();
  return Math.ceil(msDiff / (1000 * 60 * 60 * 24));
}

export function getReturnStatus(purchaseDate: string, returnDays: number): {
  deadlineDate: Date;
  deadlineStr: string;
  daysRemaining: number;
  status: "active" | "expiring_soon" | "expired";
  statusLabel: string;
} {
  const deadlineDate = getReturnDeadlineDate(purchaseDate, returnDays);
  const daysRemaining = getDaysRemainingFromTarget(deadlineDate);
  const deadlineStr = deadlineDate.toISOString().split("T")[0];

  let status: "active" | "expiring_soon" | "expired" = "active";
  let statusLabel = `${daysRemaining} days remaining`;

  if (daysRemaining < 0) {
    status = "expired";
    statusLabel = "Return Expired";
  } else if (daysRemaining <= 3) {
    status = "expiring_soon";
    statusLabel = `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left!`;
  } else {
    status = "active";
    statusLabel = `${daysRemaining} days left`;
  }

  return { deadlineDate, deadlineStr, daysRemaining, status, statusLabel };
}

export function getWarrantyStatus(purchaseDate: string, warrantyMonths: number): {
  expiryDate: Date;
  expiryStr: string;
  daysRemaining: number;
  status: "active" | "expiring_soon" | "expired";
  statusLabel: string;
} {
  const expiryDate = getWarrantyExpiryDate(purchaseDate, warrantyMonths);
  const daysRemaining = getDaysRemainingFromTarget(expiryDate);
  const expiryStr = expiryDate.toISOString().split("T")[0];

  let status: "active" | "expiring_soon" | "expired" = "active";
  let statusLabel = `${daysRemaining} days remaining`;

  if (daysRemaining < 0) {
    status = "expired";
    statusLabel = "Expired";
  } else if (daysRemaining <= 30) {
    status = "expiring_soon";
    statusLabel = `${daysRemaining} days remaining`;
  } else {
    status = "active";
    statusLabel = `${daysRemaining} days remaining`;
  }

  return { expiryDate, expiryStr, daysRemaining, status, statusLabel };
}
