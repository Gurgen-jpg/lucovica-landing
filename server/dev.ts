// Live reload для dev-режима: SSE-канал /__dev/reload и функция отправки сигнала.
import type { Express, Response } from 'express'

const clients = new Set<Response>()

export function liveReload(app: Express): void {
  app.get('/__dev/reload', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
      Connection: 'keep-alive',
    })
    res.write(': connected\n\n')
    clients.add(res)
    req.on('close', () => clients.delete(res))
  })
}

export function triggerReload(): void {
  for (const res of clients) res.write('event: reload\ndata: 1\n\n')
}
