import { NextResponse } from 'next/server'

function middleware(req) {
  const { pathname } = req.nextUrl

  const accessToken = req.cookies.get('accessToken')?.value
  let loggedIn = false

  if (accessToken !== undefined) loggedIn = true

  // Redirect to login if the user is not logged in and trying to access a protected route
  if (pathname.startsWith('/document') && !loggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect to the home page or dashboard if the user is logged in and trying to access the login page
  if (pathname.startsWith('/login') && loggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

const config = {
  matcher: '/protected/:path*', // Adjust the matcher to your protected routes
}

module.exports = {
  middleware,
  config,
}
