import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  const url = req.nextUrl

  // 保護學生與教師路由
  const protectedPrefixes = ['/student', '/teacher']
  const isProtected = protectedPrefixes.some((p) => url.pathname.startsWith(p))

  // 登錄與註冊頁不需要會話
  const publicPaths = ['/', '/register']
  const isPublic = publicPaths.includes(url.pathname)

  if (isProtected && !session) {
    const loginUrl = new URL('/', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|static|public|favicon.ico).*)'],
}


