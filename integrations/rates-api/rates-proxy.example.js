/**
 * Serverless proxy for The Savings Group Rates API.
 *
 * Deploy as a serverless function (Vercel: api/rates.js, Netlify: functions/rates.js)
 * and set these environment variables in the hosting dashboard — never in code:
 *
 *   TSG_API_TOKEN  - partner bearer token from The Savings Group
 *   TSG_ORG_CODE   - your organization code
 *   TSG_ENV        - "production" or "stage" (default: stage)
 *
 * The browser POSTs the applicant/vehicle payload here; the token stays server-side.
 */

const LEAD_CHANNEL = "AUTOPAY_AUTO_LUX_FAST_TRACK_API";
const VERSION = "1.0.0";

const BASE_URLS = {
  stage: "https://api.stg.save.auto",
  production: "https://api.save.auto",
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.TSG_API_TOKEN;
  const orgCode = process.env.TSG_ORG_CODE;
  if (!token || !orgCode) {
    res.status(500).json({ error: "Rates API credentials are not configured" });
    return;
  }

  const baseUrl = BASE_URLS[process.env.TSG_ENV] || BASE_URLS.stage;
  const url =
    baseUrl +
    "/api/2.0/lead/inbound" +
    "/organization/" + encodeURIComponent(orgCode) +
    "/channel/" + LEAD_CHANNEL +
    "/event/RATES_REQUESTED" +
    "/version/" + VERSION;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      // Pass through the status but never echo internal details to the client
      res.status(upstream.status).json({
        error: data.message || "Rates request failed",
        statusCode: upstream.status,
      });
      return;
    }

    // Return only what the front end needs to render offers
    res.status(200).json({
      requestId: data.requestId,
      autopayNumber: data.autopayNumber,
      activationLink: data.activationLink,
      rates: data.rates || [],
      ratesByBrand: data.ratesByBrand || {},
    });
  } catch (err) {
    res.status(502).json({ error: "Unable to reach the rates service" });
  }
};
