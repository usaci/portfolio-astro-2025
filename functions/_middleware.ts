// functions/_middleware.ts
export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  env: {
    BASIC_AUTH_USERNAME?: string;
    BASIC_AUTH_PASSWORD?: string;
  };
}): Promise<Response> {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // 公開パスの設定
  const publicPaths = ['/api/public', '/favicon.ico', '/robots.txt'];
  if (publicPaths.some(path => url.pathname.startsWith(path))) {
    return next();
  }

  // Basic認証の実装
  const username = env.BASIC_AUTH_USERNAME || 'admin';
  const password = env.BASIC_AUTH_PASSWORD || 'password';

  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'Content-Type': 'text/plain',
      },
    });
  }

  // Base64デコード
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = atob(base64Credentials);
  const [user, pass] = credentials.split(':');

  // 認証チェック
  if (user !== username || pass !== password) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
        'Content-Type': 'text/plain',
      },
    });
  }

  // 認証成功 - リクエストを続行
  return next();
}