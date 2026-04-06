/**
 * wrangler 바인딩명(KPROMINENT_DESIGN_DB) 또는 대시보드에서 지정한 이름(예: kprominent-design-db) 모두 허용
 */
export function getD1(env) {
  if (env.KPROMINENT_DESIGN_DB) return env.KPROMINENT_DESIGN_DB;
  if (env['kprominent-design-db']) return env['kprominent-design-db'];
  return null;
}
