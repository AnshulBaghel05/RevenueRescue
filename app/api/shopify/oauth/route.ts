import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shop = searchParams.get('shop');

  if (!shop) {
    return NextResponse.json(
      { error: 'Shop parameter is required' },
      { status: 400 }
    );
  }

  // Validate shop URL
  const shopDomain = shop.endsWith('.myshopify.com') ? shop : `${shop}.myshopify.com`;

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI;
  const scopes = process.env.SHOPIFY_SCOPES;

  if (!clientId || !redirectUri || !scopes) {
    return NextResponse.json(
      { error: 'Shopify OAuth not configured' },
      { status: 500 }
    );
  }

  // Generate state for CSRF protection
  const state = Math.random().toString(36).substring(7);

  // Build OAuth URL
  const authUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

  // Store state in session/cookie for verification
  const response = NextResponse.redirect(authUrl);
  response.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  });

  return response;
}
