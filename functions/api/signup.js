import { getD1 } from '../lib/env.js';
import { hashPassword } from '../lib/password.js';
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

function validateUserId(s) {
  if (typeof s !== 'string') return false;
  const t = s.trim();
  if (t.length < 4 || t.length > 64) return false;
  return /^[a-zA-Z0-9_-]+$/.test(t);
}

function validatePassword(s) {
  return typeof s === 'string' && s.length >= 8 && s.length <= 128;
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

  const userId = body.userId;
  const password = body.password;
  const passwordConfirm = body.passwordConfirm;

  if (!validateUserId(userId)) {
    return json({ error: '아이디는 4~64자 영문, 숫자, _, - 만 사용할 수 있습니다.' }, 400);
  }
  if (!validatePassword(password)) {
    return json({ error: '비밀번호는 8~128자로 입력해주세요.' }, 400);
  }
  if (password !== passwordConfirm) {
    return json({ error: '비밀번호 확인이 일치하지 않습니다.' }, 400);
  }

  const { saltHex, hashHex } = await hashPassword(password);

  const result = await db
    .prepare(
      'INSERT INTO users (user_id, password_hash, salt, created_at) VALUES (?, ?, ?, unixepoch())'
    )
    .bind(userId.trim(), hashHex, saltHex)
    .run();

  if (!result.success) {
    const err = result.error;
    const msg = typeof err === 'string' ? err : JSON.stringify(err ?? {});
    const lower = msg.toLowerCase();
    if (lower.includes('unique') || lower.includes('constraint')) {
      return json({ error: '이미 사용 중인 아이디입니다.' }, 409);
    }
    return json({ error: '가입 처리 중 오류가 발생했습니다.' }, 500);
  }

  const row = await db
    .prepare('SELECT id FROM users WHERE user_id = ?')
    .bind(userId.trim())
    .first();

  if (!row || row.id == null) {
    return json({ error: '가입 후 사용자 조회에 실패했습니다.' }, 500);
  }

  return json(
    { ok: true, userId: userId.trim() },
    201,
    {
      'Set-Cookie': setUidCookieHeader(context.request, row.id),
    }
  );
}
