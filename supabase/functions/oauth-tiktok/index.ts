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
      const redirectUri = `${url.origin}/supabase/functions/oauth-tiktok?action=callback`
      const scope = 'video.upload,user.info.basic'
      const csrfState = crypto.randomUUID()
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize/?` +
        `client_key=${TIKTOK_CLIENT_KEY}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${csrfState}_${url.searchParams.get('user_id')}`

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

      const userId = state.split('_')[1]
      
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

      // Store tokens in user's profile
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      await supabase
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
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})