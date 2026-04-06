import { getD1 } from './lib/env.js';
import { parseUidCookie } from './lib/cookie.js';

export async function onRequest(context) {
  const { request } = context;
  const m = request.method;
  if (m !== 'GET' && m !== 'HEAD') {
    return context.next();
  }

  const db = getD1(context.env);
  if (!db) {
    return Response.redirect(new URL('/signup.html', request.url), 302);
  }

  const uid = parseUidCookie(request.headers.get('Cookie'));
  if (!uid) {
    return Response.redirect(new URL('/signup.html', request.url), 302);
  }

  const row = await db.prepare('SELECT id FROM users WHERE id = ?').bind(uid).first();
  if (!row) {
    return Response.redirect(new URL('/signup.html', request.url), 302);
  }

  return context.next();
}
