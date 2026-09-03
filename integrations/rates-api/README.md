# The Savings Group — Rates API integration

Reference: https://docs.thesavingsgroup.com/#/docs/rates-api

The Rates API generates live financing rates (APR, term, monthly payment) for a
consumer + vehicle, through the same AutoPay partnership the site's
[credit application page](../../credit-application.html) uses.

## Why this is not called from the browser

The API requires a **partner bearer token** and accepts **PII (SSN, birth date)**
that triggers a soft credit pull. Calling it from client-side JavaScript would
expose the token to every visitor. It must only be called from a backend —
a serverless function, or your own server — which the static site then talks to.

`rates-proxy.example.js` in this folder is a ready-to-adapt serverless handler
(Vercel/Netlify-style). To activate it:

1. Get your credentials from The Savings Group partner onboarding
   (questions: affiliates@thesavingsgroup.com). You need:
   - API bearer token
   - Organization code
   - Lead channel — this site uses `AUTOPAY_AUTO_LUX_FAST_TRACK_API`
2. Deploy the function with these environment variables (never commit them):
   - `TSG_API_TOKEN` — the bearer token
   - `TSG_ORG_CODE` — your organization code
   - `TSG_ENV` — `stage` or `production` (defaults to stage)
3. Point the site's rate-check UI at the deployed function URL.

## API summary

| | |
|---|---|
| Stage base URL | `https://api.stg.save.auto` |
| Production base URL | `https://api.save.auto` |
| Endpoint | `POST /api/2.0/lead/inbound/organization/:organizationCode/channel/:leadChannel/event/RATES_REQUESTED/version/1.0.0` |
| Async variant | append `/async` |
| Auth | `Authorization: Bearer <token>` |

**Request** (basic / pre-qualified payload): `applicationType`
(`PURCHASE` \| `REFINANCE` \| `LEASE_BUYOUT`), `financeAmount`, optional
`downPayment`, `partnerRecordUniqueIdentifier`, an `applicants` array
(name, email, cell phone, residence address, employment with
`yearlyIncomeAmount`), and vehicle details (`vin` **or**
year/make/model/trim **or** licensePlate+province, plus `mileage`).

Complete applications additionally require `birthDate`, `ssn`, and a
`termsAndConditionsOptIn` object (`agreesToTerms`, `ipAddress`, `userAgent`,
`displayedTerms`).

**Response** (200): `autopayNumber`, `requestId`, an `activationLink`, and a
`rates` array of `{ term, rate, apr, monthlyPaymentAmount,
requiredDownPaymentAmount, activationLink }` (or `ratesByBrand` for
multi-brand configs).

**Notable errors**: `401` bad token, `404` credit pull lookup failed, `409`
duplicate record, `412` insufficient data to generate rates, `422` validation.

## The no-backend path (live today)

Until the proxy is deployed, the site sends applicants straight to AutoPay's
hosted application, which needs no credentials on our side:

```
https://apply.autopay.com/unified?partnerUniqueId=&ap[a][partnerRecordUniqueIdentifier]=&leadChannel=AUTOPAY_AUTO_LUX_FAST_TRACK_API
```

That link is wired to the "Start Secure Application" button on
`credit-application.html`. Append a value to `ap[a][partnerRecordUniqueIdentifier]`
(URL-encoded) if you want to tag individual leads for tracking.
