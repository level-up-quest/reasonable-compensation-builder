# Reasonable Compensation Builder

IRS-defensible reasonable compensation reports for S-Corp owner-employees using the Cost Approach (Many Hats Method). Built for tax professionals by Level Up Quest.

## What It Does

Guides tax professionals through a 7-step workflow to calculate and document reasonable compensation for S-Corp owner-employees, generating a PDF report suitable for audit defense.

## Deployment

Deployed on Vercel. Uses a serverless BLS API proxy (`api/bls.js`) to fetch live OEWS wage data without CORS issues.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BLS_API_KEY` | BLS OEWS API registration key. Get free at https://data.bls.gov/registrationEngine/ |

## Stack

- Single-file vanilla HTML/JS (no framework, no build step)
- Vercel serverless function for BLS API proxy
- jsPDF via CDN for report generation