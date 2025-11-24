import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
	console.log('=== Astro Middleware called ===');
	console.log('URL:', context.url.pathname);
	console.log('Method:', context.request.method);

	// 公開パスの設定
	const publicPaths = ['/api/public', '/favicon.ico', '/robots.txt'];
	if (publicPaths.some(path => context.url.pathname.startsWith(path))) {
		console.log('Public path, skipping auth');
		return next();
	}

	// Basic認証の実装
	const username = import.meta.env.BASIC_AUTH_USERNAME || 'admin';
	const password = import.meta.env.BASIC_AUTH_PASSWORD || 'password';

	const authHeader = context.request.headers.get('Authorization');
	console.log('Auth header:', authHeader ? 'present' : 'missing');

	if (!authHeader || !authHeader.startsWith('Basic ')) {
		console.log('No auth header, returning 401');
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

	console.log('Decoded credentials:', { user, passMatch: pass === password });

	// 認証チェック
	if (user !== username || pass !== password) {
		console.log('Auth failed');
		return new Response('Unauthorized', {
			status: 401,
			headers: {
				'WWW-Authenticate': 'Basic realm="Secure Area"',
				'Content-Type': 'text/plain',
			},
		});
	}

	console.log('Auth successful');
	return next();
};