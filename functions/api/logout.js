import { clearUidCookieHeader } from '../lib/cookie.js';

export async function onRequestGet(context) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': clearUidCookieHeader(context.request),
    },
  });
}
