import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { corsHeaders } from '../_shared/cors.ts'

// Input validation schema
const PublishDataSchema = z.object({
  propertyId: z.string().uuid(),
  imageUrls: z.array(z.string().url()).max(10),
  caption: z.string().min(1).max(5000).trim(),
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

    // Get user's Facebook page ID from profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('facebook_page_id, facebook_connected')
      .eq('user_id', user.id)
      .single()

    if (!profile?.facebook_connected || !profile?.facebook_page_id) {
      throw new Error('Facebook no conectado')
    }

    // Retrieve Facebook access token securely from Vault
    const { data: facebookToken, error: tokenError } = await supabaseAdmin.rpc('get_oauth_token', {
      _user_id: user.id,
      _provider: 'facebook'
    })

    if (tokenError || !facebookToken) {
      console.error('Failed to retrieve Facebook token:', tokenError);
      throw new Error('Facebook no conectado')
    }

    console.log('Publishing to Facebook...', { propertyId, imageUrls: imageUrls?.length })

    // Prepare content
    const fullMessage = `${caption}\n\n${hashtags.join(' ')}`

    let publishData
    
    if (imageUrls && imageUrls.length > 1) {
      // Multiple images - create photo album
      const photoIds = []
      
      // Upload each photo first
      for (const imageUrl of imageUrls) {
        const photoResponse = await fetch(
          `https://graph.facebook.com/v18.0/${profile.facebook_page_id}/photos`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              url: imageUrl,
              published: 'false',
              access_token: facebookToken
            })
          }
        )
        
        const photoData = await photoResponse.json()
        if (photoData.error) {
          throw new Error(`Facebook photo upload error: ${photoData.error.message}`)
        }
        
        photoIds.push({ media_fbid: photoData.id })
      }
      
      // Create album post
      const albumResponse = await fetch(
        `https://graph.facebook.com/v18.0/${profile.facebook_page_id}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            message: fullMessage,
            attached_media: JSON.stringify(photoIds),
            access_token: facebookToken
          })
        }
      )
      
      publishData = await albumResponse.json()
      
    } else if (imageUrls && imageUrls.length === 1) {
      // Single image
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${profile.facebook_page_id}/photos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            url: imageUrls[0],
            message: fullMessage,
            access_token: facebookToken
          })
        }
      )
      
      publishData = await response.json()
      
    } else {
      // Text only post
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${profile.facebook_page_id}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            message: fullMessage,
            access_token: facebookToken
          })
        }
      )
      
      publishData = await response.json()
    }
    
    if (publishData.error) {
      console.error('Facebook API error:', publishData.error);
      // Return generic error message to client
      throw new Error('Failed to publish to Facebook');
    }

    console.log('Facebook post published successfully:', publishData.id)

    // Update property with post info
    await supabaseAdmin
      .from('properties')
      .update({
        facebook_post_id: publishData.id,
        facebook_published_at: new Date().toISOString()
      })
      .eq('id', propertyId)

    return new Response(JSON.stringify({ 
      success: true, 
      postId: publishData.id,
      url: `https://www.facebook.com/${publishData.id}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Facebook publish error:', error)
    // Return generic error message to client, log details server-side
    return new Response(JSON.stringify({ error: 'Failed to publish content' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})