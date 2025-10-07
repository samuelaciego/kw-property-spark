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

    // Get property data
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError) throw propertyError;

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', property.user_id)
      .single();

    if (profileError) console.warn('Profile not found:', profileError);

    // Template IDs from Templated.io
    const TEMPLATES = {
      instagram: '247ff9ee-e498-40d6-bb1b-d2ed15615c4a',
      stories: '247ff9ee-e498-40d6-bb1b-d2ed15615c4a',
      facebook: '247ff9ee-e498-40d6-bb1b-d2ed15615c4a'
    };

    // Prepare layers object for Templated.io API
    const layers = {
      BG: {},
      Footer: {},
      Info: {},
      IMG1: { 
        image_url: property.images?.[0] || '' 
      },
      IMGCointainer: {},
      IMG2: { 
        image_url: property.images?.[1] || '' 
      },
      IMG3: { 
        image_url: property.images?.[2] || '' 
      },
      IMGTitle: { 
        text: "¡Nueva Propiedad!", 
        color: "rgba(255, 255, 255, 1)" 
      },
      PropertyTitle: { 
        text: property.title || "Recién Listado", 
        color: "rgba(0,0,0, 1)" 
      },
      PropertyPrice: { 
        text: property.price || "N/A", 
        color: "rgba(0,0,0, 1)" 
      },
      PropertyLocation: { 
        text: property.address || "", 
        color: "rgba(0,0,0, 1)" 
      },
      AgentImage: { 
        image_url: profile?.user_avatar_url || profile?.avatar_url || '' 
      },
      AgentName: { 
        text: profile?.full_name || property.agent_name || "", 
        color: "rgba(0,0,0, 1)" 
      },
      AgentPhone: { 
        text: profile?.phone || property.agent_phone || "", 
        color: "rgba(0,0,0, 1)" 
      },
      PhoneIcon: {},
      EmailIcon: {},
      AgentEmail: { 
        text: profile?.email || "", 
        color: "rgba(0,0,0, 1)" 
      },
      AgentAgency: { 
        image_url: profile?.agency_logo_url || '' 
      }
    };

    console.log('Layers prepared for Templated.io:', layers);

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
          format: 'jpg',
          layers: layers
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
