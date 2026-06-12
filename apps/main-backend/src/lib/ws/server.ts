import type { Server } from 'node:http';

import { WebSocketServer } from 'ws';

import { TRANSPORT } from '@leaksync/core';

import { verifyDeviceToken } from '@lib/device-token.js';
import { logger } from '@lib/logger.js';

import { hub } from './hub.js';

// Attaches the WebSocket server to the HTTP server. The Mac connects at
// /api/v1/ws?token=<deviceToken> on launch. The socket has a HARD lifetime
// (TRANSPORT.WS_LIFETIME_MS): the server sends a `closing` notice then closes,
// and the Mac falls back to HTTP polling. Only `mac` devices may connect.

export const attachWebSocket = (server: Server): WebSocketServer => {
  // noServer: we handle the upgrade ourselves so we can auth before accepting.
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url ?? '', 'http://localhost');
    if (url.pathname !== '/api/v1/ws') {
      socket.destroy();
      return;
    }
    const token = url.searchParams.get('token');
    const claims = token ? verifyDeviceToken(token) : null;
    if (!claims || claims.platform !== 'mac') {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      const { pairId } = claims;
      hub.add(pairId, ws);
      hub.send(pairId, { type: 'hello', pairId });
      logger.info({ pairId }, 'ws: mac connected');

      // Hard 5-minute lifetime (config-driven). Tell the client, then close.
      const closeTimer = setTimeout(() => {
        hub.send(pairId, { type: 'closing', reason: 'ttl' });
        ws.close(1000, 'ttl');
      }, TRANSPORT.WS_LIFETIME_MS);

      ws.on('close', () => {
        clearTimeout(closeTimer);
        hub.remove(pairId, ws);
        logger.info({ pairId }, 'ws: mac disconnected');
      });
      ws.on('error', () => {
        clearTimeout(closeTimer);
        hub.remove(pairId, ws);
      });
    });
  });

  return wss;
};
