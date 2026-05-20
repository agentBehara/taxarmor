# TaxArmor Technical Documentation

## Table of Contents
1. System Architecture
2. Technology Stack
3. Database Schema
4. API Endpoints
5. Security Architecture
6. Authentication Flow
7. Document Encryption Flow
8. Subscription Management Flow
9. Filing Workflow
10. Loss Set-Off Calculation Flow
11. Rental Income Calculation Flow
12. Audit Logging System
13. Deployment Architecture
14. Environment Variables
15. Future Enhancements

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Landing  │  │   Auth   │  │Dashboard │  │   Admin Panel    │ │
│  │   Pages   │  │  Pages   │  │  Pages   │  │                  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                     React Server Components + Client Components  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js 16 App Router (Turbopack)             │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────────────┐  │  │
│  │  │ API     │ │ Middleware│ │Server  │ │ Static Pages    │  │  │
│  │  │ Routes  │ │ (Auth    │ │Actions │ │ (Landing,       │  │  │
│  │  │         │ │  Guard)  │ │        │ │  Pricing, ToS)  │  │  │
│  │  └─────────┘ └──────────┘ └────────┘ └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │  Auth    │ │Documents │ │ Filings  │ │   Subscriptions  │   │
│  │  Module  │ │  Module  │ │  Module  │ │    Module        │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │Exemptions│ │  Income  │ │  Losses  │ │    Advisory      │   │
│  │  Module  │ │  Module  │ │  Module  │ │    Module        │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ NextAuth.js  │  │ Encryption   │  │    Audit Logger      │  │
│  │ + Credentials│  │ AES-256-GCM  │  │   (Immutable Logs)   │  │
│  │ + TOTP MFA   │  │  at Rest     │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Pricing    │  │  Loss Set-Off│  │  Rental Income       │  │
│  │   Engine     │  │  Calculator  │  │  Calculator          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Prisma 7 ORM + Better-SQLite3 Adapter        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Users   │ │Subscriptions│ │Documents │ │    Filings       │  │
│  └──────────┘ └────────────┘ └──────────┘ └──────────────────┘  │
│  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │Exemptions│ │  Income    │ │  Losses  │ │   AdvisoryCalls  │  │
│  └──────────┘ └────────────┘ └──────────┘ └──────────────────┘  │
│  ┌──────────┐ ┌──────────────────────────────────────────────┐  │
│  │ AuditLog │ │          ClientAssignments                    │  │
│  └──────────┘ └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Auth | NextAuth.js v5 (Credentials + TOTP) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma 7 + Better-SQLite3 Adapter |
| Encryption | Node.js crypto (AES-256-GCM) |
| MFA | speakeasy (TOTP) |
| Validation | Zod |
| Password Hashing | bcryptjs |
| Icons | lucide-react |
| Payments | Razorpay (subscription API) |

---

## 3. Database Schema

```
┌─────────────────────┐     ┌─────────────────────┐
│       User          │     │    Subscription     │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │◄────│ userId (FK, unique) │
│ email (unique)      │     │ tier (enum)         │
│ passwordHash        │     │ status (enum)       │
│ name                │     │ startDate           │
│ phone               │     │ endDate             │
│ pan (unique)        │     │ autoRenew           │
│ aadhaarMasked       │     │ amount              │
│ userType (enum)     │     │ razorpaySubId       │
│ role (enum)         │     │ commitmentYears     │
│ mfaEnabled          │     └─────────────────────┘
│ mfaSecret           │
│ createdAt           │     ┌─────────────────────┐
│ updatedAt           │     │     Document        │
│ lastLoginAt         │     ├─────────────────────┤
└─────────┬───────────┘     │ id (PK)             │
          │                 │ userId (FK)         │
          │                 │ type (enum)         │
          │                 │ fileName            │
    ┌─────┴─────┐           │ encryptedData       │
    │           │           │ iv                  │
    ▼           ▼           │ authTag             │
┌────────┐ ┌──────────┐    │ fileSize            │
│Filing  │ │TaxExemp- │    │ uploadedBy          │
│        │ │  tion    │    │ uploadedAt          │
│id (PK) │ │          │    │ deletedAt           │
│userId  │ │id (PK)   │    │ tags                │
│type    │ │userId    │    └─────────────────────┘
│fy      │ │type      │
│status  │ │amount    │    ┌─────────────────────┐
│data    │ │date      │    │   IncomeRecord      │
│filedAt │ │category  │    ├─────────────────────┤
│notes   │ │status    │    │ id (PK)             │
└────────┘ │fy        │    │ userId (FK)         │
           └──────────┘    │ type (enum)         │
                           │ amount              │
    ┌──────────────────┐   │ fy                  │
    │   LossRecord     │   │ description         │
    ├──────────────────┤   │ taxDeducted         │
    │ id (PK)          │   │ hasForm26AS         │
    │ userId (FK)      │   │ status (enum)       │
    │ type (enum)      │   └─────────────────────┘
    │ amount           │
    │ fy               │   ┌─────────────────────┐
    │ description      │   │   AdvisoryCall      │
    │ assetType        │   ├─────────────────────┤
    │ purchaseDate     │   │ id (PK)             │
    │ saleDate         │   │ userId (FK)         │
    │ carryForwardYrs  │   │ caId (FK)           │
    │ adjustedAmount   │   │ scheduledAt         │
    │ status (enum)    │   │ duration            │
    └──────────────────┘   │ status (enum)       │
                           │ notes               │
    ┌──────────────────┐   └─────────────────────┘
    │   AuditLog       │
    ├──────────────────┤   ┌─────────────────────┐
    │ id (PK)          │   │ ClientAssignment    │
    │ userId (FK)      │   ├─────────────────────┤
    │ action (enum)    │   │ id (PK)             │
    │ entity           │   │ caId (FK)           │
    │ entityId         │   │ userId (FK)         │
    │ ipAddress        │   │ assignedAt          │
    │ userAgent        │   │ isActive            │
    │ details          │   └─────────────────────┘
    │ createdAt        │
    └──────────────────┘
```

---

## 4. API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/[...nextauth]` | NextAuth handler (signin, signout, session) |
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/settings/mfa` | Generate/verify/disable MFA |

### Documents
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/documents` | List user documents (encrypted) |
| POST | `/api/documents` | Upload and encrypt document |
| DELETE | `/api/documents?id=` | Soft-delete document |

### Filings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/filings` | List user tax filings |
| POST | `/api/filings` | Create new filing (ITR/GST) |

### Subscriptions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/subscriptions` | Get user subscription |
| POST | `/api/subscriptions` | Create subscription (Razorpay) |

### Exemptions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/exemptions` | List exemptions with summary |
| POST | `/api/exemptions` | Add expense with auto-flagging |
| DELETE | `/api/exemptions?id=` | Delete exemption |

### Income
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/income` | List income records with TDS |
| POST | `/api/income` | Add investment income |
| DELETE | `/api/income?id=` | Delete income record |

### Losses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/losses` | List loss records with set-off status |
| POST | `/api/losses` | Add loss record |
| PATCH | `/api/losses` | Update adjusted amount/status |
| DELETE | `/api/losses?id=` | Delete loss record |

### Advisory
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/advisory` | List advisory calls |
| POST | `/api/advisory` | Schedule new call (with tier limits) |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin?action=stats` | Platform statistics |
| GET | `/api/admin?action=users` | User list with subscriptions |

### Settings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/settings/purge` | Request data deletion (Right to be Forgotten) |

---

## 5. Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  1. NETWORK LAYER                                      │ │
│  │     - TLS 1.3 for all traffic                          │ │
│  │     - Rate limiting on API routes                      │ │
│  │     - CORS restrictions                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  2. AUTHENTICATION LAYER                               │ │
│  │     - bcrypt password hashing (cost 12)                │ │
│  │     - JWT sessions (8-hour expiry)                     │ │
│  │     - TOTP-based MFA (mandatory for CA/Admin)          │ │
│  │     - Middleware route guards                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  3. AUTHORIZATION LAYER (RBAC)                         │ │
│  │     - USER: Own data only                              │ │
│  │     - CA: Assigned clients' data                       │ │
│  │     - ADMIN: Full platform access                      │ │
│  │     - ClientAssignment table enforces CA-client mapping│ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  4. DATA ENCRYPTION                                    │ │
│  │     - AES-256-GCM for documents at rest                │ │
│  │     - Random IV per document                           │ │
│  │     - Auth tag for integrity verification              │ │
│  │     - ENCRYPTION_KEY (256-bit) in env                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  5. AUDIT & COMPLIANCE                                 │ │
│  │     - Immutable audit log for all actions              │ │
│  │     - IP address + user agent tracking                 │ │
│  │     - Data minimization (soft-delete)                  │ │
│  │     - Right to be Forgotten (7-8yr retention)          │ │
│  │     - Indian data residency (DPDP Act)                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Authentication Flow

```
User                    Frontend                    API/Server                  Database
 │                         │                            │                         │
 │── Enter email/pass ────▶│                            │                         │
 │                         │── POST /api/auth ─────────▶│                         │
 │                         │                            │── Find user ───────────▶│
 │                         │                            │◀── User record ─────────│
 │                         │                            │                         │
 │                         │                            │── bcrypt.compare()      │
 │                         │                            │                         │
 │                         │               ┌────────────┴────────────┐            │
 │                         │               │ Valid?                  │            │
 │                         │               └────────────┬────────────┘            │
 │                         │                  No        │         Yes             │
 │                         │              ┌─────────────┘                         │
 │                         │              ▼                                       │
 │                         │     ┌──────────────────┐                             │
 │                         │     │ MFA enabled?     │                             │
 │                         │     └────────┬─────────┘                             │
 │                         │        No    │    Yes                                │
 │                         │    ┌─────────┘                                      │
 │                         │    ▼                                                 │
 │                         │  Return mfaRequired ────────────────────────────────▶│
 │◀── Show MFA input ──────│                                                       │
 │── Submit MFA code ─────▶│                                                       │
 │                         │── POST /api/auth + mfaCode ─────────────────────────▶│
 │                         │                            │                         │
 │                         │                            │── speakeasy.totp.verify()│
 │                         │                            │                         │
 │                         │               ┌────────────┴────────────┐            │
 │                         │               │ Valid?                  │            │
 │                         │               └────────────┬────────────┘            │
 │                         │                  No        │         Yes             │
 │                         │              ┌─────────────┘                         │
 │                         │              ▼                                       │
 │                         │     ┌──────────────────┐                             │
 │                         │     │ Update lastLogin │────────────────────────────▶│
 │                         │     │ Create JWT       │                             │
 │                         │◀── Redirect /dashboard │                             │
 │                         │                            │                         │
```

---

## 7. Document Encryption Flow

```
User Browser              API Route               Encryption Module          Database
    │                        │                          │                       │
    │── Select file ────────▶│                          │                       │
    │── POST /api/documents─▶│                          │                       │
    │   (base64 content)     │                          │                       │
    │                        │── encrypt(content) ─────▶│                       │
    │                        │                          │── randomBytes(16) IV  │
    │                        │                          │── createCipheriv()    │
    │                        │                          │── AES-256-GCM         │
    │                        │                          │── getAuthTag()        │
    │                        │◀── {encrypted, iv, tag}──│                       │
    │                        │                          │                       │
    │                        │── prisma.document.create─│──────────────────────▶│
    │                        │   {encryptedData,        │   {                   │
    │                        │    iv, authTag,           │    encryptedData,     │
    │                        │    fileSize, type }       │    iv,                │
    │                        │                           │    authTag }          │
    │                        │◀──────────────────────────│───────────────────────│
    │◀── {id, fileName} ────│                          │                       │
    │                        │                          │                       │
    │                        │── createAuditLog ────────│──────────────────────▶│
    │                        │   (DOCUMENT_UPLOAD)       │   AuditLog record     │
```

---

## 8. Subscription Management Flow

```
User                    Frontend                 API                    Razorpay              Database
 │                         │                      │                       │                    │
 │── Select plan ─────────▶│                      │                       │                    │
 │  (Silver/Gold/Platinum) │                      │                       │                    │
 │── Select commitment ───▶│                      │                       │                    │
 │  (1/3/5 years)          │                      │                       │                    │
 │                         │── Calculate price ──▶│                       │                    │
 │                         │                      │── applyDiscount()     │                    │
 │                         │                      │  (15% for 3yr,        │                    │
 │                         │                      │   25% for 5yr)        │                    │
 │                         │◀── {total, perYear}──│                       │                    │
 │                         │                      │                       │                    │
 │── Payment ─────────────▶│                      │                       │                    │
 │                         │── Initiate Razorpay─▶│                       │                    │
 │                         │                      │── Create subscription │                    │
 │                         │                      │                       │                    │
 │                         │◀── razorpaySubId ────│                       │                    │
 │                         │                      │                       │                    │
 │                         │── POST /api/subs ───▶│                       │                    │
 │                         │                      │── prisma.sub.create ──│───────────────────▶│
 │                         │                      │   {tier, amount,       │   Subscription     │
 │                         │                      │    startDate,          │   record           │
 │                         │                      │    endDate,            │                    │
 │                         │                      │    razorpaySubId}      │                    │
 │                         │                      │── auditLog ───────────│───────────────────▶│
 │                         │◀── {subscription} ───│                       │                    │
 │◀── Success ─────────────│                      │                       │                    │
```

---

## 9. Filing Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DRAFT     │────▶│  SUBMITTED  │────▶│  VERIFIED   │────▶│  COMPLETED  │     │  REJECTED   │
│             │     │             │     │             │     │             │     │             │
│ User creates│     │ User submits│     │ CA reviews  │     │ Filed with  │     │ Needs       │
│ filing with │     │ to CA       │     │ documents   │     │ tax auth.   │     │ correction  │
│ type + FY   │     │             │     │ & data      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                                       │
                                                                                       │
                                                                                       ▼
                                                                                ┌─────────────┐
                                                                                │   DRAFT     │
                                                                                │ (re-submit) │
                                                                                └─────────────┘
```

---

## 10. Loss Set-Off Calculation Flow

```
Input: Loss Type + Amount + Available Income by Head
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Lookup LOSS_RULES  │
                    │  for loss type      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Get canSetOff-     │
                    │  Against list       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  For each income    │
                    │  head in list:      │
                    │  adjustable = min(  │
                    │    remaining loss,  │
                    │    available income │
                    │  )                  │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │  HOUSE_PROPERTY?    │
                    │  Apply Rs.2L cap    │
                    │  (Old Regime)       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Return:            │
                    │  - adjusted amount  │
                    │  - unadjusted       │
                    │    (carry forward)  │
                    │  - breakdown by     │
                    │    income head      │
                    └─────────────────────┘
```

---

## 11. Rental Income Calculation Flow

```
Input: Property Type + Annual Rent + Municipal Taxes + Home Loan Interest
                              │
                              ▼
                    ┌─────────────────────────────┐
                    │  Property Type Check        │
                    └──────────┬──────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │  RENTAL  │    │SELF-OCC. │    │ BUSINESS │
        └────┬─────┘    └────┬─────┘    └────┬─────┘
             │               │               │
             ▼               ▼               ▼
        Prop Tax         Prop Tax        Prop Tax
        DEDUCTIBLE       NOT ALLOWED     DEDUCTIBLE
        from GAV         (NAV = Nil)     as Business
                                          Expense
             │               │               │
             ▼               ▼               ▼
        GAV - MuniTax    NAV = 0         Rent - MuniTax
        = NAV                                = NAV
             │               │               │
             ▼               ▼               ▼
        NAV - 30% Std    No further      NAV - 30% Std
        Deduction        calculation     Deduction
             │               │               │
             ▼               ▼               ▼
        - Home Loan      Result:         - Home Loan
        Interest         Nil             Interest
             │               │               │
             ▼               ▼               ▼
        Taxable Income   Taxable:        Taxable Income
        or Loss          Nil             or Loss
             │
             ▼
        ┌─────────────────────┐
        │  Loss > 0?          │
        └──────────┬──────────┘
                   │
          ┌────────┴────────┐
          │ Yes             │ No
          ▼                 ▼
    ┌─────────────┐   ┌─────────────┐
    │ Set-off cap │   │ Taxable     │
    │ Rs.2L (Old) │   │ Income      │
    │ Carry fwd   │   │ reported    │
    │ excess 8yr  │   │ in ITR      │
    └─────────────┘   └─────────────┘
```

---

## 12. Audit Logging System

```
┌──────────────────────────────────────────────────────────────┐
│                    AUDIT LOG TRIGGERS                         │
│                                                               │
│  Action              │ Entity        │ When Triggered         │
│  ────────────────────┼───────────────┼──────────────────────  │
│  LOGIN               │ User          │ Successful auth        │
│  LOGOUT              │ User          │ Sign out               │
│  DOCUMENT_UPLOAD     │ Document      │ POST /api/documents    │
│  DOCUMENT_DOWNLOAD   │ Document      │ GET document content   │
│  DOCUMENT_DELETE     │ Document      │ DELETE /api/documents  │
│  FILING_CREATE       │ Filing/Income │ POST filing/income     │
│  FILING_SUBMIT       │ Filing        │ Status → SUBMITTED     │
│  SUBSCRIPTION_CREATE │ Subscription  │ POST /api/subscriptions│
│  SUBSCRIPTION_UPDATE │ Subscription  │ Plan change            │
│  SUBSCRIPTION_CANCEL │ Subscription  │ Cancellation           │
│  PROFILE_UPDATE      │ User          │ Profile edit           │
│  MFA_ENABLE          │ User          │ MFA setup complete     │
│  MFA_DISABLE         │ User          │ MFA removed            │
│  DATA_PURGE_REQUEST  │ User          │ Right to be Forgotten  │
│                                                               │
│  Each log entry stores:                                       │
│  - userId, action, entity, entityId                           │
│  - ipAddress, userAgent                                       │
│  - details (human-readable description)                       │
│  - createdAt (immutable timestamp)                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 13. Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  CDN / Edge Network (Vercel / Cloudflare)              │  │
│  │  - Static assets                                       │  │
│  │  - SSR caching                                         │  │
│  │  - TLS termination                                     │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                   │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │  Next.js Application Server                            │  │
│  │  - API Routes                                          │  │
│  │  - Server Components                                   │  │
│  │  - Middleware (auth guard)                             │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │                                   │
│  ┌────────────────────────▼───────────────────────────────┐  │
│  │  PostgreSQL Database (AWS RDS / Supabase)              │  │
│  │  - Primary + Read Replica                              │  │
│  │  - Automated backups                                   │  │
│  │  - Indian region (data residency)                      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Object Storage (AWS S3 / Cloudflare R2)               │  │
│  │  - Encrypted document blobs                            │  │
│  │  - Lifecycle policies for retention                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Razorpay Payment Gateway                              │  │
│  │  - Subscription management                             │  │
│  │  - e-NACH / Auto-debit                                 │  │
│  │  - PCI-DSS compliant (no card data stored)             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 14. Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"          # SQLite (dev) / PostgreSQL URL (prod)

# Authentication
NEXTAUTH_SECRET="random-secret-key"   # JWT signing key
NEXTAUTH_URL="http://localhost:3000"  # App URL

# Encryption
ENCRYPTION_KEY="64-char-hex-key"      # 256-bit hex key for AES-256-GCM

# Payments (Razorpay)
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# Production
NODE_ENV="production"
```

---

## 15. Future Enhancements

1. **PostgreSQL Migration** - Replace SQLite with PostgreSQL for production
2. **Razorpay Integration** - Complete subscription payment flow
3. **Email Notifications** - Filing reminders, advisory call reminders
4. **Form 26AS Import** - Auto-import from TRACES portal
5. **ITR XML Generation** - Auto-generate ITR XML for e-filing
6. **CA Dashboard** - Full CA portal with client management
7. **Multi-language** - Hindi and regional language support
8. **Mobile App** - React Native companion app
9. **Webhook Integration** - GSTN portal status updates
10. **Advanced Analytics** - Tax savings dashboard, year-over-year comparison
