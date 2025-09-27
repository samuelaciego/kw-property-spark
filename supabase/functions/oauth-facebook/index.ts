import { corsHeaders } from '../_shared/cors.ts'

const FACEBOOK_APP_ID = Deno.env.get('FACEBOOK_APP_ID')
const FACEBOOK_APP_SECRET = Deno.env.get('FACEBOOK_APP_SECRET')

if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
  throw new Error('Missing Facebook app credentials')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (action === 'get_auth_url') {
      const redirectUri = `${url.origin}/supabase/functions/oauth-facebook?action=callback`
      const scope = 'pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish'
      
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${FACEBOOK_APP_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `state=${url.searchParams.get('user_id')}`

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'callback') {
      const code = url.searchParams.get('code')
      const userId = url.searchParams.get('state')
      
      if (!code || !userId) {
        throw new Error('Missing authorization code or user ID')
      }

      // Exchange code for access token
      const redirectUri = `${url.origin}/supabase/functions/oauth-facebook?action=callback`
      const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          redirect_uri: redirectUri,
          code: code
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (tokenData.error) {
        throw new Error(tokenData.error.message)
      }

      // Get user's Facebook pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`
      )
      const pagesData = await pagesResponse.json()

      // Get Instagram business accounts connected to pages
      const instagramAccounts = []
      for (const page of pagesData.data || []) {
        try {
          const igResponse = await fetch(
            `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
          )
          const igData = await igResponse.json()
          if (igData.instagram_business_account) {
            instagramAccounts.push({
              id: igData.instagram_business_account.id,
              page_id: page.id,
              page_name: page.name,
              access_token: page.access_token
            })
          }
        } catch (error) {
          console.log(`No Instagram account for page ${page.name}`)
        }
      }

      // Store tokens in user's profile
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

      await supabase
        .from('profiles')
        .update({
          facebook_connected: true,
          facebook_access_token: tokenData.access_token,
          facebook_page_id: pagesData.data?.[0]?.id,
          instagram_connected: instagramAccounts.length > 0,
          instagram_access_token: instagramAccounts[0]?.access_token,
          instagram_account_id: instagramAccounts[0]?.id
        })
        .eq('user_id', userId)

      // Redirect back to app
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/profile?connected=facebook`
        }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Facebook OAuth error:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})