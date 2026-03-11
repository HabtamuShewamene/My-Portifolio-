import { EventEmitter } from 'node:events';

class AnalyticsStreamService {
  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(200);
  }

  publish(update = {}) {
    this.emitter.emit('analytics:update', {
      ts: new Date().toISOString(),
      ...update,
    });
  }

  subscribe(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    // Open immediately so the client can mark the stream as connected.
    res.write(`event: ready\ndata: ${JSON.stringify({ ok: true, ts: new Date().toISOString() })}\n\n`);

    const onUpdate = (payload) => {
      res.write(`event: analytics_update\ndata: ${JSON.stringify(payload)}\n\n`);
    };

    const heartbeat = setInterval(() => {
      res.write(`event: heartbeat\ndata: ${JSON.stringify({ ts: new Date().toISOString() })}\n\n`);
    }, 15000);

    this.emitter.on('analytics:update', onUpdate);

    req.on('close', () => {
      clearInterval(heartbeat);
      this.emitter.off('analytics:update', onUpdate);
      res.end();
    });
  }
}

export const analyticsStreamService = new AnalyticsStreamService();
