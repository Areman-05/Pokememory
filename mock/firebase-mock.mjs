import http from 'node:http';
import { randomBytes } from 'node:crypto';

const PORT = 9000;

const db = {
  users: {},
  scores: {},
};

const sendJson = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const createId = () => `-${randomBytes(8).toString('hex')}`;

const parsePath = (url) => {
  const clean = url.split('?')[0].replace(/^\//, '');
  const match = clean.match(/^(users|scores)(?:\/([^/]+))?\.json$/);
  if (!match) {
    return null;
  }
  return { collection: match[1], id: match[2] || null };
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, null);
    return;
  }

  const parsed = parsePath(req.url || '');
  if (!parsed) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  const { collection, id } = parsed;

  try {
    if (req.method === 'GET') {
      if (id) {
        sendJson(res, 200, db[collection][id] ?? null);
        return;
      }
      sendJson(res, 200, Object.keys(db[collection]).length ? db[collection] : null);
      return;
    }

    if (req.method === 'POST' && !id) {
      const body = await readBody(req);
      const newId = createId();
      db[collection][newId] = body;
      sendJson(res, 200, { name: newId });
      return;
    }

    if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
      const body = await readBody(req);
      db[collection][id] = body;
      sendJson(res, 200, body);
      return;
    }

    if (req.method === 'DELETE' && id) {
      delete db[collection][id];
      sendJson(res, 200, null);
      return;
    }

    sendJson(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Firebase mock listening on http://127.0.0.1:${PORT}`);
});
