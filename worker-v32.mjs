// ATLAS v3.2: stream immutable deployment assets. Existing R2 is retained for rollback.
const VERSION = '3.2.0';
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://t1.kakaocdn.net https://t1.daumcdn.net https://display.ad.daum.net https://*.ad.daum.net https://serv.ds.kakao.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.kakaocdn.net https://*.daumcdn.net https://*.ad.daum.net https://*.ds.kakao.com",
  "connect-src 'self' https://*.ad.daum.net https://*.ds.kakao.com https://aem-kakao-collector.onkakao.net",
  "font-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'self'",
  "frame-src https://*.ad.daum.net https://*.ds.kakao.com https://t1.kakaocdn.net",
  "form-action 'self'", "upgrade-insecure-requests"
].join('; ');
export default {
  async fetch(request, env) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method Not Allowed', {status:405,headers:{Allow:'GET, HEAD','Cache-Control':'no-store'}});
    }
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set('Content-Security-Policy', CSP);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    headers.set('X-Atlas-Version', VERSION);
    if (url.pathname.endsWith('.md')) headers.set('Content-Type','text/markdown; charset=utf-8');
    if (url.pathname.endsWith('.json')) headers.set('Content-Type','application/json; charset=utf-8');
    if (url.pathname.endsWith('.txt')) headers.set('Content-Type','text/plain; charset=utf-8');
    if (url.searchParams.has('qa') || url.searchParams.has('adpreview') || url.searchParams.has('adsettings')) {
      headers.set('X-Robots-Tag','noindex, nofollow');
      headers.set('Cache-Control','no-store');
    }
    return new Response(request.method === 'HEAD' ? null : response.body, {
      status: response.status, statusText: response.statusText, headers
    });
  }
};
