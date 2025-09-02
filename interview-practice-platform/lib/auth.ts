import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

export function signSession(payload: { userId: number; username: string; role: string }) {
  const token = jwt.sign(payload, AUTH_SECRET, { expiresIn: MAX_AGE })
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function setSessionCookieOnResponse(res: import('next/server').NextResponse, payload: { userId: number; username: string; role: string }) {
  const token = jwt.sign(payload, AUTH_SECRET, { expiresIn: MAX_AGE })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function clearSession() {
  cookies().delete(COOKIE_NAME)
}

export async function getSession(): Promise<{ userId: number; username: string; role: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    return jwt.verify(token, AUTH_SECRET) as any
  } catch {
    return null
  }
}

export const requireSession = () => {
  const session = getSession()
  if (!session) throw new Error('UNAUTHORIZED')
  return session
}


