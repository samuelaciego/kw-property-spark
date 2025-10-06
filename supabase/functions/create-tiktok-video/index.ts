import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Input validation schema
const RequestSchema = z.object({
  propertyId: z.string().uuid(),
  imageUrls: z.array(z.string().url()).min(1).max(10),
  title: z.string().min(1).max(150),
  description: z.string().max(2200)
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validation = RequestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid input data',
        details: validation.error.issues
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { propertyId, imageUrls, title, description } = validation.data;
    
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

    console.log('Creating TikTok video for property:', propertyId);

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
      console.error('TikTok API error');
      throw new Error('Failed to create TikTok video');
    }

    console.log('TikTok upload session initialized');

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
    console.error('TikTok video creation error');
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to create video' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})