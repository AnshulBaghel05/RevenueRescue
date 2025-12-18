import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const state = searchParams.get('state');

  // Verify state for CSRF protection
  const savedState = request.cookies.get('shopify_oauth_state')?.value;

  if (!code || !shop || !state || state !== savedState) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }

  try {
    const clientId = process.env.SHOPIFY_CLIENT_ID;
    const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Shopify OAuth not configured');
    }

    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user from session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url));
    }

    // Store Shopify connection in database
    await supabase.from('shopify_connections').insert({
      user_id: user.id,
      shop_domain: shop,
      access_token: accessToken,
      scopes: process.env.SHOPIFY_SCOPES,
      created_at: new Date().toISOString(),
    });

    // Redirect to dashboard with success
    const response = NextResponse.redirect(new URL('/dashboard?shopify=connected', request.url));

    // Clear the state cookie
    response.cookies.delete('shopify_oauth_state');

    return response;
  } catch (error) {
    console.error('Shopify OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}
