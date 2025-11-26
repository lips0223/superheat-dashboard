import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 定义不需要认证的路径
const publicPaths = [
  '/login',
  '/auth',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/public',
];

// 定义需要认证的路径模式
const protectedPaths = [
  '/',
  '/dashboard',
  '/device',
  '/customer',
  '/earning',
  '/ticket',
];

// 检查路径是否为公开路径
function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => pathname.startsWith(path));
}

// 检查路径是否需要保护
function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(path => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 如果是公开路径，直接放行
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 检查用户认证状态
  const authToken = request.cookies.get('auth-token')?.value;
  const userInfo = request.cookies.get('user-info')?.value;

  // 如果是受保护的路径但没有认证信息
  if (isProtectedPath(pathname) && (!authToken || !userInfo)) {
    // 构建登录页URL，包含重定向参数
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // 如果已经登录但访问登录页，重定向到首页
  if (pathname.startsWith('/login') && authToken && userInfo) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  // 匹配所有路径，除了以下路径：
  // - api routes that start with `/api/` (API路由)
  // - static files (静态文件)
  // - _next/static (Next.js 静态资源)
  // - _next/image (Next.js 图片优化)
  // - favicon.ico (网站图标)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};