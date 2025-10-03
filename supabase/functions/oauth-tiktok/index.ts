import { corsHeaders } from '../_shared/cors.ts'

const TIKTOK_CLIENT_KEY = Deno.env.get('TIKTOK_CLIENT_KEY')
const TIKTOK_CLIENT_SECRET = Deno.env.get('TIKTOK_CLIENT_SECRET')

if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET) {
  throw new Error('Missing TikTok app credentials')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (action === 'get_auth_url') {
      const userId = url.searchParams.get('user_id');
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const redirectUri = `${url.origin}/supabase/functions/oauth-tiktok?action=callback`
      const scope = 'video.upload,user.info.basic'
      const csrfState = crypto.randomUUID()
      
      // Store CSRF state in Supabase for validation (requires auth)
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      )

      // Verify user is authenticated and matches the userId
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || user.id !== userId) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Store state with expiration (10 minutes)
      const stateExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await supabase.from('oauth_states').insert({
        state: csrfState,
        user_id: userId,
        provider: 'tiktok',
        expires_at: stateExpiry
      });
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize/?` +
        `client_key=${TIKTOK_CLIENT_KEY}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${csrfState}`

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'callback') {
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      
      if (!code || !state) {
        throw new Error('Missing authorization code or state')
      }

      // Validate CSRF state token
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabaseService = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      // Retrieve and validate state
      const { data: stateData, error: stateError } = await supabaseService
        .from('oauth_states')
        .select('user_id, expires_at')
        .eq('state', state)
        .eq('provider', 'tiktok')
        .single();

      if (stateError || !stateData) {
        console.error('Invalid OAuth state:', stateError);
        return new Response(null, {
          status: 302,
          headers: {
            ...corsHeaders,
            'Location': `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/profile?error=invalid_state`
          }
        });
      }

      // Check if state has expired
      if (new Date(stateData.expires_at) < new Date()) {
        console.error('OAuth state expired');
        await supabaseService.from('oauth_states').delete().eq('state', state);
        return new Response(null, {
          status: 302,
          headers: {
            ...corsHeaders,
            'Location': `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/profile?error=state_expired`
          }
        });
      }

      const userId = stateData.user_id;

      // Delete used state token
      await supabaseService.from('oauth_states').delete().eq('state', state);
      
      // Exchange code for access token
      const redirectUri = `${url.origin}/supabase/functions/oauth-tiktok?action=callback`
      const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        },
        body: new URLSearchParams({
          client_key: TIKTOK_CLIENT_KEY,
          client_secret: TIKTOK_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error)
      }

      // Get user info
      const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      })
      const userData = await userResponse.json()

      // Store tokens in user's profile (supabaseService already created above)
      await supabaseService
        .from('profiles')
        .update({
          tiktok_connected: true,
          tiktok_access_token: tokenData.access_token,
          tiktok_username: userData.data?.user?.display_name || userData.data?.user?.username
        })
        .eq('user_id', userId)

      // Redirect back to app
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/profile?connected=tiktok`
        }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('TikTok OAuth error:', error)
    // Return generic error message to client, log details server-side
    return new Response(JSON.stringify({ error: 'OAuth connection failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})