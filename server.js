import http from 'node:http'
import https from 'node:https'
import { URL } from 'node:url'

const PORT = 3000
const TARGET_BASE = 'https://www.regeljelease.nl/api/home'

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`)

  if (requestUrl.pathname !== '/api/home' || req.method !== 'GET') {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
    return
  }

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Vary', 'Origin')

  const targetUrl = new URL(TARGET_BASE)
  targetUrl.search = requestUrl.search

  const proxyReq = https.request(
    targetUrl,
    {
      method: 'GET',
      headers: {
        'User-Agent': 'Opdracht kandidaat front-end',
      },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, {
        'Content-Type': proxyRes.headers['content-type'] || 'application/json',
      })
      proxyRes.pipe(res)
    },
  )

  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err)
    res.writeHead(502, { 'Content-Type': 'text/plain' })
    res.end('Bad Gateway')
  })

  proxyReq.end()
})

server.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
