import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { corsHeaders } from '../_shared/cors.ts'

// Input validation schema
const PublishDataSchema = z.object({
  propertyId: z.string().uuid(),
  imageUrls: z.array(z.string().url()).min(1).max(10),
  caption: z.string().min(1).max(2200).trim(), // Instagram limit
  hashtags: z.array(z.string().regex(/^#[\w]+$/)).max(30)
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = PublishDataSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data',
          details: validationResult.error.issues
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { propertyId, imageUrls, caption, hashtags } = validationResult.data;
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get auth header and extract user
    const authHeader = req.headers.get('Authorization')!
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user } } = await supabaseUser.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    // Get user's Instagram account ID from profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('instagram_account_id, instagram_connected')
      .eq('user_id', user.id)
      .single()

    if (!profile?.instagram_connected || !profile?.instagram_account_id) {
      throw new Error('Instagram no conectado')
    }

    // Retrieve Instagram access token securely from Vault
    const { data: instagramToken, error: tokenError } = await supabaseAdmin.rpc('get_oauth_token', {
      _user_id: user.id,
      _provider: 'instagram'
    })

    if (tokenError || !instagramToken) {
      console.error('Failed to retrieve Instagram token:', tokenError);
      throw new Error('Instagram no conectado')
    }

    console.log('Publishing to Instagram...', { propertyId, imageUrls: imageUrls?.length })

    // Prepare content
    const fullCaption = `${caption}\n\n${hashtags.join(' ')}`
    const imageUrl = imageUrls[0] // Instagram single post for now

    // Step 1: Create media container
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${profile.instagram_account_id}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          image_url: imageUrl,
          caption: fullCaption,
          access_token: instagramToken
        })
      }
    )

    const mediaData = await mediaResponse.json()
    
    if (mediaData.error) {
      console.error('Instagram API error creating container:', mediaData.error);
      // Return generic error message to client
      throw new Error('Failed to publish to Instagram');
    }

    // Step 2: Publish media container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${profile.instagram_account_id}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          creation_id: mediaData.id,
          access_token: instagramToken
        })
      }
    )

    const publishData = await publishResponse.json()
    
    if (publishData.error) {
      console.error('Instagram API error publishing:', publishData.error);
      // Return generic error message to client
      throw new Error('Failed to publish to Instagram');
    }

    console.log('Instagram post published successfully:', publishData.id)

    // Update property with post info
    await supabaseAdmin
      .from('properties')
      .update({
        instagram_post_id: publishData.id,
        instagram_published_at: new Date().toISOString()
      })
      .eq('id', propertyId)

    return new Response(JSON.stringify({ 
      success: true, 
      postId: publishData.id,
      url: `https://www.instagram.com/p/${publishData.id}/`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Instagram publish error:', error)
    // Return generic error message to client, log details server-side
    return new Response(JSON.stringify({ error: 'Failed to publish content' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})