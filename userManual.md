# TaxArmor User Manual

## Table of Contents
1. Getting Started
2. Dashboard Overview
3. Tax Compliance (ITR & GST Filing)
4. Tax Exemptions & Deductions
5. Investments & Income Tracking
6. Losses & Set-Off Management
7. Property & Asset Management
8. Financial Health
9. Advisory Sessions
10. Document Vault
11. Settings & Security
12. Subscription Plans
13. For Auditors / Chartered Accountants
14. FAQ & Troubleshooting

---

## 1. Getting Started

### Creating an Account
1. Visit the TaxArmor website
2. Click **Get Started** or **Sign Up**
3. Fill in:
   - **Full Name**
   - **Email Address**
   - **Phone Number** (optional)
   - **PAN Number** (format: ABCDE1234F)
   - **Password** (minimum 8 characters)
4. Click **Create Account**

### Signing In
1. Go to **Sign In**
2. Enter your email and password
3. If MFA is enabled, enter the 6-digit code from your authenticator app
4. Click **Sign In**

### Enabling Multi-Factor Authentication (MFA)
1. Go to **Dashboard > Settings**
2. Click **Set up MFA**
3. Scan the QR code with Google Authenticator, Authy, or similar
4. Enter the 6-digit code shown in your app
5. Click **Enable MFA**

---

## 2. Dashboard Overview

After signing in, you land on the Dashboard showing:
- **Active Filings** - Tax returns in progress
- **Documents Stored** - Encrypted documents count
- **Upcoming Advisory** - Scheduled CA calls
- **Completed Filings** - Successfully filed returns
- **Recent Filings** table with status badges
- **Upcoming Advisory Calls** list

The left sidebar provides navigation to all modules.

---

## 3. Tax Compliance (ITR & GST Filing)

**Navigate:** Dashboard > Tax Compliance

### Creating a New Filing
1. Click **New Filing**
2. Select filing type:
   - ITR-1 (Sahaj) - Salaried, income up to Rs. 50 lakh
   - ITR-2 - Capital gains or foreign assets
   - ITR-3 - Business/profession income
   - ITR-4 (Sugam) - Presumptive taxation
   - GSTR-1 - Outward supplies
   - GSTR-3B - Monthly summary return
3. Select **Financial Year**
4. Add optional notes for your CA
5. Click **Create Filing**

### Tracking Filing Status
- **Draft** - Created but not submitted
- **Submitted** - Sent to CA for review
- **Verified** - CA has verified
- **Completed** - Filed with tax authority
- **Rejected** - Needs correction

---

## 4. Tax Exemptions & Deductions

**Navigate:** Dashboard > Exemptions

### For Salaried Individuals
Eligible categories:
- **Section 80C** - PPF, ELSS, LIC, NSC, Tuition Fees (max Rs. 1,50,000)
- **Section 80D** - Health Insurance Premium (max Rs. 25,000)
- **Section 80TTA** - Savings Account Interest (max Rs. 10,000)
- **HRA** - House Rent Allowance
- **LTA** - Leave Travel Allowance
- **NPS (80CCD)** - National Pension System (max Rs. 50,000)

**Blocked categories** (auto-flagged): Childcare, Personal Travel, Food, Taxi, Mobile

### For Business / Freelancers
Eligible categories:
- **Travel - Business** - Business meetings/sites (requires purpose)
- **Conveyance** - Excludes home-to-office commute
- **Business Stay** - Travel outside city of residence
- **Client Meetings** - Coffee/lunch with clients (max Rs. 5,000 reasonable limit)
- **Telecom** - Business use % slider
- **Rental Expense** - Office rent (requires agreement)
- **Stationery/Hardware** - Business supplies
- **Property Tax (Business)** - Commercial property tax

### Adding an Expense
1. Click **Add Expense**
2. Select category from dropdown
3. Enter amount and date
4. Add purpose (required for business expenses)
5. Adjust business use % slider (for telecom)
6. Click **Add Expense**

### Viewing Summary
- Total deductions card
- Flagged items count
- Category-wise breakdown cards
- Table with status (Pending/Approved/Flagged)

---

## 5. Investments & Income Tracking

**Navigate:** Dashboard > Investments & Income

### Supported Income Types
| Type | Tax Treatment |
|---|---|
| Stocks - Capital Gains | STCG: 20% / LTCG: 12.5% above Rs.1.25L |
| Stocks - Dividends | Slab rate, TDS if > Rs.5,000 |
| Fixed Deposit Interest | Slab rate, TDS if > Rs.40,000 |
| Rental Income | 30% standard deduction + municipal taxes |
| Mutual Funds | Equity: 20%/12.5% / Debt: slab rate |
| Bonds & Debentures | Slab rate, TDS applicable |
| Savings Account Interest | Exempt up to Rs.10,000 (80TTA) |
| Other Investment Income | Varies by instrument |

### Adding Income
1. Click **Add Income**
2. Select income type
3. Enter amount
4. Enter TDS deducted (if any)
5. Check "Reflected in Form 26AS" if applicable
6. Add description (e.g., "HDFC Bank FD")
7. Click **Add Income Record**

### Dashboard Cards
- **Total Investment Income** - Sum of all income
- **Total TDS Deducted** - Tax already paid
- **Net Taxable Income** - Income minus TDS

---

## 6. Losses & Set-Off Management

**Navigate:** Dashboard > Losses & Set-Off

### Loss Types
| Loss Type | Set-Off Against | Carry Forward |
|---|---|---|
| Short-Term Capital Loss | STCG + LTCG | 8 years |
| Long-Term Capital Loss | LTCG only | 8 years |
| Non-Speculative Business Loss | Any except Salary | 8 years (business only) |
| Speculative Business Loss | Speculative income only | 4 years |
| House Property Loss | Any income (Rs.2L cap Old Regime) | 8 years (house property only) |

### Adding a Loss
1. Click **Add Loss**
2. Select loss type
3. Enter loss amount
4. For capital losses: enter purchase/sale dates and asset type
5. If carried forward from previous year, select the FY
6. Add description
7. Click **Add Loss Record**

### Set-Off Calculator
1. Enter income amounts for each head (STCG, LTCG, Salary, Business, etc.)
2. Select the loss type to calculate
3. Click **Calculate Set-Off**
4. View breakdown showing adjusted vs. carry-forward amounts

---

## 7. Property & Asset Management

**Navigate:** Dashboard > Property & Asset

### Municipal House Tax Estimator
1. Enter property value
2. Click **Estimate Municipal Tax**
3. View estimated annual tax

### Capital Gains Estimator
1. Enter sale value and purchase value
2. Enter purchase year and sale year
3. Click **Estimate Gains Tax**
4. View estimated capital gains tax (LTCG/STCG)

### Rental Income & Property Tax Deduction
1. Select property type:
   - **Rental / Let-out** - Property tax deductible from GAV
   - **Self-Occupied** - Property tax NOT deductible (Annual Value = Nil)
   - **Business / Office** - Property tax deductible as business expense
2. Enter:
   - Annual rent received
   - Property tax paid
   - Other municipal taxes
   - Home loan interest
3. Click **Calculate Rental Income Tax**

### Calculation Breakdown
- Gross Annual Value (Rent)
- Less: Municipal Taxes Paid
- Net Annual Value (NAV)
- Less: Standard Deduction (30% of NAV)
- Less: Home Loan Interest (Sec 24b)
- Taxable Rental Income or House Property Loss

If loss exceeds Rs. 2,00,000 (Old Regime), excess is carried forward for 8 years.

---

## 8. Financial Health

**Navigate:** Dashboard > Financial Health

### Financial Analysis
1. Enter monthly income
2. Enter monthly expenses
3. Enter monthly loan EMI
4. Enter CIBIL score (300-900)
5. Click **Analyze Financial Health**

### Results
- Annual income, monthly savings, savings rate
- Debt-to-income ratio
- CIBIL status (Excellent/Good/Fair/Needs Improvement)
- Recommended annual investment amount
- CIBIL improvement advice

---

## 9. Advisory Sessions

**Navigate:** Dashboard > Advisory

### Scheduling a Call
1. Click **Schedule Call**
2. Select date and time
3. Choose duration (15/30/45/60 minutes)
4. Add agenda/notes
5. Click **Schedule**

### Session Limits by Plan
- **Silver**: 1 session/year
- **Gold**: 2 sessions/year
- **Platinum**: Unlimited sessions

### Viewing Sessions
- **Upcoming Sessions** - Scheduled calls with date, time, duration
- **Past Sessions** - Completed/cancelled/no-show history

---

## 10. Document Vault

**Navigate:** Dashboard > Documents

### Uploading Documents
1. Click **Upload Document**
2. Select document type:
   - PAN Card, Aadhaar Card, ITR, GST Certificate
   - Bank Statement, Income Statement
   - Property Document, Loan Document, Other
3. Choose file (PDF, JPG, PNG, DOC, XLSX, CSV)
4. Add optional tags (e.g., "FY2024", "Capital Gains")
5. Click **Upload & Encrypt**

All documents are encrypted with AES-256 before storage.

### Managing Documents
- View all documents in a table with type, name, size, tags, upload date
- Delete documents (soft-delete, recoverable)
- Filter by document type

---

## 11. Settings & Security

**Navigate:** Dashboard > Settings

### Multi-Factor Authentication
- Enable/disable MFA
- Scan QR code with authenticator app
- Verify with 6-digit code

### Right to be Forgotten
1. Click **Request Data Deletion**
2. Confirm the action
3. Your data will be marked for deletion after the legal retention period (7-8 years per Indian tax law)

---

## 12. Subscription Plans

| Feature | Silver | Gold | Platinum |
|---|---|---|---|
| Annual Price | Rs. 1,999 | Rs. 7,999 | Rs. 24,999 |
| ITR Filing | Included | Included | Included |
| GST Filing | Not included | Up to 12/year | Unlimited |
| Advisory Sessions | 1/year | 2/year | Unlimited |
| Audit Support | Guidance | Document submission | Dedicated representation |
| Loan Support | Basic documentation | Financial statements | Full advisory |
| Tax Projection | Not included | Not included | 3-5 year |
| Life-Time Audit Shield | Not included | Not included | Included (5-yr plan) |

### Commitment Discounts
- 1-Year: Full price
- 3-Year: 15% discount
- 5-Year: 25% discount + Life-Time Audit Shield (Platinum)

---

## 13. For Auditors / Chartered Accountants

### Accessing Client Data
1. Log in with your CA credentials
2. Navigate to assigned clients via the CA dashboard
3. View client documents, filings, and income records
4. All access is logged in the immutable audit trail

### Audit Trail
Every action is recorded:
- Document upload/download/delete
- Filing creation/submission
- Subscription changes
- Login/logout events
- MFA enable/disable
- Data purge requests

### Compliance Notes
- Only the assigned CA can view a client's sensitive documents (PAN/Aadhaar)
- All document access is logged with timestamp, IP address, and user agent
- Data is encrypted at rest (AES-256) and in transit (TLS 1.3)
- Data residency: Indian servers per DPDP Act

---

## 14. FAQ & Troubleshooting

**Q: What happens if I get a tax notice?**
A: All plans include guidance. Gold includes document submission. Platinum includes dedicated representation.

**Q: Can I switch plans later?**
A: Yes, upgrade or downgrade anytime. Changes take effect at next billing cycle.

**Q: Is my data secure?**
A: AES-256 encryption at rest, TLS 1.3 in transit, Indian servers, DPDP compliant.

**Q: What if I want to cancel?**
A: Cancel 30 days before renewal. Refunds only if services haven't commenced.

**Q: Do I get the same CA throughout?**
A: Yes, a dedicated CA is assigned to your account.

**Q: What does "All-Inclusive" mean?**
A: No surprise fees. Your subscription covers all filings, advisory sessions, and audit support within plan limits.

**Q: Why is my expense flagged?**
A: Expenses are auto-flagged if they exceed reasonable limits, lack required purpose/receipts, or are non-deductible for your user type.

**Q: How long are capital losses carried forward?**
A: 8 years for most losses, 4 years for speculative business losses.

**Q: Can I set off capital losses against salary?**
A: No. Capital losses can only be set off against capital gains.
