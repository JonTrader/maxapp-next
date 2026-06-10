import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/auth'

export async function proxy(request: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/jobapplications/:path*',
    '/resumes/:path*',
  ],
}