# FinFlow — UX Blueprint & Complete Interaction Specification

> **Document:** UX Blueprint & Interaction Specification  
> **Version:** 1.0  
> **Date:** 2026-07-13  
> **Classification:** Internal — Product & Engineering

---

## Table of Contents

1. [UX Philosophy & Principles](#1-ux-philosophy--principles)
2. [Information Architecture](#2-information-architecture)
3. [Navigation Architecture](#3-navigation-architecture)
4. [User Flow Catalog](#4-user-flow-catalog)
5. [Screen Inventory & Specifications](#5-screen-inventory--specifications)
6. [Dashboard Blueprint](#6-dashboard-blueprint)
7. [Form UX Patterns](#7-form-ux-patterns)
8. [Data Table UX Patterns](#8-data-table-ux-patterns)
9. [Loading & State UX](#9-loading--state-ux)
10. [Empty State Patterns](#10-empty-state-patterns)
11. [Error State Patterns](#11-error-state-patterns)
12. [Success & Confirmation UX](#12-success--confirmation-ux)
13. [Search UX](#13-search-ux)
14. [Notification UX](#14-notification-ux)
15. [Mobile UX Patterns](#15-mobile-ux-patterns)
16. [Accessibility (WCAG 2.1 AA)](#16-accessibility-wcag-21-aa)
17. [Keyboard Navigation](#17-keyboard-navigation)
18. [Micro-Interactions & Animations](#18-micro-interactions--animations)
19. [Performance UX](#19-performance-ux)
20. [UX Governance & Quality Assurance](#20-ux-governance--quality-assurance)

---

## 1. UX Philosophy & Principles

### 1.1 Design Ethos

**"Invisible banking."** Every interaction should feel so natural that the user never has to think about the interface — only their money. The UI disappears; the user's intent is realized.

### 1.2 Core UX Principles

| # | Principle | Meaning | How We Measure |
|---|-----------|---------|----------------|
| 1 | **Clarity Over Cleverness** | Every element is immediately understood | SUS score ≥ 75 |
| 2 | **Progressive Disclosure** | Show only what's needed now | Time-to-task < 30s |
| 3 | **Error Prevention** | Design out mistakes before they happen | Error rate < 2% |
| 4 | **Consistent Patterns** | Same action = same UI everywhere | Heuristic compliance 95%+ |
| 5 | **Trust Through Transparency** | Users always know what's happening | Confirmation anxiety score < 10% |
| 6 | **Inclusive by Default** | Accessible to everyone from day one | WCAG 2.1 AA minimum |
| 7 | **Speed Is a Feature** | Perceived performance matters | FCP < 1.5s, LCP < 2.5s |

### 1.3 Emotional Design Map

| User State | Desired Emotion | UX Response |
|------------|----------------|-------------|
| First login | Welcomed, guided | Onboarding wizard, progress indicator |
| Checking balance | Calm, informed | Clean layout, clear hierarchy, subtle positive cues |
| Making payment | Confident, secure | Multi-step confirmation, biometric auth, clear summary |
| Receiving money | Delighted, notified | Rich notification, animated confirmation, social sharing |
| Transaction declined | Supported, not shamed | Helpful error, alternative suggestions, contact CTA |
| Dispute/refund | Empowered, heard | Transparent process, status tracking, proactive updates |
| Saving money | Motivated, rewarded | Progress visualization, milestone celebrations, streaks |

---

## 2. Information Architecture

### 2.1 Site Map (Complete)

```
FinFlow App
├── 🏠 Home / Dashboard
│   ├── Account Overview
│   ├── Recent Activity Feed
│   ├── Quick Actions Bar
│   └── Insights Panel
│
├── 💳 Accounts
│   ├── Account List
│   │   ├── Checking Account Detail
│   │   ├── Savings Account Detail
│   │   ├── Joint Account Detail
│   │   └── Business Account Detail
│   ├── Account Settings
│   ├── Statements
│   └── Account Closure Request
│
├── 💸 Transfers
│   ├── Send Money
│   │   ├── To FinFlow User (internal)
│   │   ├── To Bank Account (domestic)
│   │   ├── To Bank Account (international)
│   │   └── To UPI/Wallet
│   ├── Request Money
│   ├── Scheduled Transfers
│   ├── Standing Orders
│   ├── Beneficiary Management
│   │   ├── Add Beneficiary
│   │   ├── Edit Beneficiary
│   │   └── Delete Beneficiary
│   └── Transfer History
│
├── 💳 Cards
│   ├── Card List
│   │   ├── Physical Card Detail
│   │   └── Virtual Card Detail
│   ├── Card Settings
│   │   ├── Freeze/Unfreeze
│   │   ├── Change PIN
│   │   ├── Spending Limits
│   │   ├── Merchant Controls
│   │   └── Category Controls
│   ├── Order New Card
│   ├── Card Statements
│   └── Dispute Transaction
│
├── 🏦 Savings
│   ├── Goals Dashboard
│   │   ├── Create Goal
│   │   ├── Goal Detail
│   │   └── Goal History
│   ├── Round-Up Settings
│   ├── Savings Rules
│   └── Auto-Sweep Settings
│
├── 💰 Bills & Payments
│   ├── Due Bills Dashboard
│   ├── Pay Bills
│   │   ├── One-Time Payment
│   │   └── Set Up Autopay
│   ├── E-Mandates
│   │   ├── Create Mandate
│   │   ├── Modify Mandate
│   │   └── Cancel Mandate
│   ├── Payment History
│   └── Merchant Directory
│
├── 📊 Insights
│   ├── Spending Overview
│   ├── Category Breakdown
│   ├── Monthly Comparison
│   ├── Budget Tracker
│   ├── Subscription Tracker
│   └── Financial Health Score
│
├── 🔔 Notifications
│   ├── Notification Inbox
│   ├── Notification Settings
│   └── Alert History
│
├── 👤 Profile
│   ├── Personal Information
│   ├── KYC Verification
│   │   ├── Identity Verification
│   │   ├── Address Verification
│   │   └── Document Upload
│   ├── Security Settings
│   │   ├── Change Password
│   │   ├── Two-Factor Authentication
│   │   ├── Biometric Settings
│   │   ├── Trusted Devices
│   │   └── Login History
│   ├── App Preferences
│   │   ├── Language
│   │   ├── Theme
│   │   ├── Currency Display
│   │   └── Notification Preferences
│   ├── Linked Accounts
│   │   ├── Bank Accounts
│   │   ├── Wallets
│   │   └── OAuth Connections
│   └── Data & Privacy
│       ├── Download Data
│       ├── Data Sharing Preferences
│       └── Account Deletion
│
├── 🛡️ Security Center
│   ├── Security Score
│   ├── Fraud Alerts
│   ├── Reported Transactions
│   └── Security Recommendations
│
└── ⚙️ Settings
    ├── Account Settings
    ├── Privacy Settings
    ├── Help & Support
    │   ├── FAQ
    │   ├── Chat with Agent
    │   ├── Call Support
    │   └── Report Issue
    └── About FinFlow
```

### 2.2 Information Hierarchy

**Level 1 — Global Navigation:** Accounts, Transfers, Cards, Savings, Bills, Insights  
**Level 2 — Section Navigation:** Within each module, tab-based or list-based sub-navigation  
**Level 3 — Detail View:** Full-screen detail with contextual actions  
**Level 4 — Modal/Overlay:** Confirmations, quick edits, info popups

### 2.3 Content Priority Matrix

| Priority | Content Type | Examples |
|----------|-------------|----------|
| P0 — Critical | Account balance, fraud alerts, payment failures | Balance display, alert banners |
| P1 — Important | Recent transactions, pending actions, scheduled transfers | Transaction list, action cards |
| P2 — Useful | Insights, spending trends, savings progress | Charts, percentages, trends |
| P3 — Supplementary | Settings, educational content, promotions | Static content, secondary screens |

---

## 3. Navigation Architecture

### 3.1 Mobile Navigation (Bottom Tab Bar)

```
┌─────────────────────────────────────────┐
│                                         │
│            [Screen Content]             │
│                                         │
├─────────────────────────────────────────┤
│  🏠      💳      ➕      💸      👤     │
│ Home   Cards   Pay    Transfer  Profile │
└─────────────────────────────────────────┘
```

**Tab Definitions:**
- **Home:** Dashboard, account overview, recent activity
- **Cards:** Card management, quick card actions
- **Pay (FAB):** Centered floating action button — opens quick pay sheet
- **Transfer:** Send/receive money, beneficiary management
- **Profile:** Settings, security, support

**Behavior:**
- FAB (Pay) is always visible, elevated, with haptic feedback on tap
- Active tab has filled icon + label; inactive tabs have outline icon only
- Badge counts on tabs for pending actions (bills due, pending transfers)
- Long-press on any tab shows context menu (shortcuts)

### 3.2 Desktop Navigation (Sidebar)

```
┌──────┬──────────────────────────────────────────────┐
│      │  [Header Bar: Search, Notifications, Avatar] │
│ Logo ├──────────────────────────────────────────────┤
│      │                                              │
│ 🏠   │           [Main Content Area]                │
│ 💳   │                                              │
│ 💸   │                                              │
│ 🏦   │                                              │
│ 📊   │                                              │
│ 💰   │                                              │
│      │                                              │
│ ──── │                                              │
│ ⚙️   │                                              │
│ 👤   │                                              │
└──────┴──────────────────────────────────────────────┘
```

**Sidebar Behavior:**
- Collapsible to icon-only mode (60px → 240px)
- Hovering on collapsed sidebar expands with animation
- Active section highlighted with accent color
- Section groups separated by dividers
- Settings and Profile pinned to bottom
- Keyboard shortcut: `Cmd/Ctrl + K` opens command palette

### 3.3 Responsive Breakpoints

| Breakpoint | Width | Layout | Navigation |
|------------|-------|--------|------------|
| Mobile S | < 360px | Single column, stacked | Bottom tab bar |
| Mobile M | 360–480px | Single column | Bottom tab bar |
| Mobile L | 480–768px | Single column, wider cards | Bottom tab bar |
| Tablet | 768–1024px | Two-column grid | Collapsible sidebar |
| Desktop | 1024–1440px | Multi-column grid | Full sidebar |
| Desktop L | > 1440px | Multi-column + side panel | Full sidebar + detail panel |

---

## 4. User Flow Catalog

### 4.1 Onboarding Flows

#### Flow 4.1.1: First-Time Registration

```
[App Open] → [Welcome Screen] → [Email/Phone Entry] → [OTP Verification]
→ [Password Setup] → [KYC Initiation] → [Identity Document Upload]
→ [Selfie Capture] → [Account Type Selection] → [Account Created]
→ [Biometric Setup Prompt] → [Tutorial Walkthrough] → [Dashboard]
```

**Decision Points:**
- User can skip biometric setup → saved for later
- User can skip tutorial → accessible from settings
- KYC can be deferred → limited account functionality

**Error Paths:**
- Email already exists → suggest login, password reset
- OTP expired → resend with countdown
- Document upload fails → retry, switch to manual upload
- Liveness check fails → retry with guidance

#### Flow 4.1.2: Login (Email + Password)

```
[Login Screen] → [Email Entry] → [Password Entry] → [Submit]
→ [2FA Prompt] → [OTP/Biometric] → [Dashboard]
```

**Variations:**
- Remember device → skip 2FA for 30 days
- Biometric available → biometric prompt instead of password
- OAuth login → redirect to provider → callback → dashboard

#### Flow 4.1.3: Password Recovery

```
[Forgot Password] → [Email/Phone Entry] → [OTP Verification]
→ [New Password Entry] → [Confirmation] → [Login Prompt]
```

### 4.2 Core Transaction Flows

#### Flow 4.2.1: Send Money (Internal — FinFlow to FinFlow)

```
[Transfer Screen] → [Select Recipient] (search/beneficiary/recent)
→ [Enter Amount] → [Select Source Account] → [Add Note (optional)]
→ [Review Screen] → [Confirm with Biometric/PIN]
→ [Processing Animation] → [Success Screen] → [Share Receipt / Done]
```

**Screen Details:**
1. **Recipient Selection:** Search bar at top, recent contacts as avatars, beneficiary list below
2. **Amount Entry:** Numeric keypad, currency selector, balance displayed, "Max" button
3. **Review:** Source → Recipient, Amount, Fee (if any), Total, Note — all editable
4. **Processing:** Lottie animation (3-5 seconds), cancel option for scheduled transfers
5. **Success:** Checkmark animation, amount prominently displayed, receipt download, share button

#### Flow 4.2.2: Send Money (External — Bank Transfer)

```
[Transfer Screen] → [Select "Bank Account"] → [Select/Add Beneficiary]
→ [Enter Bank Details] (if new: routing, account number, SWIFT)
→ [Enter Amount] → [Select Source Account] → [Review & Confirm]
→ [Processing] → [Success with Reference Number]
```

**Additional Steps for International:**
- Currency conversion displayed with live rate
- Correspondent bank fee disclosed
- Expected delivery time shown

#### Flow 4.2.3: Request Money

```
[Request Screen] → [Select Payer] → [Enter Amount] → [Add Note]
→ [Set Expiry (optional)] → [Send Request] → [Confirmation]
→ [Status Tracking] (pending/paid/expired)
```

#### Flow 4.2.4: Schedule a Transfer

```
[Transfer Flow] → [Review Screen] → [Toggle "Schedule"]
→ [Select Frequency] (once/daily/weekly/monthly/custom)
→ [Select Date/Time] → [Review Schedule] → [Confirm]
→ [Scheduled Transfers List] with edit/cancel options
```

#### Flow 4.2.5: Standing Order Setup

```
[Standing Orders] → [Create New] → [Select Beneficiary]
→ [Enter Amount] → [Select Frequency] → [Select Start Date]
→ [Set End Condition] (date/occurrences/indefinite)
→ [Review & Confirm with 2FA] → [Active Standing Orders List]
```

### 4.3 Card Management Flows

#### Flow 4.3.1: Freeze/Unfreeze Card

```
[Card Detail] → [Tap "Freeze"] → [Confirm Reason (optional)]
→ [Card Frozen with Undo option] (5-second undo window)
→ [Status Updated] → [Unfreeze available after 24h or immediate]
```

**Visual:**
- Frozen card shows ice crystal overlay
- Card visually "frosts over" with animation
- Unfreezing reverses the animation

#### Flow 4.3.2: Change Card PIN

```
[Card Settings] → [Change PIN] → [Current PIN Entry]
→ [New PIN Entry] → [Confirm New PIN] → [Success]
→ [Notification: "Your card PIN has been changed"]
```

#### Flow 4.3.3: Set Spending Limits

```
[Card Settings] → [Spending Limits] → [Per-Transaction Limit]
→ [Daily Limit] → [Monthly Limit] → [Review Changes]
→ [Confirm with Biometric] → [Limits Applied]
```

**UI:** Horizontal sliders with real-time value display, preset buttons (₹1,000 / ₹5,000 / ₹10,000 / Custom)

#### Flow 4.3.4: Order New Card

```
[Cards List] → [Order New Card] → [Select Type] (Physical/Virtual)
→ [Select Design] (if physical) → [Confirm Delivery Address]
→ [Review Order] → [Confirm] → [Order Placed]
→ [Track Delivery] (physical) / [Instant Activation] (virtual)
```

### 4.4 Savings Flows

#### Flow 4.4.1: Create Savings Goal

```
[Savings Dashboard] → [Create Goal] → [Enter Goal Name]
→ [Select Icon/Color] → [Enter Target Amount] → [Select Target Date]
→ [Choose Funding Source] → [Set Auto-Deposit Schedule]
→ [Review] → [Goal Created] → [Goal Detail View]
```

**Visual:**
- Goal represented as a progress ring (like Apple Watch activity)
- Milestone celebrations at 25%, 50%, 75%, 100%
- Goal "story" with deposits over time

#### Flow 4.4.2: Configure Round-Ups

```
[Savings Settings] → [Round-Ups] → [Enable Round-Ups]
→ [Select Rounding Amount] (₹1, ₹5, ₹10)
→ [Select Funding Account] → [Select Savings Goal]
→ [Review] → [Confirm] → [Active Round-Ups Dashboard]
```

### 4.5 Bill Payment Flows

#### Flow 4.5.1: Pay a Bill

```
[Bills Dashboard] → [Select Bill Category] (utility/rent/subscription)
→ [Select Biller] → [Enter Account/Customer Number]
→ [Fetch Bill Details] (auto-fetch if available)
→ [Confirm Amount] → [Select Payment Account] → [Pay Now]
→ [Processing] → [Success with Receipt]
```

#### Flow 4.5.2: Set Up Autopay

```
[Bill Detail] → [Set Up Autopay] → [Select Payment Account]
→ [Set Max Amount] → [Select Payment Date] → [Review Terms]
→ [Confirm with 2FA] → [Autopay Active] → [Confirmation Notification]
```

#### Flow 4.5.3: Create E-Mandate

```
[E-Mandates] → [Create Mandate] → [Select Biller]
→ [Enter Mandate Details] (amount, frequency, start/end date)
→ [Review & Sign (digital signature)] → [Submit to Biller]
→ [Mandate Pending] → [Mandate Active] → [First Debit Triggered]
```

### 4.6 Security Flows

#### Flow 4.6.1: Report Fraudulent Transaction

```
[Transaction Detail] → [Report Issue] → [Select Reason]
→ [Describe Issue] → [Upload Evidence (optional)]
→ [Submit Report] → [Case Created]
→ [Case Tracking Dashboard] → [Status Updates via Notifications]
→ [Resolution] → [Refund/Credit] → [Case Closed]
```

#### Flow 4.6.2: Enable 2FA

```
[Security Settings] → [Two-Factor Auth] → [Select Method]
(TOTP App / SMS / Email / Hardware Key)
→ [Setup Instructions] → [Verify Setup] → [Recovery Codes Displayed]
→ [Download/Screenshot Recovery Codes] → [2FA Active]
```

### 4.7 KYC Flows

#### Flow 4.7.1: Identity Verification

```
[KYC Section] → [Start Verification] → [Select Document Type]
(National ID / Passport / Driver's License)
→ [Camera Capture] → [Auto-Crop & Enhance]
→ [Selfie Capture] (liveness check) → [Submit]
→ [Verification Pending] (async processing)
→ [Verification Complete] (notification) / [Verification Failed] (retry)
```

---

## 5. Screen Inventory & Specifications

### 5.1 Screen Count by Module

| Module | Screens | Modals | Bottom Sheets | Total |
|--------|---------|--------|---------------|-------|
| Onboarding | 8 | 2 | 1 | 11 |
| Dashboard | 1 | 1 | 1 | 3 |
| Accounts | 5 | 2 | 1 | 8 |
| Transfers | 8 | 3 | 2 | 13 |
| Cards | 7 | 4 | 3 | 14 |
| Savings | 4 | 2 | 1 | 7 |
| Bills & Payments | 6 | 3 | 2 | 11 |
| Insights | 5 | 1 | 1 | 7 |
| Notifications | 2 | 0 | 1 | 3 |
| Profile & Settings | 8 | 3 | 2 | 13 |
| Security Center | 3 | 1 | 1 | 5 |
| Support | 3 | 2 | 1 | 6 |
| **Total** | **60** | **24** | **17** | **101** |

### 5.2 Screen Specifications

Each screen follows this specification template:

```
Screen: [Name]
Module: [Module]
Route: /path/to/screen
Layout: [Full-width | Split | Centered | Overlay]
Auth Required: [Yes | No]
KYC Required: [Yes | No | Partial]
Roles: [Customer | Agent | Admin | All]
Refresh: [Pull-to-refresh | Auto | Manual]
Analytics: [Event name, properties]
```

### 5.3 Key Screen Layouts

#### Dashboard Layout (Mobile)

```
┌─────────────────────────────┐
│  Greeting + Avatar          │  ← 60px
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │   Account Balance      │  │  ← Hero card (120px)
│  │   [Primary Account]    │  │
│  │   Balance: $12,450.00  │  │
│  │   [+ ] [- ] [Send]     │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  Quick Actions Grid          │  ← 80px
│  [Send] [Request] [Pay] [Scan] │
├─────────────────────────────┤
│  Cards Carousel              │  ← 140px
│  [Card 1] [Card 2] [Card 3] │
├─────────────────────────────┤
│  Recent Transactions         │  ← Flexible
│  [Tx 1]                     │
│  [Tx 2]                     │
│  [Tx 3]                     │
│  [View All →]               │
├─────────────────────────────┤
│  Insights Preview            │  ← 100px
│  [Spending this month: $2.1k]│
│  [Budget: 72% used]          │
├─────────────────────────────┤
│  🏠  💳  ➕  💸  👤        │  ← Tab bar (56px)
└─────────────────────────────┘
```

#### Dashboard Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────┐
│  FinFlow Logo    🔍 Search...        🔔 (3)   👤 John D.    │
├──────┬───────────────────────────────────────────────────────┤
│      │                                                       │
│ 🏠   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│
│ 💳   │  │ Checking  │ │ Savings  │ │ Credit   │ │ Total   ││
│ 💸   │  │ $12,450   │ │ $8,200   │ │ -$1,200  │ │ $19,450 ││
│ 🏦   │  └──────────┘ └──────────┘ └──────────┘ └─────────┘│
│ 📊   │                                                       │
│ 💰   │  ┌─────────────────────┐ ┌──────────────────────────┐│
│      │  │  Recent Transactions │ │  Spending Insights       ││
│ ──── │  │                     │ │                          ││
│ ⚙️   │  │  Amazon    -$49.99  │ │  ┌────────────────────┐ ││
│ 👤   │  │  Salary   +$5,200   │ │  │   Pie Chart         │ ││
│      │  │  Netflix   -$15.99  │ │  │   Categories        │ ││
│      │  │  Uber      -$23.50  │ │  └────────────────────┘ ││
│      │  │  [View All →]       │ │  Budget: 72% used        ││
│      │  └─────────────────────┘ └──────────────────────────┘│
│      │                                                       │
│      │  ┌─────────────────────┐ ┌──────────────────────────┐│
│      │  │  Cards              │ │  Bills Due               ││
│      │  │  [Card preview 1]   │ │  Electricity - ₹2,340   ││
│      │  │  [Card preview 2]   │ │  Internet  - ₹1,200     ││
│      │  │                     │ │  [Pay All →]             ││
│      │  └─────────────────────┘ └──────────────────────────┘│
└──────┴───────────────────────────────────────────────────────┘
```

---

## 6. Dashboard Blueprint

### 6.1 Dashboard Components

#### Component 1: Greeting Bar

```
┌─────────────────────────────────────┐
│  Good morning, John  ☀️        [📷] │
└─────────────────────────────────────┘
```

- **Behavior:** Time-based greeting (Good morning/afternoon/evening)
- **Avatar:** Circular, 40px, tap to open profile
- **Personalization:** Uses first name from profile

#### Component 2: Account Summary Hero Card

```
┌─────────────────────────────────────┐
│  Total Balance               👁️     │
│  $20,450.32                         │
│  ────── ↑ $1,230 from last month    │
│                                     │
│  [+ Add Money]  [Send]  [Request]   │
└─────────────────────────────────────┘
```

- **Eye icon:** Toggle balance visibility (mask/unmask)
- **Change indicator:** Green arrow up (positive), red arrow down (negative)
- **Action buttons:** Primary actions only

#### Component 3: Quick Actions Grid

```
┌──────────┬──────────┬──────────┬──────────┐
│   Send   │  Request │   Pay    │   Scan   │
│   💸    │    💰    │    📋    │    📱    │
└──────────┴──────────┴──────────┴──────────┘
```

- **Customizable:** User can rearrange/add/remove actions
- **Haptic feedback** on tap
- **Badge:** Pending bills count on "Pay" action

#### Component 4: Cards Carousel

```
┌──────────────────────────────────────────┐
│  [←] [Card 1: ****1234] [Card 2: ****5678] [→] │
│                                          │
│  Physical Card                    Balance │
│  **** **** **** 1234               $2,300 │
└──────────────────────────────────────────┘
```

- **Swipeable** horizontally
- **Dot indicators** for card count
- **Tap** to go to card detail
- **Long press** for quick actions (freeze, details)

#### Component 5: Recent Transactions

```
┌─────────────────────────────────────┐
│  Recent Transactions        [View All] │
│                                     │
│  🛒 Amazon         -$49.99  2h ago  │
│  💰 Salary        +$5,200  1d ago   │
│  📺 Netflix       -$15.99  3d ago   │
│  🚗 Uber           -$23.50  3d ago  │
│  ☕ Starbucks      -$6.75   4d ago  │
│                                     │
│         [View All Transactions →]   │
└─────────────────────────────────────┘
```

- **Max 5 items** on dashboard
- **Pull-to-refresh** on the section
- **Swipe left** on transaction for quick actions
- **Infinite scroll** on "View All" screen

#### Component 6: Insights Preview

```
┌─────────────────────────────────────┐
│  Monthly Spending         Nov 2024  │
│  $2,140.00                          │
│  ████████████████░░░░  72% of budget │
│                                     │
│  🍔 Food     $420  (20%)           │
│  🏠 Rent     $800  (37%)           │
│  🛒 Shopping $320  (15%)           │
└─────────────────────────────────────┘
```

- **Budget progress bar** with color coding
- **Top 3 categories** with amounts
- **Tap** to go to full Insights screen
- **Month selector** swipeable

---

## 7. Form UX Patterns

### 7.1 Form Field Standards

#### Text Input

```
┌─────────────────────────────────────┐
│  Email Address *                    │
│  ┌─────────────────────────────────┐│
│  │ john@example.com                ││
│  └─────────────────────────────────┘│
│  We'll never share your email       │
└─────────────────────────────────────┘
```

- **Label:** Always visible (not floating), 14px, secondary color
- **Input:** 48px height, 1px border, rounded corners (8px)
- **Helper text:** Below input, 12px, muted color
- **Error state:** Red border, error icon, error message below
- **Success state:** Green checkmark inside input

#### Numeric Input (Amount)

```
┌─────────────────────────────────────┐
│           $                          │
│  ┌─────────────────────────────────┐│
│  │         1,250.00                ││  ← Large, centered text
│  └─────────────────────────────────┘│
│  Available: $12,450.32    [MAX]     │
│                                     │
│  Quick amounts:                     │
│  [$100] [$500] [$1,000] [Custom]   │
└─────────────────────────────────────┘
```

- **Currency symbol:** Prominent, left-aligned
- **Amount:** Large font (24px), centered, formatted with commas
- **MAX button:** Fills available balance
- **Quick amounts:** Preset chips for common amounts
- **Real-time validation:** Shows if amount exceeds balance

### 7.2 Form Validation Rules

| Field | Format | Validation | Error Message |
|-------|--------|------------|---------------|
| Email | Standard email | Regex + API check | "Enter a valid email address" |
| Phone | +[country code] [number] | Regex, 10-15 digits | "Enter a valid phone number" |
| Password | Min 8 chars | Complexity rules | "Password must include uppercase, lowercase, number, and special character" |
| Amount | Numeric | Min/max, balance check | "Amount must be between $0.01 and your available balance" |
| Account Number | Numeric | Length by country | "Account number must be 10-12 digits" |
| SWIFT Code | Alphanumeric | 8 or 11 characters | "SWIFT code must be 8 or 11 characters" |
| OTP | 6 digits | Numeric only | "OTP must be 6 digits" |

### 7.3 Multi-Step Form Pattern

```
Step 1 of 3: Personal Information
[████████████████████████████░░░░░░] 67%

┌─────────────────────────────────────┐
│  First Name *                       │
│  ┌─────────────────────────────────┐│
│  │ John                            ││
│  └─────────────────────────────────┘│
│                                     │
│  Last Name *                        │
│  ┌─────────────────────────────────┐│
│  │ Doe                             ││
│  └─────────────────────────────────┘│
│                                     │
│  [← Back]              [Next →]    │
└─────────────────────────────────────┘
```

- **Progress bar:** Always visible at top
- **Step labels:** Below progress bar
- **Back/Next:** Footer buttons, sticky
- **Validation:** Inline as user types, summary on Next
- **Data persistence:** Form data saved per step

### 7.4 Search Input Pattern

```
┌─────────────────────────────────────┐
│  🔍 Search transactions...      [✕] │
├─────────────────────────────────────┤
│  Recent searches:                   │
│  🕐 Amazon                          │
│  🕐 Netflix                         │
│  🕐 Uber                            │
├─────────────────────────────────────┤
│  Suggestions:                       │
│  📋 Amazon Purchase - $49.99        │
│  📋 Amazon Prime - $12.99           │
└─────────────────────────────────────┘
```

- **Auto-focus** on mount
- **Debounce:** 300ms after typing stops
- **Recent searches:** Stored locally, max 10
- **Clear button:** Appears when input has value
- **Keyboard:** Search key on mobile keyboard

### 7.5 Date/Time Picker

```
┌─────────────────────────────────────┐
│  Select Date                        │
│                                     │
│  < July 2026 >                      │
│  Su Mo Tu We Th Fr Sa              │
│      1  2  3  4  5  6              │
│   7  8  9 10 11 12 [13]            │
│  14 15 16 17 18 19 20              │
│  21 22 23 24 25 26 27              │
│  28 29 30 31                        │
│                                     │
│  Time: [14:30]                      │
│                                     │
│  [Cancel]        [Confirm]          │
└─────────────────────────────────────┘
```

- **Month navigation:** Swipe or arrows
- **Today:** Highlighted with accent ring
- **Selected:** Filled accent circle
- **Past dates:** Disabled (for future transfers)
- **Bottom sheet** on mobile, modal on desktop

### 7.6 Biometric Confirmation Pattern

```
┌─────────────────────────────────────┐
│                                     │
│         Confirm with Face ID        │
│                                     │
│         ┌─────────────┐             │
│         │   👤         │  ← Scanning│
│         │  ╭─────╮    │  animation │
│         │  │     │    │             │
│         │  ╰─────╯    │             │
│         └─────────────┘             │
│                                     │
│    Use PIN instead                   │
│                                     │
└─────────────────────────────────────┘
```

- **Animation:** Biometric scanning animation (3 seconds)
- **Fallback:** "Use PIN instead" link
- **Haptic:** Success = single tap; failure = double buzz
- **Timeout:** 10 seconds, then fallback to PIN

---

## 8. Data Table UX Patterns

### 8.1 Transaction List Item

```
┌─────────────────────────────────────┐
│  🛒  Amazon                          │
│      Shopping · Today, 2:30 PM       │
│                      -$49.99         │
│                      Visa •••1234     │
└─────────────────────────────────────┘
```

- **Category icon:** Colored circle with icon
- **Merchant name:** Primary text, 16px
- **Category + timestamp:** Secondary text, 14px
- **Amount:** Right-aligned, color-coded (green positive, red negative)
- **Card reference:** Subtle, below amount

### 8.2 Transaction List (Grouped by Date)

```
┌─────────────────────────────────────┐
│  Today, July 13, 2026               │
├─────────────────────────────────────┤
│  🛒 Amazon         -$49.99  2:30 PM │
│  ☕ Starbucks       -$6.75  11:15 AM │
│                                     │
│  Yesterday, July 12, 2026           │
├─────────────────────────────────────┤
│  💰 Salary        +$5,200  9:00 AM  │
│  📺 Netflix       -$15.99  8:00 AM  │
│                                     │
│  Loading more...                     │
└─────────────────────────────────────┘
```

- **Date headers:** Sticky on scroll
- **Lazy loading:** Load 20 items at a time
- **Pull-to-refresh:** Refreshes entire list
- **Skeleton:** Shows skeleton loading state

### 8.3 Filter & Sort Bar

```
┌─────────────────────────────────────┐
│  [All] [Income] [Expense] [Pending] │
│                                     │
│  Sort: [Date ▼]  Filter: [⚙️]       │
│                                     │
│  Active filters:                    │
│  [Category: Food ✕] [Amount > $50 ✕]│
└─────────────────────────────────────┘
```

- **Horizontal scroll** for filter chips
- **Active filter count** badge on filter icon
- **Sort options:** Date, Amount, Merchant, Category
- **Clear all** button when filters active

### 8.4 Pagination Pattern

```
┌─────────────────────────────────────┐
│  Showing 1-20 of 156 transactions   │
│                                     │
│  [← Previous]  Page 1 of 8  [Next →]│
└─────────────────────────────────────┘
```

- **Infinite scroll** on mobile
- **Button pagination** on desktop
- **"Load more"** option as alternative

---

## 9. Loading & State UX

### 9.1 Loading States

#### Skeleton Loading

```
┌─────────────────────────────────────┐
│  ┌──────┐                           │
│  │ ░░░░ │  ░░░░░░░░░░░░░░░░░░░░    │
│  │ ░░░░ │  ░░░░░░░░░░░░░░           │
│  └──────┘                           │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

- **Shape:** Matches the layout of actual content
- **Animation:** Shimmer effect (left-to-right gradient)
- **Duration:** Shows after 300ms delay (avoids flash for fast loads)
- **Content:** Approximates real data structure

#### Inline Spinner

```
Processing payment...
┌─────────────────┐
│    ◌             │  ← Rotating spinner
│  Processing...  │
└─────────────────┘
```

#### Full-Page Loading

```
┌─────────────────────────────────────┐
│                                     │
│           FinFlow Logo              │
│                                     │
│          ◌ Loading...               │
│                                     │
└─────────────────────────────────────┘
```

### 9.2 Loading Duration Thresholds

| Duration | UX Response |
|----------|------------|
| 0-300ms | No indicator needed |
| 300ms-1s | Skeleton or inline spinner |
| 1-3s | Progress bar with message |
| 3-10s | Progress bar with % and cancel option |
| > 10s | Background processing, notification on completion |

### 9.3 Optimistic Updates

| Action | Optimistic? | Rollback |
|--------|------------|----------|
| Like/save/unlike | ✅ Yes | Revert silently on failure |
| Card freeze/unfreeze | ❌ No | Wait for server confirmation |
| Transfer/send money | ❌ No | Always server-confirmed |
| Profile update | ✅ Yes | Show revert option |
| Settings change | ✅ Yes | Revert on failure |

---

## 10. Empty State Patterns

### 10.1 No Transactions

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────┐             │
│         │    📋        │  ← Custom  │
│         │   (empty)    │    illustration│
│         └─────────────┘             │
│                                     │
│    No transactions yet              │
│    Your transaction history will    │
│    appear here                      │
│                                     │
│    [Make a Transfer →]              │
│                                     │
└─────────────────────────────────────┘
```

### 10.2 No Beneficiaries

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────┐             │
│         │    👥        │             │
│         │   (empty)    │             │
│         └─────────────┘             │
│                                     │
│    No beneficiaries saved           │
│    Add a beneficiary to send        │
│    money quickly                    │
│                                     │
│    [Add Beneficiary +]              │
│                                     │
└─────────────────────────────────────┘
```

### 10.3 Empty States Catalog

| Screen | Illustration | Title | Description | CTA |
|--------|-------------|-------|-------------|-----|
| No transactions | Clipboard | "No transactions yet" | "Your transaction history will appear here" | "Make a Transfer" |
| No beneficiaries | People | "No beneficiaries saved" | "Add a beneficiary to send money quickly" | "Add Beneficiary" |
| No cards | Credit card | "No cards yet" | "Order your first card to get started" | "Order Card" |
| No savings goals | Piggy bank | "No savings goals" | "Set a goal and start saving" | "Create Goal" |
| No bills | Receipt | "No bills to pay" | "Add a biller to pay bills seamlessly" | "Add Biller" |
| No notifications | Bell | "All caught up!" | "No new notifications" | — |
| Search no results | Magnifying glass | "No results found" | "Try a different search term" | — |
| No insights | Chart | "Not enough data" | "Start spending to see insights" | "Make a Transfer" |

### 10.4 Empty State Design Rules

1. **Always include an illustration** — custom, brand-colored, not stock
2. **Use friendly, conversational language** — not "Error: No data"
3. **Always provide a next action** — guide the user forward
4. **Don't make the user feel their account is broken** — frame as "not yet"
5. **Respect user effort** — if they tried something, acknowledge it

---

## 11. Error State Patterns

### 11.1 Inline Field Error

```
┌─────────────────────────────────────┐
│  Email Address *                    │
│  ┌─────────────────────────────────┐│
│  │ john@exampl                    ││ ← Red border
│  └─────────────────────────────────┘│
│  ⚠️ Please enter a valid email      │ ← Red text, 12px
└─────────────────────────────────────┘
```

- **Show on:** Blur (field loses focus) or after first submit attempt
- **Don't show:** While user is still typing (unless past submission)
- **Clear on:** User corrects the field

### 11.2 Form-Level Error Summary

```
┌─────────────────────────────────────┐
│  ⚠️ Please fix 3 errors below       │
│                                     │
│  • Email: Enter a valid email       │
│  • Password: Must be 8+ characters  │
│  • Phone: Enter a valid phone number│
└─────────────────────────────────────┘
```

- **Shows on:** Failed form submission
- **Scrolls** to first error field
- **Links** each error to its field

### 11.3 Network Error State

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────┐             │
│         │    📡        │             │
│         │  (no signal) │             │
│         └─────────────┘             │
│                                     │
│    Connection lost                  │
│    Please check your internet       │
│    connection and try again         │
│                                     │
│    [Retry]                          │
│                                     │
└─────────────────────────────────────┘
```

### 11.4 Transaction Error State

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────┐             │
│         │      ❌      │             │
│         │  (error)     │             │
│         └─────────────┘             │
│                                     │
│    Payment Failed                   │
│    Your transfer of $250.00 to      │
│    John Doe could not be completed  │
│                                     │
│    Reason: Insufficient balance     │
│                                     │
│    [Try Again]  [Contact Support]   │
│                                     │
└─────────────────────────────────────┘
```

### 11.5 Error Message Catalog

| Error Code | User Message | Action |
|------------|-------------|--------|
| INSUFFICIENT_BALANCE | "Your available balance is $X. You need $Y more." | Top up, reduce amount |
| ACCOUNT_FROZEN | "Your account is currently frozen. Please contact support." | Contact support CTA |
| NETWORK_ERROR | "Connection lost. Please check your internet and retry." | Retry button |
| SESSION_EXPIRED | "Your session has expired. Please log in again." | Redirect to login |
| RATE_LIMITED | "Too many requests. Please wait a moment and try again." | Auto-retry countdown |
| INVALID_BENEFICIARY | "This account number is invalid. Please double-check." | Clear field, focus |
| CARD_DECLINED | "Your card was declined. Try another payment method." | Switch card CTA |
| KYC_REQUIRED | "Identity verification is required for this action." | Start KYC CTA |
| SERVER_ERROR | "Something went wrong on our end. We're looking into it." | Retry, contact support |

### 11.6 Error Design Rules

1. **Never show raw error codes** — always translate to human-readable
2. **Always provide a recovery path** — retry, contact support, alternative
3. **Be specific about what happened** — not just "Something went wrong"
4. **Show the amount/context involved** — "$250.00 transfer failed"
5. **Don't blame the user** — "We couldn't process" not "You entered wrong"
6. **Include error ID for support** — small text, copyable
7. **Log the full error** — but only show the user what's helpful

---

## 12. Success & Confirmation UX

### 12.1 Success State — Transfer Complete

```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────┐             │
│         │      ✓       │  ← Animated│
│         │  (checkmark) │    check   │
│         └─────────────┘             │
│                                     │
│    Payment Successful!              │
│                                     │
│    $250.00                          │
│    to John Doe                      │
│                                     │
│    Reference: TXN-2026-07-13-001   │
│    Date: Jul 13, 2026, 2:30 PM     │
│                                     │
│    [View Receipt]  [Share]          │
│    [Done]                           │
│                                     │
└─────────────────────────────────────┘
```

- **Animation:** Checkmark draws in (300ms), then celebratory particles
- **Haptic:** Single vibration pulse
- **Sound:** Subtle "success" chime (optional, respects system settings)
- **Auto-dismiss:** Does NOT auto-dismiss — user must tap Done
- **Share:** Opens share sheet with receipt image

### 12.2 Confirmation Dialog Pattern

```
┌─────────────────────────────────────┐
│                                     │
│  Confirm Transfer                   │
│                                     │
│  You are about to send:             │
│                                     │
│  Amount:        $250.00             │
│  To:            John Doe            │
│  Account:       ••••1234            │
│  From:          Checking ••••5678   │
│  Fee:           $0.00               │
│  ─────────────────────────          │
│  Total:         $250.00             │
│                                     │
│  [Cancel]    [Confirm & Send]       │
│                                     │
└─────────────────────────────────────┘
```

- **Full-screen modal** on mobile
- **Centered modal** on desktop (480px max-width)
- **All details visible** — no hidden information
- **Irreversible actions** require re-entry of amount or PIN

### 12.3 Toast Notifications (Success)

```
┌─────────────────────────────────────┐
│ ✓ Card frozen successfully           │
│                                 [✕] │
└─────────────────────────────────────┘
```

- **Position:** Top-right (desktop), Top-center (mobile)
- **Duration:** 5 seconds, then auto-dismiss
- **Stackable:** Yes, max 3 visible at once
- **Dismiss:** Swipe (mobile), click X (desktop), or click to view details

### 12.4 Success State Hierarchy

| Action Type | Success UI | Auto-Dismiss | Sound | Haptic |
|-------------|-----------|--------------|-------|--------|
| Transfer/Payment | Full-screen success | No (manual) | Yes | Yes |
| Card freeze/unfreeze | Toast + card animation | 5s | No | Yes |
| Settings change | Toast | 3s | No | No |
| Profile update | Toast | 3s | No | No |
| Bill payment | Full-screen success | No (manual) | Yes | Yes |
| Beneficiary add | Toast + redirect | 2s | No | No |

---

## 13. Search UX

### 13.1 Global Search

```
┌─────────────────────────────────────┐
│  🔍 Search FinFlow...         [Esc] │
├─────────────────────────────────────┤
│                                     │
│  Quick Actions:                     │
│  [Send Money] [Pay Bill] [Add Card] │
│                                     │
│  Recent:                            │
│  🕐 Amazon                          │
│  🕐 Netflix                         │
│  🕐 John Doe                        │
│                                     │
│  People & Contacts:                 │
│  👤 John Doe (john@email.com)       │
│  👤 Jane Smith (jane@email.com)     │
│                                     │
│  Accounts:                          │
│  💳 Checking ••••1234               │
│  💳 Savings ••••5678                │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- **Trigger:** `Cmd/Ctrl + K` (desktop), swipe down (mobile)
- **Results:** Grouped by category (actions, contacts, accounts, transactions)
- **Keyboard navigation:** Arrow keys, Enter to select
- **Fuzzy matching:** Tolerant of typos
- **Real-time:** Results appear as you type (debounced 200ms)

### 13.2 Transaction Search

```
┌─────────────────────────────────────┐
│  🔍 Search transactions...     [✕]  │
├─────────────────────────────────────┤
│  Filters:                           │
│  [All] [Income] [Expense]           │
│                                     │
│  Date Range: [From] → [To]          │
│  Amount: [$___] → [$___]            │
│  Category: [Any ▼]                  │
│  Account: [Any ▼]                   │
│                                     │
│  Results: 23 transactions found     │
│                                     │
│  Amazon - $49.99 (Jul 13)           │
│  Amazon - $129.99 (Jul 8)           │
│  Amazon - $23.50 (Jun 28)           │
└─────────────────────────────────────┘
```

---

## 14. Notification UX

### 14.1 Push Notification Format

```
┌─────────────────────────────────────┐
│  💰 FinFlow                         │
│  Payment Received                   │
│  You received $250.00 from John Doe │
│                              2m ago │
└─────────────────────────────────────┘
```

### 14.2 Notification Types & Priority

| Type | Priority | Sound | Vibrate | Badge | Channel |
|------|----------|-------|---------|-------|---------|
| Fraud alert | 🔴 Critical | Alarm | Long | +1 | security |
| Payment received | 🟢 Normal | Chime | Single | +1 | transactions |
| Transfer completed | 🟢 Normal | Chime | Single | +1 | transactions |
| Bill reminder | 🟡 Medium | Gentle | Single | +1 | bills |
| Security recommendation | 🟡 Medium | None | None | +1 | security |
| Marketing | ⚪ Low | None | None | None | promotions |
| System maintenance | 🟡 Medium | Alert | Single | None | system |

### 14.3 In-App Notification Center

```
┌─────────────────────────────────────┐
│  Notifications            [Mark All Read] │
│                                     │
│  Today                              │
│  ┌─────────────────────────────────┐│
│  │ 🔴 Security Alert               ││
│  │ New device logged in from       ││
│  │ Mumbai, India                   ││
│  │ 10 minutes ago        [Review]  ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 💰 Payment Received             ││
│  │ You received $250.00 from      ││
│  │ John Doe                        ││
│  │ 1 hour ago           [View]    ││
│  └─────────────────────────────────┘│
│                                     │
│  Yesterday                          │
│  ┌─────────────────────────────────┐│
│  │ 📋 Bill Reminder                ││
│  │ Electricity bill due in 3 days ││
│  │ Amount: $120.00       [Pay]    ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 15. Mobile UX Patterns

### 15.1 Pull-to-Refresh

- **Trigger:** Pull down on any list screen
- **Indicator:** Brand-colored spinner at top
- **Haptic:** Light tap when triggered
- **Content:** List refreshes with skeleton loading

### 15.2 Swipe Actions

```
Transaction item swipe:

[Normal state]
┌─────────────────────────────────────┐
│  🛒 Amazon         -$49.99  2h ago  │
└─────────────────────────────────────┘

[Swipe left reveals]
┌─────────────────────────────────────┐
│ [📌 Pin] [📋 Details] [🚩 Report]   │
│  🛒 Amazon         -$49.99  2h ago  │
└─────────────────────────────────────┘
```

### 15.3 Bottom Sheet Patterns

#### Action Sheet

```
┌─────────────────────────────────────┐
│  ─── (drag handle)                  │
│                                     │
│  Select Payment Method              │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 💳 Checking ••••1234    $12,450 ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 💳 Savings ••••5678     $8,200  ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 💳 Credit ••••9012     -$1,200  ││
│  └─────────────────────────────────┘│
│                                     │
│  [Cancel]                           │
└─────────────────────────────────────┘
```

### 15.4 Gesture Navigation

| Gesture | Action |
|---------|--------|
| Swipe right from left edge | Go back |
| Swipe down | Pull-to-refresh or dismiss modal |
| Swipe up from bottom | Show bottom sheet |
| Pinch on chart | Zoom in/out |
| Long press on transaction | Show context menu |
| Double tap on card | Quick freeze/unfreeze |

### 15.5 Mobile Keyboard Handling

- **Input types:** Numeric keypad for amounts, email keyboard for email, phone keyboard for phone
- **Scroll to input:** When keyboard appears, scroll input into view
- **Dismiss keyboard:** Tap outside input area
- **Submit:** "Next" button on keyboard moves to next field; "Done" submits form

---

## 16. Accessibility (WCAG 2.1 AA)

### 16.1 Color Contrast Requirements

| Element Type | Minimum Ratio | Target Ratio |
|-------------|---------------|--------------|
| Normal text (< 18px) | 4.5:1 | 7:1 |
| Large text (≥ 18px or ≥ 14px bold) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | 4.5:1 |
| Focus indicators | 3:1 | 4.5:1 |

### 16.2 Screen Reader Support

- **All images:** Descriptive `alt` text
- **All forms:** Associated labels
- **All interactive elements:** ARIA roles and labels
- **Dynamic content:** `aria-live` regions for updates
- **Navigation:** Landmark regions (main, nav, banner, contentinfo)
- **Headings:** Proper hierarchy (h1 → h2 → h3)
- **Tables:** Proper `th`, `scope`, and `caption`
- **Modals:** Focus trap, `aria-modal`, escape to close
- **Loading states:** `aria-busy` and `aria-label` for spinners

### 16.3 Color-Blind Safety

| Color | Usage | Alternative Indicator |
|-------|-------|----------------------|
| Green (#22C55E) | Success, positive amount | ✓ icon, ↑ arrow |
| Red (#EF4444) | Error, negative amount | ✗ icon, ↓ icon, ⚠ icon |
| Yellow (#EAB308) | Warning, pending | ⚠ icon |
| Blue (#3B82F6) | Information, links | (i) icon, underline |

### 16.4 Touch Targets

- **Minimum touch target:** 44x44 px (WCAG)
- **FinFlow target:** 48x48 px (comfortable)
- **Spacing between targets:** 8px minimum
- **Interactive elements:** Not smaller than 44x44 even if visual is smaller

---

## 17. Keyboard Navigation

### 17.1 Keyboard Shortcuts

| Shortcut | Action | Platform |
|----------|--------|----------|
| `Cmd/Ctrl + K` | Open command palette | All |
| `Cmd/Ctrl + /` | Toggle sidebar | Desktop |
| `Cmd/Ctrl + N` | New transfer | Desktop |
| `Cmd/Ctrl + B` | Toggle balance visibility | All |
| `Escape` | Close modal/dropdown/search | All |
| `Tab` | Move to next interactive element | All |
| `Shift + Tab` | Move to previous element | All |
| `Enter` | Activate button/link | All |
| `Space` | Toggle checkbox/button | All |
| `↑` `↓` | Navigate list items | All |
| `1-5` | Switch tabs (when no input focused) | Desktop |

### 17.2 Focus Management

- **Visible focus ring:** 2px solid, 2px offset, accent color
- **Focus trap in modals:** Tab cycles within modal only
- **Focus restoration:** After closing modal, return focus to trigger element
- **Skip navigation:** "Skip to main content" link on page load
- **Tab order:** Logical, follows visual flow (top → bottom, left → right)

### 17.3 Keyboard-Only Flows

Every critical user flow must be completable with keyboard only:
1. Login → Dashboard ✅
2. Send money → Success ✅
3. View transaction detail ✅
4. Freeze/unfreeze card ✅
5. Create savings goal ✅
6. Pay a bill ✅

---

## 18. Micro-Interactions & Animations

### 18.1 Animation Principles

1. **Purposeful:** Every animation communicates something
2. **Quick:** 150-300ms for most interactions
3. **Smooth:** 60fps minimum, use `transform` and `opacity` only
4. **Respectful:** Honor `prefers-reduced-motion`

### 18.2 Standard Durations

| Duration | Use Case |
|----------|----------|
| 100ms | Button press, hover state change |
| 150ms | Toggle switch, checkbox, small UI update |
| 200ms | Dropdown appear, tooltip show |
| 300ms | Modal enter/exit, card flip, page transition |
| 500ms | Success animation, progress fill |
| 800ms | Celebration animation, complex illustration |

### 18.3 Key Micro-Interactions

#### Button Press

```
Normal → Pressed → Released
Scale: 1.0 → 0.97 → 1.0
Duration: 100ms each
Easing: ease-out → ease-in
```

#### Balance Toggle (Show/Hide)

```
Visible → Masked
Number morphs to "••••••"
Duration: 200ms
Easing: ease-in-out
```

#### Card Freeze

```
Normal → Freezing → Frozen
Overlay slides from left to right
Ice crystal particles appear
Card desaturates (grayscale filter)
Duration: 500ms
```

#### Success Checkmark

```
Circle draws in → Checkmark draws in
Duration: 300ms (circle) + 300ms (check)
Easing: ease-out
Followed by: subtle scale bounce (1.0 → 1.05 → 1.0)
```

#### Transaction Swipe

```
Normal → Swiped → Actions revealed
Background slides to reveal action buttons
Duration: 200ms
Spring physics for snap-back
```

#### Number Counter (Amount)

```
$0.00 → $250.00
Numbers increment rapidly (count-up)
Duration: 500ms
Easing: ease-out
```

#### Loading Skeleton Shimmer

```
Gradient position: -100% → 200%
Duration: 1.5s (infinite)
Easing: linear
```

### 18.4 Page Transitions

| Transition | Duration | Animation |
|-----------|----------|-----------|
| Tab switch | 200ms | Cross-fade |
| Push forward | 300ms | Slide from right |
| Pop back | 300ms | Slide from left |
| Modal open | 300ms | Scale from 0.95 + fade |
| Modal close | 200ms | Scale to 0.95 + fade |
| Bottom sheet | 300ms | Slide up with spring |

### 18.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations are instantly completed when reduced motion is preferred.

---

## 19. Performance UX

### 19.1 Perceived Performance Strategy

| Strategy | Implementation |
|----------|---------------|
| **Optimistic UI** | Show success state before server confirms |
| **Skeleton screens** | Show content structure while loading |
| **Progressive images** | Low-res → high-res image loading |
| **Prefetching** | Load likely next screens in background |
| **Pagination** | Show first page immediately, load rest lazily |
| **Debounced search** | Don't search on every keystroke |
| **Cached data** | Show stale data immediately, refresh in background |

### 19.2 Performance Budget

| Metric | Budget | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| First Input Delay | < 100ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Total Blocking Time | < 200ms | Lighthouse |
| JavaScript bundle (initial) | < 200KB | Webpack |
| Total asset size | < 1MB | Webpack |

### 19.3 Offline Support

- **Critical data cached:** Balance, recent transactions, profile
- **Offline indicator:** Persistent banner at top
- **Queue operations:** Transfers queued and sent when online
- **Conflict resolution:** Server wins, with user notification

### 19.4 App Startup Sequence

```
1. Splash screen (100ms max)
2. Check auth token (cached)
3. Load cached data → show immediately
4. Fetch fresh data → update silently
5. Show dashboard
```

**Target:** Dashboard visible in < 1 second (with cached data)

---

## 20. UX Governance & Quality Assurance

### 20.1 UX Review Process

| Stage | Reviewer | Checklist |
|-------|----------|-----------|
| Design | Design lead | Brand consistency, token usage, accessibility |
| Development | Engineering lead | Performance, responsive, error handling |
| QA | QA engineer | Cross-browser, screen reader, edge cases |
| Product | Product owner | Business logic, user flow completeness |

### 20.2 UX Metrics & Monitoring

| Metric | Tool | Target | Frequency |
|--------|------|--------|-----------|
| System Usability Scale | User survey | ≥ 75 | Quarterly |
| Task success rate | Analytics | ≥ 95% | Weekly |
| Time to task | Analytics | < 30s (primary tasks) | Weekly |
| Error rate | Analytics | < 2% | Weekly |
| Support ticket volume | Zendesk | Decreasing trend | Monthly |
| App store rating | App Store / Play Store | ≥ 4.5 stars | Monthly |
| Session duration | Analytics | Appropriate (not too long) | Weekly |
| Bounce rate | Analytics | < 20% | Weekly |

### 20.3 Accessibility Audit Schedule

| Audit Type | Tool | Frequency | Pass Criteria |
|-----------|------|-----------|---------------|
| Automated scan | axe-core, Lighthouse | Every PR | 0 violations |
| Manual screen reader | NVDA, VoiceOver | Monthly | All flows pass |
| Keyboard-only test | Manual | Every release | All flows complete |
| Color contrast check | axe DevTools | Every design change | 100% compliant |
| Cognitive load review | Heuristic evaluation | Quarterly | Score ≥ 85 |

### 20.4 Design System Compliance

- **Component usage:** Every UI element uses a Design System component
- **Token usage:** No hardcoded colors, spacing, or typography
- **Pattern library:** Every interaction pattern documented in Storybook
- **Visual regression:** Chromatic captures every component variation

### 20.5 User Research Cadence

| Activity | Frequency | Participants | Goal |
|----------|-----------|-------------|------|
| Usability testing | Bi-weekly | 5-8 users | Identify friction points |
| A/B testing | Ongoing | Random split | Validate design decisions |
| User interviews | Monthly | 3-5 users | Understand needs |
| Survey (NPS/CSAT) | Quarterly | All users | Measure satisfaction |
| Analytics review | Weekly | — | Identify drop-off points |

---

## Appendix A: Screen Route Map

| Route | Screen | Auth | KYC | Roles |
|-------|--------|------|-----|-------|
| `/` | Dashboard | ✅ | Partial | Customer |
| `/login` | Login | ❌ | ❌ | All |
| `/register` | Registration | ❌ | ❌ | All |
| `/accounts` | Account List | ✅ | ✅ | Customer |
| `/accounts/:id` | Account Detail | ✅ | ✅ | Customer |
| `/transfers/send` | Send Money | ✅ | ✅ | Customer |
| `/transfers/request` | Request Money | ✅ | ✅ | Customer |
| `/transfers/history` | Transfer History | ✅ | ✅ | Customer |
| `/cards` | Card List | ✅ | ✅ | Customer |
| `/cards/:id` | Card Detail | ✅ | ✅ | Customer |
| `/cards/order` | Order Card | ✅ | ✅ | Customer |
| `/savings` | Savings Dashboard | ✅ | ✅ | Customer |
| `/savings/:id` | Goal Detail | ✅ | ✅ | Customer |
| `/bills` | Bills Dashboard | ✅ | ✅ | Customer |
| `/bills/pay` | Pay Bill | ✅ | ✅ | Customer |
| `/bills/mandates` | E-Mandates | ✅ | ✅ | Customer |
| `/insights` | Insights | ✅ | ✅ | Customer |
| `/notifications` | Notifications | ✅ | ❌ | All |
| `/profile` | Profile | ✅ | ❌ | All |
| `/profile/security` | Security Settings | ✅ | ❌ | All |
| `/profile/kyc` | KYC Verification | ✅ | ❌ | Customer |
| `/settings` | Settings | ✅ | ❌ | All |
| `/admin` | Admin Dashboard | ✅ | ❌ | Admin |
| `/admin/users` | User Management | ✅ | ❌ | Admin |

---

## Appendix B: Component Storybook Coverage

Every component in the Design System must have these Storybook stories:

1. **Default** — Basic rendering
2. **All Variants** — Every prop combination
3. **States** — Default, hover, focus, active, disabled, loading, error
4. **Sizes** — sm, md, lg (where applicable)
5. **Dark/Light Theme** — Both themes
6. **Mobile** — 375px viewport
7. **Tablet** — 768px viewport
8. **Desktop** — 1440px viewport
9. **RTL** — Right-to-left layout (where applicable)
10. **Accessibility** —axe-core automated check

---

*Document maintained by the FinFlow Product & Design team.*  
*Last updated: 2026-07-13*
