// Vercel Serverless Function — encaminha eventos de conversao para a Meta Conversion API.
// O token fica APENAS na variavel de ambiente META_CAPI_TOKEN (Vercel > Project > Settings >
// Environment Variables), nunca neste arquivo nem no git — o repositorio e publico.
const PIXEL_ID = '1061442156739147';
const GRAPH_API_VERSION = 'v21.0';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'capi_not_configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const eventName = body.event_name;
  if (!eventName) {
    res.status(400).json({ error: 'missing_event_name' });
    return;
  }

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : (forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket && req.socket.remoteAddress);

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id || undefined,
        event_source_url: body.event_source_url || undefined,
        action_source: 'website',
        user_data: {
          client_ip_address: clientIp,
          client_user_agent: req.headers['user-agent'] || '',
        },
      },
    ],
  };

  try {
    const fbRes = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const fbData = await fbRes.json();
    res.status(fbRes.ok ? 200 : 502).json(fbData);
  } catch (err) {
    res.status(502).json({ error: 'capi_forward_failed' });
  }
};
