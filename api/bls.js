const https = require('https');

module.exports = async (req, res) => {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BLS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'BLS_API_KEY environment variable not set' });
  }

  // Build payload: inject server-side API key, strip any client-supplied key
  const clientBody = req.body || {};
  const payload = JSON.stringify({
    seriesid: clientBody.seriesid,
    startyear: clientBody.startyear || '2023',
    endyear: clientBody.endyear || '2024',
    registrationkey: apiKey
  });

  const options = {
    hostname: 'api.bls.gov',
    path: '/publicAPI/v2/timeseries/data/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve) => {
    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => { data += chunk; });
      proxyRes.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        res.status(proxyRes.statusCode).send(data);
        resolve();
      });
    });

    proxyReq.on('error', (err) => {
      res.status(502).json({ error: 'BLS API proxy error: ' + err.message });
      resolve();
    });

    proxyReq.write(payload);
    proxyReq.end();
  });
};