# 🛍️ BuyWise AI

### AI-Powered Smart Purchase & Warranty Manager

> **Don't just store your receipts. Know what to do next.**

BuyWise AI is a full-stack AI-powered purchase management platform that transforms bills and receipts into structured purchase data, automatically tracks return deadlines and warranties, analyzes spending, and provides actionable insights through an AI purchase assistant.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem Statement](#-problem-statement)
* [Our Solution](#-our-solution)
* [Key Features](#-key-features)
* [How It Works](#-how-it-works)
* [AI Receipt Intelligence](#-ai-receipt-intelligence)
* [Purchase Lifecycle](#-purchase-lifecycle)
* [AI Purchase Assistant](#-ai-purchase-assistant)
* [Analytics](#-analytics)
* [System Architecture](#-system-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Running the Project](#-running-the-project)
* [API Overview](#-api-overview)
* [Data Model](#-data-model)
* [AI Prompt Strategy](#-ai-prompt-strategy)
* [Deadline Intelligence](#-deadline-intelligence)
* [Error Handling](#-error-handling)
* [Demo Mode](#-demo-mode)
* [Security](#-security)
* [Future Scope](#-future-scope)
* [Hackathon Demo](#-hackathon-demo)
* [Contributing](#-contributing)
* [License](#-license)

---

# 🎯 Overview

People purchase products every day, but managing everything after the purchase is difficult.

Bills are scattered across:

* 📱 Phone galleries
* 📧 Emails
* 💬 WhatsApp
* 📄 Physical documents
* 🛒 E-commerce platforms

Important information such as:

* Purchase date
* Invoice number
* Product price
* Return period
* Warranty period
* Seller
* GST

is often difficult to find when it is actually needed.

### BuyWise AI solves this problem by turning every receipt into an intelligent purchase record.

```text
Receipt
   ↓
AI Understanding
   ↓
Structured Purchase Data
   ↓
Warranty + Return Tracking
   ↓
Spending Analytics
   ↓
Smart Alerts
   ↓
AI Assistant
   ↓
User Action
```

---

# ❗ Problem Statement

### "Build an AI-powered application that helps users manage their purchases, bills, receipts, warranties and return deadlines in one place."

The system should:

* Extract useful information from bills and receipts.
* Track purchases.
* Track warranty periods.
* Track return deadlines.
* Analyze spending.
* Notify users about important upcoming events.
* Provide useful AI-powered insights.

---

# 💡 Our Solution

BuyWise AI is designed as a **purchase lifecycle management platform**.

Instead of simply storing a receipt:

```text
Receipt → Storage
```

we transform it into:

```text
Receipt
   ↓
AI Extraction
   ↓
Structured Data
   ↓
Validation
   ↓
Deadline Calculation
   ↓
Analytics
   ↓
Actionable Insights
```

### Core philosophy

> **AI understands the document.
> Deterministic software calculates the important dates.
> Analytics turns data into decisions.**

---

# ✨ Key Features

## 📄 1. AI Receipt Scanner

Upload:

* JPG
* PNG
* WebP
* PDF where supported

The AI extracts:

* Product name
* Seller
* Invoice number
* Purchase date
* Price
* GST
* Category
* Warranty
* Return period

---

## 🤖 2. AI-Powered Extraction

The uploaded receipt is analyzed using a multimodal AI model.

Example:

### Input

```text
Receipt / Invoice Image
```

### Output

```json
{
  "product": "Apple MacBook Air M3",
  "seller": "Croma",
  "invoiceNumber": "CRO-26-27-19384",
  "purchaseDate": "2026-08-12",
  "amount": 123898,
  "gst": 18899,
  "category": "Electronics",
  "warrantyMonths": 12,
  "returnDays": 7,
  "confidence": 0.97
}
```

The structured data is then validated before being stored.

---

# 🛡️ 3. Warranty Management

BuyWise AI automatically tracks warranty information.

Example:

```text
Apple MacBook Air M3

Warranty:
12 Months

Purchased:
12 Aug 2026

Expires:
12 Aug 2027

Status:
🟢 Active
```

Possible statuses:

* 🟢 Active
* 🟠 Expiring Soon
* 🔴 Expired

---

# ↩️ 4. Return Deadline Tracking

The system calculates return deadlines automatically.

Example:

```text
Purchase Date
12 Aug 2026

Return Period
7 Days

↓

Return Deadline
19 Aug 2026
```

Instead of displaying only a date, the application provides actionable information:

> ⚠️ Return window closes in 2 days.

---

# ⚡ 5. Action Center

The Action Center is one of the core features.

It prioritizes information that requires user attention.

Example:

```text
⚡ ACTION CENTER

🔴 Return Deadline
Canon EOS R50
2 days remaining

🟠 Warranty
Dyson V12
7 days remaining

🟣 Spending Insight
54% of demo spending is electronics
```

The goal is to answer:

> **"What do I need to do right now?"**

---

# 💰 6. Spending Analytics

Once receipts become structured data, BuyWise AI can analyze spending.

Example demo dataset:

```text
Total Spending
₹1,24,560

Electronics
54%

Appliances
23%

Accessories
12%

Others
11%
```

Analytics include:

* Total spending
* Category-wise spending
* Purchase trends
* Highest-value purchases
* Monthly comparisons
* Spending distribution

Charts are rendered using Recharts.

---

# ✨ 7. AI Purchase Assistant

Users can interact with their purchase history using natural language.

Example questions:

```text
Which warranties expire soon?

How much did I spend on electronics?

Which product was my most expensive purchase?

Can I still return my camera?

Which purchases need my attention?
```

Example response:

> You currently have 3 purchases requiring attention: 2 warranties expire soon and 1 return window closes in 2 days.

This provides **natural-language analytics over structured purchase data**.

---

# 🔔 8. Smart Notifications

The system can surface:

### Return notifications

> 🔴 Your return window closes soon.

### Warranty notifications

> 🟠 Your warranty expires in 7 days.

### Purchase notifications

> 🟢 Purchase successfully added.

---

# 🔍 9. Purchase Search

Users can search their purchase history by:

* Product
* Seller
* Invoice number
* Category

Example:

```text
Search: Sony
```

returns all Sony purchases.

---

# 🧠 How It Works

The complete user journey:

```text
                USER
                  │
                  ▼
           Upload Receipt
                  │
                  ▼
            File Validation
                  │
                  ▼
          Gemini Vision AI
                  │
                  ▼
        Structured JSON Data
                  │
                  ▼
             Validation
                  │
                  ▼
          User Confirmation
                  │
                  ▼
          Purchase Database
                  │
        ┌─────────┼──────────┐
        ▼         ▼          ▼
    Warranty   Returns    Spending
        │         │          │
        └─────────┼──────────┘
                  ▼
            Action Center
                  │
                  ▼
          AI Purchase Assistant
```

---

# 🤖 AI Receipt Intelligence

The receipt extraction system follows a structured pipeline.

## Step 1 — File Upload

The user uploads a receipt.

The application identifies:

```text
File Type
File Size
MIME Type
```

---

## Step 2 — AI Processing

The actual uploaded document is sent to the multimodal AI model.

The AI receives:

1. Extraction instructions
2. Receipt image/document data
3. Required JSON schema

---

## Step 3 — Structured Extraction

The AI returns structured information.

```json
{
  "product": "",
  "seller": "",
  "invoiceNumber": "",
  "purchaseDate": "",
  "amount": 0,
  "gst": 0,
  "category": "",
  "warrantyMonths": 0,
  "returnDays": 0,
  "confidence": 0
}
```

---

## Step 4 — Validation

Before saving, the application validates:

* Required fields
* Numeric values
* Date formats
* JSON structure
* Missing information

If information is unavailable, the application should not invent it.

---

# 🗓️ Purchase Lifecycle

Every purchase becomes a timeline.

Example:

```text
12 AUG 2026
     │
     ▼
  PURCHASE
     │
     ├──────────────► 19 AUG
     │                RETURN ENDS
     │
     │
     └────────────────────────►
                              12 AUG 2027
                              WARRANTY ENDS
```

This allows BuyWise AI to proactively monitor important dates.

---

# 🧮 Deadline Intelligence

A key engineering principle is:

### AI extracts the inputs.

### Code calculates the deadlines.

Example:

```javascript
returnDeadline =
    purchaseDate + returnDays;

warrantyExpiry =
    purchaseDate + warrantyMonths;
```

This is preferable to asking an LLM to calculate important dates because deterministic logic is predictable and testable.

---

# 📊 Analytics Engine

Once purchase data is structured, analytics can be calculated.

### Total Spending

```text
SUM(purchase.amount)
```

### Category Spending

```text
GROUP BY category
```

### Warranty Status

```text
warrantyExpiry - currentDate
```

### Return Status

```text
returnDeadline - currentDate
```

### Example statuses

```text
daysRemaining > 30
→ ACTIVE

daysRemaining <= 30
→ EXPIRING_SOON

daysRemaining < 0
→ EXPIRED
```

---

# 🏗️ System Architecture

```text
                     BUYWISE AI
                          │
                          ▼
                 ┌─────────────────┐
                 │ React + Vite UI │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Node + Express  │
                 └────────┬────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
         Gemini AI     MongoDB    LocalStorage
              │
              ▼
      Receipt Extraction
              │
              ▼
       Structured JSON
              │
              ▼
          Validation
              │
              ▼
       Deadline Engine
              │
              ▼
     Analytics + Alerts
              │
              ▼
       AI Assistant
```

---

# 🛠️ Technology Stack

| Layer             | Technology           |
| ----------------- | -------------------- |
| Frontend          | React                |
| Build Tool        | Vite                 |
| Styling           | CSS                  |
| Icons             | Lucide React         |
| Charts            | Recharts             |
| Backend           | Node.js              |
| API               | Express.js           |
| AI                | Gemini Multimodal AI |
| Database          | MongoDB              |
| Local Persistence | LocalStorage         |
| Version Control   | Git + GitHub         |

---

# 📁 Project Structure

A recommended structure:

```text
buywise-ai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── ReceiptUpload/
│   │   │   ├── PurchaseList/
│   │   │   ├── Warranty/
│   │   │   ├── Returns/
│   │   │   ├── Analytics/
│   │   │   └── AIAssistant/
│   │   │
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── data/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   │   └── gemini.js
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

Adapt this structure to the actual implementation if the project uses a different organization.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/buywise-ai.git
cd buywise-ai
```

---

## 2. Install frontend dependencies

```bash
cd client
npm install
```

---

## 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

If the frontend directly uses Vite environment variables, use the project's configured variable name, for example:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### ⚠️ Never commit your actual API key.

Add `.env` to `.gitignore`.

Use:

```text
.env
.env.local
node_modules/
dist/
```

---

# ▶️ Running the Project

## Start backend

```bash
cd server
npm run dev
```

or:

```bash
npm start
```

---

## Start frontend

Open another terminal:

```bash
cd client
npm run dev
```

Then open the local Vite URL shown in the terminal.

---

# 🔌 API Overview

A typical API design:

## Upload / Extract Receipt

```http
POST /api/receipts/extract
```

Purpose:

Send an uploaded receipt to the AI extraction service.

---

## Create Purchase

```http
POST /api/purchases
```

Creates a purchase record.

---

## Get Purchases

```http
GET /api/purchases
```

Returns the user's purchases.

---

## Get Purchase

```http
GET /api/purchases/:id
```

Returns a single purchase.

---

## Update Purchase

```http
PUT /api/purchases/:id
```

Updates purchase information.

---

## Delete Purchase

```http
DELETE /api/purchases/:id
```

Deletes a purchase.

---

## AI Assistant

```http
POST /api/assistant
```

Processes natural-language questions about purchase data.

---

# 🗄️ Data Model

Example purchase object:

```json
{
  "product": "Apple MacBook Air M3",
  "seller": "Croma",
  "invoiceNumber": "CRO-26-27-19384",
  "purchaseDate": "2026-08-12",
  "amount": 123898,
  "gst": 18899,
  "category": "Electronics",
  "warrantyMonths": 12,
  "returnDays": 7,
  "returnDeadline": "2026-08-19",
  "warrantyExpiry": "2027-08-12",
  "status": "ACTIVE"
}
```

---

# 🧠 AI Prompt Strategy

The AI should be instructed to:

1. Analyze only the uploaded document.
2. Extract information visible in the document.
3. Never use previous receipt data.
4. Never invent missing information.
5. Return structured JSON.
6. Return `null` when information is unavailable.
7. Provide confidence when supported.

Example:

```text
You are a receipt and invoice extraction engine.

Analyze ONLY the uploaded receipt.

Extract the information visible in the document.

Do not use previous examples.
Do not use demo data.
Do not assume the product.

If a field is not visible, return null.

Return ONLY valid JSON using the required schema.
```

---

# 🧪 Demo Mode

BuyWise AI includes a fallback/demo mechanism for hackathon reliability.

The purpose is:

> **Prevent the application from becoming unusable if an external AI or database service temporarily fails.**

However, demo data must be isolated from normal receipt uploads.

### Normal upload

```text
Upload
 ↓
Gemini
 ↓
Real extraction
```

### Explicit demo mode

```text
Demo Receipt
 ↓
Predefined sample data
```

The application should **never silently replace a failed real upload with unrelated demo data**.

---

# 🛡️ Error Handling

The system should handle:

* Invalid file
* Unsupported file type
* Empty upload
* Gemini API failure
* Invalid AI response
* Missing fields
* Invalid dates
* Database failure
* Network failure

Example:

```text
AI extraction failed.

[Retry]

[Review Manually]
```

The application should never display stale information from a previous receipt.

---

# 🔒 Security

Important security practices:

### API Keys

Store API keys in environment variables.

Never commit:

```text
.env
```

to GitHub.

### Input Validation

Validate:

* File type
* File size
* AI JSON
* Dates
* Numeric values

### AI Output Validation

Never blindly trust AI-generated structured data.

Validate it before storing it.

### User Review

Allow users to edit extracted information before saving.

---

# 📈 Product Metrics

For future production evaluation, we can measure:

### Extraction Accuracy

```text
Correctly extracted fields
──────────────────────────
Total expected fields
```

### Deadline Accuracy

```text
Correct deadlines
──────────────────
Total deadlines
```

### AI Response Accuracy

```text
Correct AI answers
──────────────────
Total questions
```

### Time Saved

```text
Manual entry time
        -
AI-assisted entry time
```

These metrics allow the product to be evaluated objectively.

---

# 🚀 Future Scope

## 📧 Email Integration

Automatically detect purchase receipts from email.

---

## 💬 WhatsApp Integration

Users could forward bills to BuyWise AI.

---

## 💰 Price Drop Intelligence

Detect when a product becomes cheaper after purchase.

---

## 🛡️ Warranty Claim Assistant

Help users prepare warranty claims and identify required documents.

---

## 👨‍👩‍👧‍👦 Family Purchase Vault

Manage purchases for an entire household.

---

## 📊 Predictive Spending

Forecast upcoming expenses based on purchase history.

---

## 🤖 Proactive AI

Instead of waiting for users to ask questions:

> "Your laptop warranty expires next week. Would you like help preparing a warranty claim?"

---

# 🎬 Hackathon Demo Flow

The recommended presentation flow is:

### 1. Dashboard

Show:

* Total purchases
* Spending
* Warranties
* Action Center

### 2. Upload Receipt

Click:

**+ Add Purchase**

### 3. AI Processing

Show:

```text
Reading receipt
↓
Extracting product
↓
Detecting price
↓
Detecting warranty
↓
Calculating deadlines
```

### 4. Review

Show extracted information.

### 5. Save

Purchase is added.

### 6. Dashboard Update

Show:

* Purchase count
* Spending
* Warranty
* Return deadline

### 7. Action Center

Show an urgent deadline.

### 8. AI Assistant

Ask:

> "Which purchases need my attention?"

### 9. Analytics

Show category spending.

---

# 🏆 What Makes BuyWise AI Different?

Traditional receipt applications:

```text
Receipt
 ↓
Storage
```

BuyWise AI:

```text
Receipt
 ↓
AI Understanding
 ↓
Structured Data
 ↓
Deadline Intelligence
 ↓
Spending Analytics
 ↓
Smart Alerts
 ↓
Natural Language Assistant
 ↓
Action
```

### Our core differentiator

> **BuyWise AI doesn't just remember what you bought. It remembers what matters about what you bought — and tells you when to act.**

---

# 🎯 Hackathon Value Proposition

### For Users

* Save time
* Never miss important deadlines
* Understand spending
* Find purchase information quickly

### For Businesses

The same technology can eventually support:

* Invoice processing
* Warranty management
* Customer support
* Procurement analytics
* Expense management

---

# 👥 Team

**Project:** BuyWise AI
**Category:** AI / Productivity / Consumer Technology
**Built for:** Vibe Code Hackathon 2026

Add your actual team members and roles here:

```text
👨‍💻 Name — Full Stack / AI
🎨 Name — UI/UX
🤖 Name — AI / Data
📊 Name — Analytics / Presentation
```

---

# 📜 License

This project is created as a hackathon prototype.

Add your preferred open-source license if you intend to publish the code publicly.

---

# ⭐ Final Message

> **BuyWise AI**
>
> **Upload. Understand. Track. Act.**
>
> **Don't just store your receipts. Know what to do next.**

---

## ⚠️ Hackathon Disclaimer

This repository contains a hackathon prototype. AI-generated receipt information should be reviewed by the user before being relied upon for financial, warranty, or return decisions.
