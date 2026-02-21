import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('user')?.value;
  const url = request.nextUrl;

  // check if the URL matches the mobile app pattern
  const settingsProfileIdMatch = url.pathname.match(
    /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/settings/,
  );
  const isSettingsRoute = settingsProfileIdMatch !== null;

  const chatProfileIdMatch = url.pathname.match(
    /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/chat/,
  );
  const isChatRoute = chatProfileIdMatch !== null;

  if (
    !currentUser &&
    !url.pathname.startsWith('/login') &&
    !url.pathname.startsWith('/signin')
  ) {
    const response = NextResponse.redirect(new URL('/login', request.url));

    if (isSettingsRoute) {
      // we need to store the original URL and profile ID in cookies that will persist through auth
      response.cookies.set('redirectUrl', url.pathname, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 300,
      });

      response.cookies.set('profileId', settingsProfileIdMatch![1], {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 300,
      });
    }

    if (isChatRoute) {
      // we need to store the original URL and profile ID in cookies that will persist through auth
      response.cookies.set('redirectUrl', url.pathname, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 300,
      });

      response.cookies.set('profileId', chatProfileIdMatch![1], {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 300,
      });
    }

    return response;
  }

  // if user is authenticated and there's a redirect URL, let the root page handle it
  if (currentUser && url.pathname === '/') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|gif|svg)$).*)'],
};
