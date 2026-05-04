import { Request } from 'express';
import * as crypto from 'crypto';

export function getClientIpHash(request: Request): string {
  let ip =
    (request.headers['x-forwarded-for'] as string) ||
    (request.headers['x-real-ip'] as string) ||
    request.ip ||
    request.socket.remoteAddress ||
    '';

  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return crypto.createHash('sha256').update(ip).digest('hex');
}
