const COOKIE_NAME = 'kp_uid';

export function parseUidCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';');
  for (const p of parts) {
    const [name, ...rest] = p.trim().split('=');
    if (name === COOKIE_NAME && rest.length) {
      const v = rest.join('=').trim();
      const n = parseInt(v, 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
  }
  return null;
}

export function setUidCookieHeader(request, userId) {
  const secure = new URL(request.url).protocol === 'https:';
  const base = `${COOKIE_NAME}=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
  return secure ? `${base}; Secure` : base;
}

export function clearUidCookieHeader(request) {
  const secure = new URL(request.url).protocol === 'https:';
  const base = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  return secure ? `${base}; Secure` : base;
}
