// webhook-server.js
const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

// Optional: replace this with your GitHub webhook secret if you set one
const SECRET = 'your_webhook_secret_here'; 

const verifySignature = (req, body) => {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/github-webhook') {
    res.writeHead(404);
    return res.end('Not found');
  }

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    if (SECRET && !verifySignature(req, body)) {
      console.error('❌ Signature mismatch');
      res.writeHead(403);
      return res.end('Invalid signature');
    }

    console.log('✅ Webhook received, pulling latest...');
    exec(
      'cd ~/kitchen-dashboard && git pull && npm install && pkill -f vite && npm run dev &',
      (err, stdout, stderr) => {
        if (err) {
          console.error('❌ Pull or restart failed:', stderr);
          res.writeHead(500);
          return res.end('Update failed');
        }

        console.log('🚀 Dashboard updated:\n', stdout);
        res.writeHead(200);
        res.end('OK');
      }
    );
  });
});

server.listen(3002, () => {
  console.log('🚀 Webhook server listening on http://localhost:3002/github-webhook');
});
