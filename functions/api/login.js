import { getD1 } from '../lib/env.js';
import { verifyPassword } from '../lib/password.js';
import { setUidCookieHeader } from '../lib/cookie.js';

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  });
}

export async function onRequestPost(context) {
  const db = getD1(context.env);
  if (!db) return json({ error: '데이터베이스 설정이 없습니다.' }, 500);

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: '잘못된 요청입니다.' }, 400);
  }

  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!userId || !password) {
    return json({ error: '아이디와 비밀번호를 입력해주세요.' }, 400);
  }

  const row = await db
    .prepare('SELECT id, password_hash, salt FROM users WHERE user_id = ?')
    .bind(userId)
    .first();

  if (!row) {
    return json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, 401);
  }

  const ok = await verifyPassword(password, row.salt, row.password_hash);
  if (!ok) {
    return json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, 401);
  }

  return json(
    { ok: true, userId },
    200,
    {
      'Set-Cookie': setUidCookieHeader(context.request, row.id),
    }
  );
}
