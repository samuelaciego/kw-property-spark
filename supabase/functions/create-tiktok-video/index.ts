import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { propertyId, imageUrls, title, description } = await req.json()
    
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

    // Get user's TikTok credentials
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('tiktok_access_token')
      .eq('user_id', user.id)
      .single()

    if (!profile?.tiktok_access_token) {
      throw new Error('TikTok no conectado')
    }

    console.log('Creating TikTok video...', { propertyId, imageUrls: imageUrls?.length })

    // For now, we'll use a simple approach - upload the first image as a video frame
    // In a full implementation, you'd create an actual video from multiple images
    const imageUrl = imageUrls[0]
    
    if (!imageUrl) {
      throw new Error('No hay imágenes para crear el video')
    }

    // Step 1: Initialize upload session
    const initResponse = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${profile.tiktok_access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_info: {
          title: title,
          description: description,
          privacy_level: 'SELF_ONLY', // Start with private for testing
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: 1024 * 1024 * 10, // 10MB estimate
          chunk_size: 1024 * 1024 * 5,  // 5MB chunks
          total_chunk_count: 1
        }
      })
    })

    const initData = await initResponse.json()
    
    if (initData.error) {
      throw new Error(`TikTok init error: ${initData.error.message}`)
    }

    console.log('TikTok upload session initialized:', initData.data?.publish_id)

    // For this example, we'll return the publish_id and let the client handle video creation
    // In a full implementation, you'd:
    // 1. Download the images
    // 2. Create a video using FFmpeg or similar
    // 3. Upload the video in chunks
    // 4. Complete the upload

    return new Response(JSON.stringify({ 
      success: true, 
      publishId: initData.data?.publish_id,
      uploadUrl: initData.data?.upload_url,
      message: 'Video creation initiated. Complete upload process separately.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('TikTok video creation error:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})