import {readNativeGrant} from './grant';
export const nativeEmbedDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://*.paddle.com",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://*.paddle.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://*.paddle.com https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net",
  "frame-src 'self' https://*.paddle.com https://*.google.com https://*.doubleclick.net",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests"
];


export function nativeFramePolicy(token:string,secret:string){let ancestor="'none'";try{ancestor=readNativeGrant(token,secret).allowedOrigin;}catch{}return [...nativeEmbedDirectives,'frame-ancestors '+ancestor].join('; ');}
