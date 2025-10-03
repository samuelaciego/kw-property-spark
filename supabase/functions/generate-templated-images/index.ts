import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const templatedApiKey = Deno.env.get('TEMPLATED_API_KEY');

    if (!templatedApiKey) {
      throw new Error('TEMPLATED_API_KEY no está configurada');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get property and profile data
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*, profiles(*)')
      .eq('id', propertyId)
      .single();

    if (propertyError) throw propertyError;

    // Template IDs from Templated.io
    const TEMPLATES = {
      instagram: '247ff9ee-e498-40d6-bb1b-d2ed15615c4a',
      stories: '247ff9ee-e498-40d6-bb1b-d2ed15615c4a',
      facebook: '247ff9ee-e498-40d6-bb1b-d2ed15615c4a'
    };

    // Prepare template data
    const templateData = {
      property_image_1: property.images?.[0] || '',
      property_image_2: property.images?.[1] || '',
      property_image_3: property.images?.[2] || '',
      price: property.price || 'N/A',
      address: property.address || '',
      beds: '3', // Extract from description if available
      baths: '2', // Extract from description if available
      agent_photo: property.profiles?.user_avatar_url || property.profiles?.avatar_url || '',
      agent_name: property.agent_name || property.profiles?.full_name || '',
      agent_phone: property.agent_phone || property.profiles?.phone || '',
      agent_email: property.profiles?.email || '',
      agency_logo: '' // Add agency logo URL if available
    };

    console.log('Generating images with Templated.io:', templateData);

    // Generate all three images in parallel
    const generateImage = async (templateId: string) => {
      const response = await fetch('https://api.templated.io/v1/render', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${templatedApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: templateId,
          layers: templateData
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Templated.io error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result.render_url;
    };

    const [instagramUrl, storiesUrl, facebookUrl] = await Promise.all([
      generateImage(TEMPLATES.instagram),
      generateImage(TEMPLATES.stories),
      generateImage(TEMPLATES.facebook)
    ]);

    console.log('Images generated:', { instagramUrl, storiesUrl, facebookUrl });

    // Download and upload images to Supabase Storage
    const uploadImage = async (url: string, filename: string) => {
      const imageResponse = await fetch(url);
      const blob = await imageResponse.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(`generated/${propertyId}/${filename}`, buffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    };

    const [instagramStorageUrl, storiesStorageUrl, facebookStorageUrl] = await Promise.all([
      uploadImage(instagramUrl, 'instagram.png'),
      uploadImage(storiesUrl, 'stories.png'),
      uploadImage(facebookUrl, 'facebook.png')
    ]);

    // Update property with generated image URLs
    const { error: updateError } = await supabase
      .from('properties')
      .update({
        generated_image_instagram: instagramStorageUrl,
        generated_image_stories: storiesStorageUrl,
        generated_image_facebook: facebookStorageUrl
      })
      .eq('id', propertyId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        images: {
          instagram: instagramStorageUrl,
          stories: storiesStorageUrl,
          facebook: facebookStorageUrl
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating images:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
