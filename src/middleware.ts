// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the auth cookie from the request
  const authToken = request.cookies.get('submit-auth-token')?.value;

  // If the user tries to access /submit but doesn't have the cookie,
  // redirect them to the /login page.
  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname); // Optional: tell login where user was going
    return NextResponse.redirect(loginUrl);
  }

  // If the cookie exists, allow the request to proceed
  return NextResponse.next();
}

// This config tells the middleware to ONLY run on the /submit route
export const config = {
  matcher: '/submit',
}